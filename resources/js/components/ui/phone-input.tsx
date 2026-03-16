/**
 * PhoneInput — ground-up rewrite
 *
 * Architecture:
 * ─ Single source of truth: { country, digits } where `digits` = raw national
 *   number only (no separators, no dial code prefix, no country code mixed in).
 * ─ All formatting is a pure render-time transformation — the stored value is
 *   always clean digits.
 * ─ Input is locked (readOnly) until a country is selected. Clicking the locked
 *   field automatically opens the country picker.
 * ─ No React state is used for "hint modes" or "awaiting first digit" — those
 *   caused async drift. Instead, a single `inputRef` gives us direct DOM
 *   control, and the country selector drives state transitions explicitly.
 * ─ Country auto-detection from "+XXX" or "00XXX" prefixes happens in a pure
 *   function that runs on every onChange, with no side effects on bare digits.
 */

import { countries as countriesData } from "country-data-list"
import { ChevronDown, Phone } from "lucide-react"
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react"
import { CircleFlag } from "react-circle-flags"
import { useLanguage } from "@/components/language-provider"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Country {
  alpha2: string
  alpha3: string
  name: string
  displayedName: string
  countryCallingCodes: string[]
  currencies: string[]
  languages: string[]
  status: string
  emoji?: string
  ioc?: string
}

export interface PhoneInputValue {
  country?: Country
  /** Raw national digits only — no dial code, no separators */
  digits: string
  /** E.164 formatted: +[dialCode][digits] */
  e164: string
}

export interface PhoneInputProps {
  value?: { country?: Country; digits?: string }
  defaultCountry?: string
  onChange?: (val: PhoneInputValue) => void
  onCountryChange?: (country: Country | undefined) => void
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  autoComplete?: string
  size?: "sm" | "md" | "lg"
  className?: string
  locale?: string
  dir?: "ltr" | "rtl"
  placeholder?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Country data — built once at module level
// ─────────────────────────────────────────────────────────────────────────────

type RawCountry = {
  name?: string; alpha2?: string; alpha3?: string; status?: string
  currencies?: string[]; languages?: string[]; countryCallingCodes?: string[]
  ioc?: string; emoji?: string
}

const ALL_COUNTRIES: Country[] = (countriesData.all as RawCountry[])
  .filter(c =>
    c.name && c.alpha2 && c.alpha3 &&
    c.status && c.status !== "deleted" &&
    c.ioc !== "PRK" &&
    (c.countryCallingCodes?.length ?? 0) > 0
  )
  .map(c => ({
    alpha2: c.alpha2!,
    alpha3: c.alpha3!,
    name: c.name!,
    displayedName: c.name!,
    countryCallingCodes: c.countryCallingCodes!,
    currencies: c.currencies ?? [],
    languages: c.languages ?? [],
    status: c.status!,
    emoji: c.emoji,
    ioc: c.ioc,
  }))

// Dial-code → country index, sorted longest-first for greedy matching
// (+1868 Trinidad matches before +1 USA)
const DIAL_INDEX: Array<{ digits: string; country: Country }> = ALL_COUNTRIES
  .flatMap(c => c.countryCallingCodes.map(code => ({
    digits: code.replace(/\D/g, ""),
    country: c,
  })))
  .filter(e => e.digits.length > 0)
  .sort((a, b) => b.digits.length - a.digits.length)

// ─────────────────────────────────────────────────────────────────────────────
// Phone masks  —  # = digit slot, other chars = literal separators
// Keyed by E.164 dial code string (e.g. "+963")
// ─────────────────────────────────────────────────────────────────────────────

const MASKS: Record<string, string> = {
  "+1":   "(###) ###-####",
  "+7":   "### ###-##-##",
  "+20":  "## #### ####",
  "+27":  "## ### ####",
  "+30":  "## #### ####",
  "+31":  "# #### ####",
  "+32":  "### ## ## ##",
  "+33":  "# ## ## ## ##",
  "+34":  "### ### ###",
  "+36":  "## ### ####",
  "+39":  "## #### ####",
  "+40":  "## ### ####",
  "+41":  "## ### ## ##",
  "+43":  "### ######",
  "+44":  "#### ######",
  "+45":  "## ## ## ##",
  "+46":  "##-### ## ##",
  "+47":  "### ## ###",
  "+48":  "### ### ###",
  "+49":  "### ########",
  "+51":  "### ### ###",
  "+52":  "## #### ####",
  "+54":  "## ####-####",
  "+55":  "## #####-####",
  "+56":  "# #### ####",
  "+57":  "### ### ####",
  "+58":  "###-###-####",
  "+60":  "##-#### ####",
  "+61":  "# #### ####",
  "+62":  "###-####-####",
  "+63":  "### ### ####",
  "+64":  "## ### ####",
  "+65":  "#### ####",
  "+66":  "##-####-####",
  "+81":  "##-####-####",
  "+82":  "##-####-####",
  "+84":  "### ### ####",
  "+86":  "### #### ####",
  "+90":  "### ### ## ##",
  "+91":  "##### #####",
  "+92":  "### #######",
  "+93":  "## ### ####",
  "+94":  "## ### ####",
  "+98":  "### ### ####",
  "+212": "##-####-####",
  "+213": "### ## ## ##",
  "+216": "## ### ###",
  "+218": "##-#######",
  "+234": "### ### ####",
  "+249": "## ### ####",
  "+251": "## ### ####",
  "+254": "### ######",
  "+255": "### ### ###",
  "+256": "### ######",
  "+263": "## ### ####",
  "+351": "### ### ###",
  "+352": "### ###",
  "+353": "## ### ####",
  "+354": "### ####",
  "+355": "## ### ####",
  "+356": "#### ####",
  "+357": "## ######",
  "+358": "## ### ## ##",
  "+359": "## ### ####",
  "+370": "### ## ###",
  "+371": "## ### ###",
  "+372": "#### ####",
  "+373": "## ### ###",
  "+374": "## ### ###",
  "+375": "## ###-##-##",
  "+380": "## ### ## ##",
  "+381": "## ### ####",
  "+385": "## ### ###",
  "+386": "## ### ###",
  "+420": "### ### ###",
  "+421": "### ### ###",
  "+501": "### ####",
  "+502": "#### ####",
  "+503": "#### ####",
  "+504": "#### ####",
  "+505": "#### ####",
  "+506": "#### ####",
  "+507": "#### ####",
  "+591": "# ### ####",
  "+593": "## ### ####",
  "+595": "### ######",
  "+598": "## ### ## ##",
  "+852": "#### ####",
  "+855": "## ### ###",
  "+880": "#### ######",
  "+886": "### ### ###",
  "+960": "### ####",
  "+961": "## ### ###",
  "+962": "# #### ####",
  "+963": "### ### ###",
  "+964": "### ### ####",
  "+965": "#### ####",
  "+966": "## ### ####",
  "+967": "### ### ###",
  "+968": "## ### ###",
  "+970": "## ### ####",
  "+971": "## ### ####",
  "+972": "##-###-####",
  "+973": "#### ####",
  "+974": "#### ####",
  "+976": "## ## ####",
  "+977": "##-###-####",
  "+992": "## ### ####",
  "+993": "## ### ####",
  "+994": "## ### ## ##",
  "+995": "### ## ## ##",
  "+996": "### ### ###",
  "+998": "## ### ####",
}

// ─────────────────────────────────────────────────────────────────────────────
// Pure utility functions
// ─────────────────────────────────────────────────────────────────────────────

/** Strip everything except digits */
const onlyDigits = (s: string) => s.replace(/\D/g, "")

/** Count # slots in a mask */
const maskCapacity = (mask: string) => (mask.match(/#/g) ?? []).length

/**
 * Apply mask to raw digits.
 * Returns formatted string — may be partial if digits < capacity.
 */
function applyMask(digits: string, mask: string): string {
  let di = 0
  let out = ""
  for (let mi = 0; mi < mask.length; mi++) {
    if (di >= digits.length) break
    if (mask[mi] === "#") {
      out += digits[di++]
    } else if (di < digits.length) {
      out += mask[mi]
    }
  }
  return out
}

/**
 * Detect country from an explicitly-prefixed input (+XXX or 00XXX).
 * NEVER matches bare digit strings to avoid clearing the field mid-type.
 * Returns { country, nationalDigits } or null.
 */
function detectDialCode(raw: string): { country: Country; nationalDigits: string } | null {
  const norm = raw
    .replace(/[\u0660-\u0669]/g, d => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 48))
    .replace(/[\u06F0-\u06F9]/g, d => String.fromCharCode(d.charCodeAt(0) - 0x06F0 + 48))

  const hasPrefix = norm.startsWith("+") || norm.startsWith("00")
  if (!hasPrefix) return null

  const digits = norm.startsWith("+")
    ? norm.slice(1).replace(/\D/g, "")
    : norm.slice(2).replace(/\D/g, "")

  if (!digits) return null

  for (const { digits: code, country } of DIAL_INDEX) {
    if (digits.startsWith(code)) {
      return { country, nationalDigits: digits.slice(code.length) }
    }
  }
  return null
}

/** Normalise Arabic/Persian numerals to Western digits */
function normaliseDigits(s: string): string {
  return s
    .replace(/[\u0660-\u0669]/g, d => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 48))
    .replace(/[\u06F0-\u06F9]/g, d => String.fromCharCode(d.charCodeAt(0) - 0x06F0 + 48))
}

function buildE164(country: Country | undefined, digits: string): string {
  if (!country || !digits) return ""
  const code = country.countryCallingCodes[0] ?? ""
  return `${code}${digits}`
}

export function lookupCountry(code: string): Country | undefined {
  const up = code.toUpperCase()
  return ALL_COUNTRIES.find(c =>
    c.alpha2.toUpperCase() === up || c.alpha3.toUpperCase() === up
  )
}

function isRtl(locale: string) {
  return ["ar", "he", "fa", "ur"].includes(locale.split("-")[0].toLowerCase())
}

// ─────────────────────────────────────────────────────────────────────────────
// State machine — single reducer drives all transitions
// ─────────────────────────────────────────────────────────────────────────────

interface PhoneState {
  country: Country | undefined
  /** Raw national digits — no dial code, no mask separators */
  digits: string
}

type PhoneAction =
  | { type: "SELECT_COUNTRY"; country: Country | undefined }
  | { type: "SET_DIGITS"; digits: string }
  | { type: "DETECT_AND_SET"; country: Country; nationalDigits: string }
  | { type: "RESET" }

function phoneReducer(state: PhoneState, action: PhoneAction): PhoneState {
  switch (action.type) {
    case "SELECT_COUNTRY":
      // Country changed → digits always reset to empty
      return { country: action.country, digits: "" }

    case "SET_DIGITS":
      return { ...state, digits: action.digits }

    case "DETECT_AND_SET":
      // International prefix detected — switch country and set national digits
      return { country: action.country, digits: action.nationalDigits }

    case "RESET":
      return { country: undefined, digits: "" }

    default:
      return state
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Country Selector — self-contained popover, no prop drilling
// ─────────────────────────────────────────────────────────────────────────────

interface CountrySelectorProps {
  selected: Country | undefined
  onSelect: (country: Country) => void
  disabled?: boolean
  locale: string
  dir: "ltr" | "rtl"
  placeholder: string
  searchPlaceholder: string
  noResultsText: string
  triggerRef?: React.RefObject<HTMLButtonElement | null>
}

function CountrySelector({
  selected,
  onSelect,
  disabled,
  locale,
  dir,
  placeholder,
  searchPlaceholder,
  noResultsText,
  triggerRef,
}: CountrySelectorProps) {
  const [open, setOpen] = useReducer(
    (_: boolean, next: boolean) => next,
    false
  )
  const [search, setSearch] = useReducer(
    (_: string, next: string) => next,
    ""
  )

  const displayNames = useMemo(
    () => new Intl.DisplayNames(locale, { type: "region" }),
    [locale]
  )

  const options = useMemo(() => {
    const withNames = ALL_COUNTRIES.map(c => ({
      ...c,
      displayedName: displayNames.of(c.alpha2.toUpperCase()) ?? c.name,
    })).sort((a, b) => a.displayedName.localeCompare(b.displayedName, locale))

    if (!search.trim()) return withNames
    const q = search.trim().toLowerCase()
    return withNames.filter(c =>
      c.displayedName.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.alpha2.toLowerCase().includes(q) ||
      c.countryCallingCodes.some(code => code.includes(q))
    )
  }, [displayNames, locale, search])

  const handleSelect = useCallback((country: Country) => {
    onSelect(country)
    setOpen(false)
    setSearch("")
  }, [onSelect])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={selected ? selected.displayedName : placeholder}
          className={cn(
            "flex items-center gap-1.5 shrink-0 h-full px-3",
            "text-sm font-medium transition-colors duration-150",
            "hover:bg-accent/50 rounded-l-lg",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            disabled && "pointer-events-none opacity-40",
          )}
          dir={dir}
        >
          {selected ? (
            <>
              <span className="w-5 h-5 rounded-full overflow-hidden shrink-0 shadow-sm">
                <CircleFlag countryCode={selected.alpha2.toLowerCase()} height={20} />
              </span>
              <span className="text-xs font-mono text-muted-foreground tracking-wide">
                {selected.countryCallingCodes[0]}
              </span>
            </>
          ) : (
            <span className="flex items-center gap-1.5 text-muted-foreground/60">
              <Phone className="w-3.5 h-3.5" />
              <span className="text-xs">{placeholder}</span>
            </span>
          )}
          <ChevronDown
            className={cn(
              "w-3 h-3 text-muted-foreground/50 transition-transform duration-200 shrink-0",
              open && "rotate-180"
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={4}
        className="w-72 p-0 shadow-lg"
        dir={dir}
      >
        <Command shouldFilter={false} loop>
          <CommandList>
            <div className="sticky top-0 z-10 bg-popover border-b border-border/50">
              <CommandInput
                placeholder={searchPlaceholder}
                value={search}
                onValueChange={setSearch}
                className="h-9 text-sm"
              />
            </div>
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              {noResultsText}
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {options.map(country => (
                <CommandItem
                  key={country.alpha3}
                  value={country.displayedName}
                  onSelect={() => handleSelect(country)}
                  className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                    <CircleFlag countryCode={country.alpha2.toLowerCase()} height={20} />
                  </span>
                  <span className="flex-1 text-sm truncate">{country.displayedName}</span>
                  <span className="text-xs font-mono text-muted-foreground/60 shrink-0">
                    {country.countryCallingCodes[0]}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Size config
// ─────────────────────────────────────────────────────────────────────────────

const SIZE = {
  sm: { wrapper: "h-9",  input: "text-sm",  font: "text-xs" },
  md: { wrapper: "h-10", input: "text-sm",  font: "text-xs" },
  lg: { wrapper: "h-12", input: "text-base", font: "text-sm" },
} as const

// ─────────────────────────────────────────────────────────────────────────────
// PhoneInput component
// ─────────────────────────────────────────────────────────────────────────────

export function PhoneInput({
  value: controlledValue,
  defaultCountry,
  onChange,
  onCountryChange,
  disabled = false,
  required = false,
  name,
  id,
  autoComplete = "tel",
  size = "md",
  className,
  locale: localeProp,
  dir: dirProp,
  placeholder,
}: PhoneInputProps) {
  const { language, direction } = useLanguage()

  const locale = localeProp ?? (language === "ar" ? "ar-SA" : "en")
  const dir = (dirProp ?? direction ?? (isRtl(locale) ? "rtl" : "ltr")) as "ltr" | "rtl"
  const rtl = dir === "rtl"

  // ── Internal state via reducer ────────────────────────────────────────────

  const [state, dispatch] = useReducer(phoneReducer, {
    country: defaultCountry ? lookupCountry(defaultCountry) : undefined,
    digits: "",
  })

  // Merge controlled value into local state when controlled
  const isControlled = controlledValue !== undefined
  const country = isControlled ? controlledValue?.country : state.country
  const digits = isControlled ? (controlledValue?.digits ?? "") : state.digits

  // ── Sync defaultCountry on mount ──────────────────────────────────────────

  useEffect(() => {
    if (!isControlled && defaultCountry && !state.country) {
      const found = lookupCountry(defaultCountry)
      if (found) dispatch({ type: "SELECT_COUNTRY", country: found })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Derived values ────────────────────────────────────────────────────────

  const dialCode = country?.countryCallingCodes[0] ?? null
  const mask = dialCode ? (MASKS[dialCode] ?? null) : null
  const capacity = mask ? maskCapacity(mask) : 20
  const formatted = mask && digits ? applyMask(digits, mask) : digits

  // ── Refs ──────────────────────────────────────────────────────────────────

  const inputRef = useRef<HTMLInputElement>(null)
  // Tracks the country at the point of last "SELECT_COUNTRY" dispatch.
  // If this matches current country and digits is "", the input is in
  // "just selected" state — ready for first digit.
  const justSelectedRef = useRef(false)

  // ── Emit onChange upward ──────────────────────────────────────────────────

  const emit = useCallback((nextCountry: Country | undefined, nextDigits: string) => {
    onChange?.({
      country: nextCountry,
      digits: nextDigits,
      e164: buildE164(nextCountry, nextDigits),
    })
  }, [onChange])

  // ── Country selection ─────────────────────────────────────────────────────

  const handleCountrySelect = useCallback((nextCountry: Country) => {
    justSelectedRef.current = true
    if (!isControlled) dispatch({ type: "SELECT_COUNTRY", country: nextCountry })
    emit(nextCountry, "")
    onCountryChange?.(nextCountry)
    // Give the dropdown time to close before focusing
    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }, [isControlled, emit, onCountryChange])

  // ── Input: intercept first digit after country selection ──────────────────
  //
  // Strategy: use a single ref flag `justSelectedRef`. When true:
  //   • onKeyDown fires first — we see exactly which key was pressed
  //   • We handle the digit ourselves and reset the flag
  //   • We call preventDefault() so onChange never fires with stale content
  //
  // This is synchronous, single-tick, zero async drift.

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // If input is locked (no country), ignore all input
    if (!country) return

    if (!justSelectedRef.current) return

    // Pass through navigation/editing keys
    if (["Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight"].includes(e.key)) return

    if (e.key === "Backspace" || e.key === "Delete") {
      // Backspace on empty after selection → do nothing, keep empty
      justSelectedRef.current = false
      return
    }

    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault()
      justSelectedRef.current = false

      const newDigits = e.key // Just this one digit, fresh start
      if (!isControlled) dispatch({ type: "SET_DIGITS", digits: newDigits })
      emit(country, newDigits)

      // Set input DOM value directly to skip any React batching
      if (inputRef.current) {
        inputRef.current.value = applyMask(newDigits, mask ?? "") || newDigits
        // Place cursor at end
        const len = inputRef.current.value.length
        inputRef.current.setSelectionRange(len, len)
      }
    }
  }, [country, isControlled, emit, mask])

  // ── Input: normal change handler ──────────────────────────────────────────

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!country) return

    // justSelectedRef is already false here because onKeyDown handled the
    // first digit case with preventDefault. This branch handles:
    // - paste
    // - autofill
    // - subsequent digits after the first
    justSelectedRef.current = false

    const raw = normaliseDigits(e.target.value)

    // Try international-prefix detection (paste of full number like +963991...)
    const detected = detectDialCode(raw)
    if (detected) {
      const detectedCode = detected.country.countryCallingCodes[0] ?? ""
      const detectedMask = MASKS[detectedCode] ?? null
      const detectedCapacity = detectedMask ? maskCapacity(detectedMask) : 20
      const cappedNational = detected.nationalDigits.slice(0, detectedCapacity)

      if (!isControlled) {
        dispatch({ type: "DETECT_AND_SET", country: detected.country, nationalDigits: cappedNational })
      }
      emit(detected.country, cappedNational)
      onCountryChange?.(detected.country)
      return
    }

    // Normal case: strip non-digits from whatever the user typed/pasted,
    // clamp to mask capacity.
    const clean = onlyDigits(raw).slice(0, capacity)
    if (!isControlled) dispatch({ type: "SET_DIGITS", digits: clean })
    emit(country, clean)
  }, [country, capacity, isControlled, emit, onCountryChange])

  // ── Click on locked field → open country picker ───────────────────────────

  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleLockedClick = useCallback(() => {
    if (!country) triggerRef.current?.click()
  }, [country])

  // ── i18n strings ──────────────────────────────────────────────────────────

  const i18n = useMemo(() => {
    const ar = rtl
    return {
      countryPlaceholder: ar ? "الدولة" : "Country",
      searchPlaceholder: ar ? "ابحث عن دولة..." : "Search country...",
      noResults: ar ? "لم يتم العثور على دولة" : "No country found.",
      phonePlaceholder: ar ? "اختر الدولة أولاً" : "Select country first",
    }
  }, [rtl])

  // ── Placeholder text ──────────────────────────────────────────────────────

  const inputPlaceholder = useMemo(() => {
    if (!country) return i18n.phonePlaceholder
    if (mask) return mask.replace(/#/g, "_")
    return placeholder ?? (rtl ? "أدخل رقم الهاتف" : "Enter phone number")
  }, [country, mask, i18n, rtl, placeholder])

  const sz = SIZE[size]

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        // Core layout — always physical LTR so country is pinned left
        "relative flex items-stretch w-full",
        "rounded-lg border bg-background",
        "border-input shadow-sm",
        "transition-all duration-200",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background",
        "focus-within:border-ring",
        !country && "border-dashed",
        disabled && "opacity-50 pointer-events-none select-none",
        sz.wrapper,
        className,
      )}
      // Always physical LTR — country must stay on the left
      dir="ltr"
    >
      {/* ── Country selector — always left ─────────────────────────────────── */}
      <CountrySelector
        selected={country}
        onSelect={handleCountrySelect}
        disabled={disabled}
        locale={locale}
        dir={dir}
        placeholder={i18n.countryPlaceholder}
        searchPlaceholder={i18n.searchPlaceholder}
        noResultsText={i18n.noResults}
        triggerRef={triggerRef}
      />

      {/* ── Divider ──────────────────────────────────────────────────────────── */}
      <span
        aria-hidden
        className={cn(
          "w-px self-stretch bg-border/60 shrink-0 my-1.5",
          "transition-colors duration-200",
          "group-focus-within:bg-border",
        )}
      />

      {/* ── Phone number input ───────────────────────────────────────────────── */}
      <div className="relative flex flex-1 items-center min-w-0">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="tel"
          autoComplete={autoComplete}
          required={required}
          // Always show formatted national number only (no dial code in field)
          value={formatted}
          placeholder={inputPlaceholder}
          // readOnly when no country — clicking opens the picker
          readOnly={!country}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onClick={handleLockedClick}
          className={cn(
            "flex-1 min-w-0 h-full bg-transparent border-0 outline-none",
            "px-3 py-0",
            "tabular-nums tracking-wide",
            sz.input,
            "placeholder:text-muted-foreground/40 placeholder:font-normal",
            mask && "placeholder:tracking-widest placeholder:text-xs",
            !country && [
              "cursor-pointer",
              "placeholder:text-muted-foreground/50 placeholder:italic",
            ],
            // RTL: text direction for actual digit input is always LTR
            // (phone numbers are inherently left-to-right sequences)
          )}
          // Digits are always LTR even in RTL page context
          dir="ltr"
        />
      </div>
    </div>
  )
}

PhoneInput.displayName = "PhoneInput"

// ─────────────────────────────────────────────────────────────────────────────
// Named exports for external use
// ─────────────────────────────────────────────────────────────────────────────

export { ALL_COUNTRIES, MASKS, applyMask, onlyDigits, buildE164, detectDialCode }
export type { PhoneState }
