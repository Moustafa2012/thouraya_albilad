import { MapPin, ChevronDown, Moon, Sun, Sunrise, Sunset } from "lucide-react"
import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type PrayerTimings = {
  Fajr: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

type ApiResponse = {
  data: {
    timings: PrayerTimings
  }
}

export type AzanVariant = "default" | "glass" | "dark" | "minimal" | "luxury"

type City = {
  name: string
  nameAr: string
  latitude: number
  longitude: number
}

// ─── Cities ───────────────────────────────────────────────────────────────────

const CITIES: City[] = [
  { name: "Riyadh", nameAr: "الرياض", latitude: 24.7136, longitude: 46.6753 },
  { name: "Makkah", nameAr: "مكة المكرمة", latitude: 21.3891, longitude: 39.8579 },
  { name: "Madinah", nameAr: "المدينة المنورة", latitude: 24.5247, longitude: 39.5692 },
  { name: "Jeddah", nameAr: "جدة", latitude: 21.5433, longitude: 39.1728 },
  { name: "Dammam", nameAr: "الدمام", latitude: 26.4207, longitude: 50.0888 },
  { name: "Kuwait City", nameAr: "الكويت", latitude: 29.3759, longitude: 47.9774 },
  { name: "Dubai", nameAr: "دبي", latitude: 25.2048, longitude: 55.2708 },
  { name: "Cairo", nameAr: "القاهرة", latitude: 30.0444, longitude: 31.2357 },
  { name: "Istanbul", nameAr: "إسطنبول", latitude: 41.0082, longitude: 28.9784 },
  { name: "Amman", nameAr: "عمّان", latitude: 31.9539, longitude: 35.9106 },
  { name: "Beirut", nameAr: "بيروت", latitude: 33.8938, longitude: 35.5018 },
  { name: "Doha", nameAr: "الدوحة", latitude: 25.2854, longitude: 51.531 },
]

const PRAYERS = [
  { key: "Fajr" as const, label: "فجر", Icon: Sunrise },
  { key: "Dhuhr" as const, label: "ظهر", Icon: Sun },
  { key: "Asr" as const, label: "عصر", Icon: Sun },
  { key: "Maghrib" as const, label: "مغرب", Icon: Sunset },
  { key: "Isha" as const, label: "عشاء", Icon: Moon },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTodayDate(): string {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, "0")
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const year = String(now.getFullYear())
  return `${day}-${month}-${year}`
}

// ─── City Selector ────────────────────────────────────────────────────────────

function CitySelector({
  selected,
  onSelect,
  triggerClassName,
  dropdownClassName,
  itemClassName,
}: {
  selected: City
  onSelect: (city: City) => void
  triggerClassName?: string
  dropdownClassName?: string
  itemClassName?: string
}) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 transition-all",
          triggerClassName
        )}
      >
        <MapPin className="h-3.5 w-3.5 opacity-70" />
        <span>{selected.nameAr}</span>
        <ChevronDown className={cn("h-3 w-3 opacity-60 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className={cn(
            "absolute left-0 top-full z-50 mt-1.5 max-h-52 overflow-y-auto rounded-xl border shadow-xl",
            dropdownClassName
          )}
        >
          {CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => {
                onSelect(city)
                setOpen(false)
              }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-right text-sm transition-colors",
                itemClassName,
                selected.name === city.name && "font-semibold"
              )}
            >
              {city.nameAr}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Core Hook ────────────────────────────────────────────────────────────────

function usePrayerTimings(city: City) {
  const [timings, setTimings] = React.useState<PrayerTimings | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        setIsLoading(true)
        setHasError(false)

        const date = getTodayDate()
        const url = new URL(`https://api.aladhan.com/v1/timings/${date}`)
        url.searchParams.set("latitude", String(city.latitude))
        url.searchParams.set("longitude", String(city.longitude))
        url.searchParams.set("method", "3")

        const response = await fetch(url.toString(), { signal: controller.signal })
        if (!response.ok) throw new Error("Failed")

        const json = (await response.json()) as ApiResponse
        setTimings(json.data.timings)
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [city])

  return { timings, isLoading, hasError }
}

// ─── Variant: Default ─────────────────────────────────────────────────────────

function AzanDefault({ className }: { className?: string }) {
  const [city, setCity] = React.useState(CITIES[0])
  const { timings, isLoading, hasError } = usePrayerTimings(city)

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-[#eee] bg-[#f8f8f8]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-[#e5e5e5] bg-[#fdfdfd] px-4 py-3">
        <span className="text-sm font-semibold text-emerald-800">مواقيت الصلاة اليوم</span>
        <CitySelector
          selected={city}
          onSelect={setCity}
          triggerClassName="text-xs text-neutral-600 rounded-lg bg-white border border-neutral-200 px-2 py-1 hover:bg-neutral-50"
          dropdownClassName="bg-white border-neutral-200 w-40"
          itemClassName="hover:bg-neutral-50 text-neutral-700"
        />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-6">
        {isLoading ? (
          <div className="text-xs text-neutral-500">جاري تحميل مواقيت الصلاة...</div>
        ) : hasError || !timings ? (
          <div className="text-xs text-red-600">تعذر تحميل مواقيت الصلاة، حاول مرة أخرى لاحقًا.</div>
        ) : (
          <div className="grid w-full grid-cols-5 gap-3 text-center text-xs sm:text-sm">
            {PRAYERS.map(({ key, label }) => (
              <div
                key={key}
                className="flex flex-col rounded-lg bg-white/70 px-2 py-2 text-emerald-900 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
              >
                <span className="text-[11px] font-medium tracking-wide text-neutral-500">{label}</span>
                <span className="mt-1 text-sm font-semibold">{timings[key]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Variant: Glass ───────────────────────────────────────────────────────────

function AzanGlass({ className }: { className?: string }) {
  const [city, setCity] = React.useState(CITIES[0])
  const { timings, isLoading, hasError } = usePrayerTimings(city)

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl",
        className
      )}
      style={{
        background: "linear-gradient(135deg, #0f4c3a 0%, #1a6b52 40%, #0d3d2e 100%)",
      }}
    >
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-teal-300/10 blur-2xl" />

      <div className="relative flex items-center justify-between px-5 pt-4 pb-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-emerald-300/70">مواقيت الصلاة</p>
          <p className="text-base font-bold text-white">اليوم</p>
        </div>
        <CitySelector
          selected={city}
          onSelect={setCity}
          triggerClassName="text-xs text-emerald-200 rounded-full bg-white/10 backdrop-blur px-3 py-1.5 border border-white/10 hover:bg-white/15"
          dropdownClassName="bg-[#0f4c3a]/95 border-white/10 backdrop-blur w-40"
          itemClassName="hover:bg-white/10 text-emerald-100"
        />
      </div>

      <div className="relative flex flex-1 items-center px-5 pb-5">
        {isLoading ? (
          <div className="w-full text-center text-xs text-emerald-300/70">جاري التحميل...</div>
        ) : hasError || !timings ? (
          <div className="w-full text-center text-xs text-red-400">تعذر التحميل</div>
        ) : (
          <div className="grid w-full grid-cols-5 gap-2">
            {PRAYERS.map(({ key, label, Icon }) => (
              <div
                key={key}
                className="flex flex-col items-center rounded-xl py-3 text-center"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Icon className="mb-1.5 h-3.5 w-3.5 text-emerald-300/80" />
                <span className="text-[10px] font-medium text-emerald-300/80">{label}</span>
                <span className="mt-1 text-xs font-bold text-white">{timings[key]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Variant: Dark ────────────────────────────────────────────────────────────

function AzanDark({ className }: { className?: string }) {
  const [city, setCity] = React.useState(CITIES[0])
  const { timings, isLoading, hasError } = usePrayerTimings(city)

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl bg-[#0e0e0e]",
        className
      )}
      style={{ border: "1px solid #1f1f1f" }}
    >
      <div className="flex items-center justify-between border-b border-[#1f1f1f] px-4 py-3">
        <div className="flex items-center gap-2">
          <Moon className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-sm font-medium text-white/80">مواقيت الصلاة</span>
        </div>
        <CitySelector
          selected={city}
          onSelect={setCity}
          triggerClassName="text-xs text-white/50 rounded-lg bg-white/5 border border-white/10 px-2 py-1 hover:bg-white/10"
          dropdownClassName="bg-[#0e0e0e] border-white/10 w-40"
          itemClassName="hover:bg-white/5 text-white/70"
        />
      </div>

      <div className="flex flex-1 items-center px-4 py-5">
        {isLoading ? (
          <div className="w-full text-center text-xs text-white/30">جاري التحميل...</div>
        ) : hasError || !timings ? (
          <div className="w-full text-center text-xs text-red-500/70">تعذر التحميل</div>
        ) : (
          <div className="grid w-full grid-cols-5 gap-2">
            {PRAYERS.map(({ key, label, Icon }, i) => (
              <div
                key={key}
                className="group flex flex-col items-center rounded-xl border border-white/[0.04] bg-white/[0.03] py-3 text-center transition-all hover:border-amber-400/20 hover:bg-amber-400/5"
              >
                <Icon className="mb-1.5 h-3.5 w-3.5 text-white/20 transition-colors group-hover:text-amber-400/60" />
                <span className="text-[10px] font-medium tracking-wide text-white/30">{label}</span>
                <span className="mt-1 text-xs font-bold tabular-nums text-white/80">{timings[key]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Variant: Minimal ─────────────────────────────────────────────────────────

function AzanMinimal({ className }: { className?: string }) {
  const [city, setCity] = React.useState(CITIES[0])
  const { timings, isLoading, hasError } = usePrayerTimings(city)

  return (
    <div className={cn("flex h-full flex-col py-4 px-5", className)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="h-px flex-1 bg-neutral-200" />
        <CitySelector
          selected={city}
          onSelect={setCity}
          triggerClassName="mx-3 text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
          dropdownClassName="bg-white border-neutral-200 w-40 shadow-lg"
          itemClassName="hover:bg-neutral-50 text-neutral-600"
        />
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      <p className="mb-3 text-center text-[10px] uppercase tracking-[0.15em] text-neutral-400">
        مواقيت الصلاة اليوم
      </p>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-xs text-neutral-400">جاري التحميل...</div>
      ) : hasError || !timings ? (
        <div className="flex flex-1 items-center justify-center text-xs text-red-400">تعذر التحميل</div>
      ) : (
        <div className="flex flex-1 items-center">
          <div className="grid w-full grid-cols-5 divide-x divide-x-reverse divide-neutral-100">
            {PRAYERS.map(({ key, label }) => (
              <div key={key} className="flex flex-col items-center px-2 text-center">
                <span className="text-[10px] text-neutral-400">{label}</span>
                <span className="mt-1 text-sm font-semibold tabular-nums text-neutral-800">
                  {timings[key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 h-px bg-neutral-200" />
    </div>
  )
}

// ─── Variant: Luxury ─────────────────────────────────────────────────────────

function AzanLuxury({ className }: { className?: string }) {
  const [city, setCity] = React.useState(CITIES[0])
  const { timings, isLoading, hasError } = usePrayerTimings(city)

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl",
        className
      )}
      style={{
        background: "linear-gradient(160deg, #1c1408 0%, #2d1f05 50%, #1a1204 100%)",
        border: "1px solid #3d2c0a",
      }}
    >
      {/* Gold shimmer top border */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #c9973a, transparent)" }}
      />

      <div className="relative flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <p
            className="text-[9px] uppercase tracking-[0.2em]"
            style={{ color: "#c9973a" }}
          >
            أوقات الصلاة
          </p>
          <p className="mt-0.5 text-sm font-semibold" style={{ color: "#f5d9a0" }}>
            اليوم
          </p>
        </div>
        <CitySelector
          selected={city}
          onSelect={setCity}
          triggerClassName="text-xs rounded-lg px-2.5 py-1.5 border hover:opacity-90 transition-opacity"
          dropdownClassName="w-44 border rounded-xl overflow-hidden"
          itemClassName="transition-colors"
        />
      </div>

      <div className="mx-5 h-px" style={{ background: "linear-gradient(90deg, transparent, #3d2c0a, transparent)" }} />

      <div className="relative flex flex-1 items-center px-5 py-4">
        {isLoading ? (
          <div className="w-full text-center text-xs" style={{ color: "#c9973a80" }}>
            جاري التحميل...
          </div>
        ) : hasError || !timings ? (
          <div className="w-full text-center text-xs text-red-400/70">تعذر التحميل</div>
        ) : (
          <div className="grid w-full grid-cols-5 gap-2">
            {PRAYERS.map(({ key, label, Icon }) => (
              <div
                key={key}
                className="flex flex-col items-center rounded-xl py-3 text-center"
                style={{
                  background: "rgba(201,151,58,0.06)",
                  border: "1px solid rgba(201,151,58,0.12)",
                }}
              >
                <Icon className="mb-1 h-3.5 w-3.5" style={{ color: "#c9973a60" }} />
                <span className="text-[10px] font-medium" style={{ color: "#c9973a80" }}>
                  {label}
                </span>
                <span className="mt-1 text-xs font-bold tabular-nums" style={{ color: "#f5d9a0" }}>
                  {timings[key]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #c9973a40, transparent)" }}
      />
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

type AzanProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: AzanVariant
}

const Azan = React.forwardRef<HTMLDivElement, AzanProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantMap: Record<AzanVariant, React.ReactNode> = {
      default: <AzanDefault className={className} />,
      glass: <AzanGlass className={className} />,
      dark: <AzanDark className={className} />,
      minimal: <AzanMinimal className={className} />,
      luxury: <AzanLuxury className={className} />,
    }

    return (
      <div ref={ref} {...props}>
        {variantMap[variant]}
      </div>
    )
  }
)

Azan.displayName = "Azan"

export { Azan }
export type { City }
