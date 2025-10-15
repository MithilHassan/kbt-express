"use client"

import * as React from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandList, CommandItem, CommandInput, CommandEmpty } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { countries } from "@/lib/countries"

export default function CountrySelect({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full text-left">{value || "Select country"}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput
            placeholder="Search country..."
            value={search}
            onValueChange={(val) => setSearch(val)}
          />
          <CommandList>
            {filteredCountries.length === 0 ? (
              <CommandEmpty>No country found.</CommandEmpty>
            ) : (
              filteredCountries.map((country) => (
                <CommandItem
                  key={country.code}
                  onSelect={() => {
                    onChange(country.code)
                    setOpen(false)
                    setSearch("")
                  }}
                >
                  {country.name}
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
