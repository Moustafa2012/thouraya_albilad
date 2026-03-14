import { countries as countriesData } from "country-data-list"
import { CheckIcon, ChevronDown, ChevronsUpDown, Globe } from "lucide-react"
import { useCallback, useEffect, useMemo, useState, useRef } from "react"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface Country {
  alpha2: string
  alpha3: string
  countryCallingCodes: string[]
  currencies: string[]
  emoji?: string
  ioc?: string
  languages: string[]
  name: string
  status: string
  displayedName: string
}

type RawCountry = {
  name?: string
  alpha2?: string
  alpha3?: string
  status?: string
  currencies?: string[]
  languages?: string[]
  countryCallingCodes?: string[]
  ioc?: string
  emoji?: string
}

const defaultCountries: Country[] = (countriesData.all as RawCountry[])
  .filter((country) => {
    if (!country.name || !country.alpha2 || !country.alpha3) return false
    if (!country.status || country.status === "deleted") return false
    if (country.ioc === "PRK") return false
    return true
  })
  .map((country) => ({
    alpha2: country.alpha2 as string,
    alpha3: country.alpha3 as string,
    countryCallingCodes: country.countryCallingCodes ?? [],
    currencies: country.currencies ?? [],
    emoji: country.emoji,
    ioc: country.ioc,
    languages: country.languages ?? [],
    name: country.name as string,
    status: country.status as string,
    displayedName: country.name as string,
  }))

type BaseCountryDropdownProps = {
  options?: Country[]
  disabled?: boolean
  placeholder?: string
  searchPlaceholder?: string
  noResultsText?: string
  slim?: boolean
  inline?: boolean
  locale?: string
  dir?: "ltr" | "rtl"
  className?: string
  borderless?: boolean
}

type SingleCountryDropdownProps = BaseCountryDropdownProps & {
  multiple?: false
  onChange?: (country: Country | undefined) => void
  defaultValue?: string
}

type MultipleCountryDropdownProps = BaseCountryDropdownProps & {
  multiple: true
  onChange?: (countries: Country[]) => void
  defaultValue?: string[]
}

export type CountryDropdownProps =
  | SingleCountryDropdownProps
  | MultipleCountryDropdownProps

function isRtlLocale(locale: string) {
  const lang = locale.split("-")[0].toLowerCase()
  return ["ar", "he", "fa", "ur"].includes(lang)
}

export function CountryDropdown({
  options,
  onChange,
  defaultValue,
  disabled = false,
  placeholder = "Select a country",
  searchPlaceholder = "Search country...",
  noResultsText = "No country found.",
  slim = false,
  inline = false,
  locale,
  dir,
  className,
  multiple = false,
  borderless = false,
}: CountryDropdownProps) {
  const { language, direction } = useLanguage()

  const resolvedLocale = locale ?? (language === "ar" ? "ar" : "en")
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([])
  const isInitialMount = useRef(true)
  const prevDefaultValueRef = useRef(defaultValue)

  const effectiveDir =
    dir ?? direction ?? (isRtlLocale(resolvedLocale) ? "rtl" : "ltr")
  const isRTL = effectiveDir === "rtl"

  const displayNames = useMemo(
    () => new Intl.DisplayNames(resolvedLocale, { type: "region" }),
    [resolvedLocale]
  )

  const allOptions = useMemo(() => {
    let opts = options && options.length > 0 ? options : defaultCountries
    opts = opts.map((country) => ({
      ...country,
      displayedName:
        displayNames.of(country.alpha2.toUpperCase()) ?? country.name,
    }))
    opts.sort((a, b) =>
      a.displayedName.localeCompare(b.displayedName, resolvedLocale)
    )
    return opts
  }, [options, displayNames, resolvedLocale])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      if (!defaultValue) return
    }

    if (prevDefaultValueRef.current === defaultValue) return
    prevDefaultValueRef.current = defaultValue

    if (!defaultValue) {
      setSelectedCountries([])
      return
    }

    if (multiple && Array.isArray(defaultValue)) {
      const initialCountries = allOptions.filter((country) =>
        defaultValue.some(
          (v) =>
            country.alpha3.toUpperCase() === v.toUpperCase() ||
            country.alpha2.toUpperCase() === v.toUpperCase()
        )
      )
      setSelectedCountries(initialCountries)
    } else if (!multiple && typeof defaultValue === "string") {
      const initialCountry = allOptions.find(
        (country) =>
          country.alpha3.toUpperCase() === defaultValue.toUpperCase() ||
          country.alpha2.toUpperCase() === defaultValue.toUpperCase()
      )
      setSelectedCountries(initialCountry ? [initialCountry] : [])
    }
  }, [defaultValue, allOptions, multiple])

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return allOptions
    return allOptions.filter((country) => {
      const name = country.name.toLowerCase()
      const displayedName = country.displayedName.toLowerCase()
      const alpha2 = country.alpha2.toLowerCase()
      const alpha3 = country.alpha3.toLowerCase()
      return (
        name.includes(query) ||
        displayedName.includes(query) ||
        alpha2.includes(query) ||
        alpha3.includes(query)
      )
    })
  }, [allOptions, search])

  const handleSelect = useCallback(
    (country: Country) => {
      let newSelection: Country[]
      if (multiple) {
        newSelection = selectedCountries.some((c) => c.alpha3 === country.alpha3)
          ? selectedCountries.filter((c) => c.alpha3 !== country.alpha3)
          : [...selectedCountries, country]
        setSelectedCountries(newSelection)
        ;(onChange as MultipleCountryDropdownProps["onChange"])?.(newSelection)
      } else {
        newSelection = [country]
        setSelectedCountries(newSelection)
        ;(onChange as SingleCountryDropdownProps["onChange"])?.(country)
        setOpen(false)
      }
    },
    [multiple, onChange, selectedCountries]
  )

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      setOpen(true)
    }
  }

  const hasSelection = selectedCountries.length > 0
  const selectedCountry = selectedCountries[0]

  // ── Trigger class composition ──────────────────────────────────────────────
  //
  // borderless + slim: used inside PhoneInput — compact, no border, just the
  //   flag (or globe), a minimal gap, and the chevron.
  //   Layout: [flag/globe] [chevron] — always in that logical order.
  //   In RTL the flex container's dir="rtl" will visually reverse this so
  //   chevron appears on the left and flag on the right, which is correct.
  //
  // inline: combined mode (e.g. adjacent to another input)
  //
  // default (full): standard select-like trigger with full country name.

  const triggerClasses = cn(
    // Shared base
    "flex items-center gap-1.5 cursor-pointer",
    "transition-colors duration-150",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "focus:outline-none",

    borderless
      ? cn(
          // Borderless (PhoneInput slim mode): no border, no background
          "h-full w-full justify-between text-muted-foreground hover:text-foreground",
          slim && "gap-1"
        )
      : cn(
          // Full trigger with border
          "h-9 w-full justify-between whitespace-nowrap",
          "rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
          "ring-offset-background placeholder:text-muted-foreground",
          "hover:bg-secondary/80",
          "[&>span]:line-clamp-1",
          inline && "rounded-r-none border-r-0 gap-1 pr-1 w-min"
        ),
    className
  )

  // ── Chevron icon ───────────────────────────────────────────────────────────
  // ms-auto pushes the chevron to the logical end (right in LTR, left in RTL).
  // For inline mode we use ChevronsUpDown; otherwise ChevronDown.
  const ChevronIcon = inline ? ChevronsUpDown : ChevronDown
  const chevronClasses = cn(
    "h-4 w-4 shrink-0 opacity-60",
    // In borderless/slim mode don't use ms-auto — the parent already uses
    // justify-between to push the icon to the end.
    !borderless && "ms-auto"
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={triggerClasses}
          onKeyDown={handleKeyDown}
          dir={effectiveDir}
        >
          {/* ── Selected / placeholder content ── */}
          {hasSelection ? (
            <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
              {multiple ? (
                <span className="truncate text-sm">
                  {selectedCountries.length} selected
                </span>
              ) : (
                <>
                  {/* Flag — always show in slim/inline */}
                  <span className="inline-flex items-center justify-center w-4 h-4 shrink-0 overflow-hidden rounded-full">
                    <CircleFlag
                      countryCode={selectedCountry.alpha2.toLowerCase()}
                      height={16}
                    />
                  </span>
                  {/* Country name — only in full (non-slim, non-inline) mode */}
                  {!slim && !inline && (
                    <span className="truncate text-sm text-foreground">
                      {selectedCountry.displayedName}
                    </span>
                  )}
                </>
              )}
            </div>
          ) : (
            /* Placeholder */
            <span className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
              {inline || slim ? (
                <Globe className="h-4 w-4 shrink-0" />
              ) : (
                <span className="truncate text-sm text-muted-foreground">
                  {placeholder}
                </span>
              )}
            </span>
          )}

          {/* Chevron — always at the logical end */}
          <ChevronIcon className={chevronClasses} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        collisionPadding={10}
        side="bottom"
        className="min-w-[var(--radix-popover-trigger-width)] p-0"
        dir={effectiveDir}
      >
        <Command shouldFilter={false} loop>
          <CommandList>
            <div className="sticky top-0 z-10 bg-popover">
              <CommandInput
                placeholder={searchPlaceholder}
                value={search}
                onValueChange={setSearch}
                className="h-9"
              />
            </div>
            <CommandEmpty>{noResultsText}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((country) => {
                const isSelected = selectedCountries.some(
                  (c) => c.alpha3 === country.alpha3
                )
                return (
                  <CommandItem
                    key={country.alpha3}
                    value={country.displayedName}
                    onSelect={() => handleSelect(country)}
                    className="flex items-center w-full gap-2"
                  >
                    <div className="flex flex-grow items-center gap-2 overflow-hidden">
                      <span className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                        <CircleFlag
                          countryCode={country.alpha2.toLowerCase()}
                          height={20}
                        />
                      </span>
                      <span className="truncate">
                        {country.displayedName}
                      </span>
                    </div>
                    <CheckIcon
                      className={cn(
                        "ms-auto h-4 w-4 shrink-0 transition-opacity",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}