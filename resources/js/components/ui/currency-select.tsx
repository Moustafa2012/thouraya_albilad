import { currencies as currenciesData } from "country-data-list"
import { Check, ChevronDown } from "lucide-react"
import { useCallback, useEffect, useId, useMemo, useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface CurrencyOption {
  code: string
  name: string
  symbol: string
}

type RawCurrency = {
  code?: string
  name?: string
  symbol?: string
}

const defaultCurrencies: CurrencyOption[] = (
  currenciesData.all as RawCurrency[]
)
  .filter((currency) => currency.code && currency.name)
  .map((currency) => ({
    code: currency.code as string,
    name: currency.name as string,
    symbol: currency.symbol ?? currency.code ?? "",
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

type BaseCurrencySelectProps = {
  options?: CurrencyOption[]
  disabled?: boolean
  placeholder?: string
  searchPlaceholder?: string
  noResultsText?: string
  slim?: boolean
  className?: string
}

type SingleCurrencySelectProps = BaseCurrencySelectProps & {
  multiple?: false
  onChange?: (currency: CurrencyOption | undefined) => void
  defaultValue?: string
}

type MultipleCurrencySelectProps = BaseCurrencySelectProps & {
  multiple: true
  onChange?: (currencies: CurrencyOption[]) => void
  defaultValue?: string[]
}

export type CurrencySelectProps =
  | SingleCurrencySelectProps
  | MultipleCurrencySelectProps

export function CurrencySelect({
  options,
  onChange,
  defaultValue,
  disabled = false,
  placeholder = "Select a currency",
  searchPlaceholder = "Search currency...",
  noResultsText = "No currency found.",
  slim = false,
  className,
  multiple = false,
}: CurrencySelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedCurrencies, setSelectedCurrencies] = useState<CurrencyOption[]>(
    []
  )

  const id = useId()

  const allOptions = useMemo(
    () => (options && options.length > 0 ? options : defaultCurrencies),
    [options]
  )

  useEffect(() => {
    if (!defaultValue) {
      setSelectedCurrencies([])
      return
    }

    if (multiple && Array.isArray(defaultValue)) {
      const initialCurrencies = allOptions.filter((currency) =>
        defaultValue.includes(currency.code.toUpperCase())
      )
      setSelectedCurrencies(initialCurrencies)
    } else if (!multiple && typeof defaultValue === "string") {
      const initialCurrency = allOptions.find(
        (currency) => currency.code.toUpperCase() === defaultValue.toUpperCase()
      )
      setSelectedCurrencies(initialCurrency ? [initialCurrency] : [])
    }
  }, [defaultValue, allOptions, multiple])

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return allOptions
    }

    return allOptions.filter((currency) => {
      const code = currency.code.toLowerCase()
      const name = currency.name.toLowerCase()

      return (
        code.includes(query) ||
        name.includes(query) ||
        currency.symbol.toLowerCase().includes(query)
      )
    })
  }, [allOptions, search])

  const handleSelect = useCallback(
    (currency: CurrencyOption) => {
      let newSelection: CurrencyOption[]
      if (multiple) {
        newSelection = selectedCurrencies.some(
          (c) => c.code === currency.code
        )
          ? selectedCurrencies.filter((c) => c.code !== currency.code)
          : [...selectedCurrencies, currency]
      } else {
        newSelection = [currency]
        setOpen(false)
      }
      setSelectedCurrencies(newSelection)
      if (multiple) {
        ;(onChange as MultipleCurrencySelectProps["onChange"])?.(newSelection)
      } else {
        ;(onChange as SingleCurrencySelectProps["onChange"])?.(newSelection[0])
      }
    },
    [multiple, onChange, selectedCurrencies]
  )

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      setOpen(true)
    }
  }

  const triggerClasses = cn(
    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
    slim && "gap-1 w-min px-2",
    className
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          role="combobox"
          aria-controls={id}
          aria-expanded={open}
          className={triggerClasses}
          onKeyDown={handleKeyDown}
        >
          {selectedCurrencies.length > 0 ? (
            <span className="flex w-0 flex-grow items-center gap-2 overflow-hidden">
              {multiple ? (
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {selectedCurrencies.length} selected
                </span>
              ) : (
                <>
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-semibold">
                    {selectedCurrencies[0].symbol}
                  </span>
                  {!slim && (
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {selectedCurrencies[0].code} · {selectedCurrencies[0].name}
                    </span>
                  )}
                </>
              )}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronDown className="ms-2 h-4 w-4 shrink-0 opacity-70" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false} loop>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
            className="h-9"
          />
          <CommandList id={id}>
            <CommandEmpty>{noResultsText}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((currency) => (
                <CommandItem
                  key={currency.code}
                  value={currency.name}
                  onSelect={() => handleSelect(currency)}
                  aria-selected={selectedCurrencies.some((c) => c.code === currency.code)}
                >
                  <span className="flex items-center gap-2">
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-semibold">
                      {currency.symbol}
                    </span>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {currency.code} · {currency.name}
                    </span>
                  </span>
                  <Check
                    className={cn(
                      "ms-auto h-4 w-4",
                      selectedCurrencies.some((c) => c.code === currency.code)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}