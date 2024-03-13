import { Button } from '@/components/ui/button'
import {
    Command,
    CommandInput,
    CommandGroup,
    CommandEmpty,
    CommandItem,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { randomString } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import React from 'react'
import { usePokemonToBreed } from './PokemonToBreedContext'
import { PokemonNature } from '../pokemon'

export function PokemonNatureSelect(props: { checked: boolean, onCheckedChange: (checked: boolean) => void }) {
    const ctx = usePokemonToBreed()
    const [search, setSearch] = React.useState('')
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div className="flex gap-4">
            <div className="flex items-center gap-2">
                <Switch
                    id="natured-switch"
                    checked={props.checked}
                    onCheckedChange={props.onCheckedChange}
                />
                Natured?
            </div>
            {props.checked && (
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button variant={'ghost'} className="border">
                            {ctx.nature ?? 'Select a nature'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                        <Command>
                            <CommandInput
                                placeholder="Search nature..."
                                value={search}
                                onValueChange={setSearch}
                                data-cy="search-nature-input"
                            />
                            <CommandEmpty>No results.</CommandEmpty>
                            <CommandGroup>
                                <ScrollArea className="h-72">
                                    {Object.values(PokemonNature).map((nature) => (
                                        <React.Fragment key={randomString(6)}>
                                            <CommandItem
                                                value={nature}
                                                onSelect={() => {
                                                    setIsOpen(false)
                                                    ctx.setNature(nature)
                                                }}
                                                data-cy={`${nature}-value`}
                                                className="pl-8 relative"
                                            >
                                                {ctx.nature === nature ? (
                                                    <Check className="h-4 w-4 absolute top-1/2 -translate-y-1/2 left-2" />
                                                ) : null}
                                                {nature}
                                            </CommandItem>
                                        </React.Fragment>
                                    ))}
                                </ScrollArea>
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    )
}
