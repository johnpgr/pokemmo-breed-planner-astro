import React from 'react'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getPokemonSpriteUrl } from '@/lib/utils'
import clsx from 'clsx'
import { ChevronsUpDown } from 'lucide-react'
import pokemons from '@/data/data.json'
import { usePokemonToBreed } from './PokemonToBreedContext'
import { PokemonEggGroup, PokemonSpecies, PokemonType } from '../pokemon'

export function PokemonSpeciesSelect() {
    const ctx = usePokemonToBreed()
    const [isOpen, setIsOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')

    return (
        <div className="flex items-center gap-2">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant={'ghost'}
                        className={clsx('border', {
                            'pl-2': ctx.pokemon,
                            'pl-4': !ctx.pokemon,
                        })}
                    >
                        {ctx.pokemon ? (
                            <img
                                className="top-[1px] left-0"
                                src={getPokemonSpriteUrl(ctx.pokemon.name)}
                                style={{
                                    imageRendering: 'pixelated',
                                }}
                                alt={ctx.pokemon.name}
                            />
                        ) : null}
                        {ctx.pokemon ? ctx.pokemon.name : 'Select a pokemon'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Command>
                        <CommandInput
                            placeholder="Search pokemon..."
                            value={search}
                            onValueChange={setSearch}
                            data-cy="search-pokemon-input"
                        />
                        <CommandEmpty>No results</CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className="h-72">
                                {pokemons.filter((pokemon) =>
                                    pokemon.name
                                        .toLowerCase()
                                        .includes(search.toLowerCase()),
                                ).map((pokemon) => (
                                    <React.Fragment
                                        key={`pokemon_to_breed:${pokemon.name}`}
                                    >
                                        <CommandItem
                                            value={pokemon.name}
                                            onSelect={() => {
                                                ctx.setPokemon(
                                                    new PokemonSpecies(
                                                        pokemon.number,
                                                        pokemon.name,
                                                        pokemon.types as unknown as Readonly<[PokemonType, PokemonType?]>,
                                                        pokemon.eggGroups as unknown as Readonly<[PokemonEggGroup, PokemonEggGroup?]>,
                                                        pokemon.percentageMale ?? 0,
                                                    ))
                                            }}
                                            data-cy={`${pokemon.name}-value`}
                                            className="cursor-pointer"
                                        >
                                            {pokemon.name}
                                        </CommandItem>
                                        <Separator />
                                    </React.Fragment>
                                ))}
                            </ScrollArea>
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
