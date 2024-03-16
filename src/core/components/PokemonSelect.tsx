import { Button } from '@/components/ui/button'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Loader } from 'lucide-react'
import React from 'react'
import { CurrentNodeInfoCard } from './CurrentNodeInfoCard'
import { PokemonEggGroup, PokemonGender, PokemonSpecies } from '../pokemon'
import pokemons from '@/data/data.json'
import { type Color, getColorsByIvs, COLOR_MAP } from './IvColors'
import type { PokemonBreedTree } from '../tree/BreedTree'
import type { PokemonBreedTreePosition } from '../tree/BreedTreePosition'
import { usePokemonToBreed } from './PokemonToBreedContext'
import { assert } from '@/lib/assert'
import { GENDERLESS_POKEMON_EVOLUTION_TREE } from '../consts'
import { getPokemonSpriteUrl, randomString } from '@/lib/utils'

const NODE_SCALE_BY_COLOR_AMOUNT = {
    '5': 1,
    '4': 0.9,
    '3': 0.8,
    '2': 0.75,
    '1': 0.66,
} as const

const SPRITE_SCALE_BY_COLOR_AMOUNT = {
    '5': 1,
    '4': 1.1,
    '3': 1.2,
    '2': 1.3,
    '1': 1.5,
} as const

function filterPokemonByEggGroups(currentPokemon: PokemonSpecies): typeof pokemons {
    const newList: typeof pokemons = []

    const ditto = pokemons.find((poke) => poke.number === 132)
    assert.exists(ditto, 'Ditto should exist')

    newList.push(ditto)

    if (currentPokemon.eggGroups.includes(PokemonEggGroup.Genderless)) {
        const breedable =
            GENDERLESS_POKEMON_EVOLUTION_TREE[currentPokemon.number as keyof typeof GENDERLESS_POKEMON_EVOLUTION_TREE]

        return newList.concat(pokemons.filter((poke) => breedable.includes(poke.number)))
    }

    for (const poke of pokemons) {
        const compatible = poke.eggGroups.some((e) => currentPokemon.eggGroups.includes(e))
        if (!compatible) continue

        newList.push(poke)
    }

    return newList
}

enum SearchMode {
    All,
    EggGroupMatches,
}

export function PokemonSelect(props: {
    selectedPokemon: PokemonSpecies | undefined
    position: PokemonBreedTreePosition
    breedTree: PokemonBreedTree
}) {
    const id = React.useId()
    const ctx = usePokemonToBreed()
    const [pending, startTransition] = React.useTransition()
    const [searchMode, setSearchMode] = React.useState(SearchMode.All)
    const [search, setSearch] = React.useState('')
    const [colors, setColors] = React.useState<Color[]>()
    const isPokemonToBreed = props.position.col === 0 && props.position.row === 0
    const currentNode = props.breedTree.getNode(props.position)

    async function setPokemonSpecies(name: string) {
        const pokemon = pokemons.find((p) => p.name === name)
        assert.exists(pokemon, `Pokemon ${name} should exist`)

        assert.exists(currentNode, `Node at ${props.position} should exist`)

        const newNode = currentNode.copy()
        newNode.species = PokemonSpecies.parse(pokemon)

        props.breedTree.setNode(props.position, newNode)
    }

    function setGender(gender: PokemonGender) {
        assert.exists(currentNode, `Node at ${props.position} should exist`)

        const newNode = currentNode.copy()
        newNode.gender = gender

        props.breedTree.setNode(props.position, newNode)
    }

    function handleSearchModeChange() {
        startTransition(() => {
            setSearchMode((prev) => (prev === SearchMode.All ? SearchMode.EggGroupMatches : SearchMode.All))
        })
    }

    const pokemonList = React.useMemo(() => {
        assert.exists(ctx.pokemon, 'Pokemon in context should exist')
        return searchMode === SearchMode.All ? pokemons : filterPokemonByEggGroups(ctx.pokemon)
    }, [searchMode])

    React.useEffect(() => {
        if (!currentNode) return

        if (colors && colors.length > 0) return

        const newColors: Color[] = []

        if (currentNode.nature) {
            newColors.push(COLOR_MAP['Nature'])
        }

        if (currentNode.ivs) {
            newColors.push(...getColorsByIvs(currentNode.ivs))
        }

        setColors(newColors)
    }, [])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size={'icon'}
                    className="relative rounded-full bg-neutral-300 dark:bg-neutral-800 overflow-hidden"
                    style={{
                        scale: NODE_SCALE_BY_COLOR_AMOUNT[
                            String(colors?.length ?? 0) as keyof typeof NODE_SCALE_BY_COLOR_AMOUNT
                        ],
                    }}
                >
                    {colors?.map((color) => (
                        <div
                            key={randomString(3)}
                            style={{
                                height: '100%',
                                backgroundColor: color,
                                width: 100 / colors.length,
                            }}
                        />
                    ))}
                    {props.selectedPokemon ? (
                        <img
                            src={getPokemonSpriteUrl(props.selectedPokemon.name)}
                            style={{
                                imageRendering: 'pixelated',
                                scale: SPRITE_SCALE_BY_COLOR_AMOUNT[
                                    String(colors?.length ?? 0) as keyof typeof SPRITE_SCALE_BY_COLOR_AMOUNT
                                ],
                            }}
                            className="mb-1 absolute"
                        />
                    ) : null}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 flex gap-4 max-w-lg w-full border-none bg-none shadow-none">
                {currentNode ? (
                    <CurrentNodeInfoCard
                        currentNode={currentNode}
                        gender={currentNode.gender}
                        setGender={setGender}
                        breedMap={props.breedTree}
                        position={props.position}
                    >
                        <Button size={'sm'} onClick={() => console.log(currentNode)}>
                            Debug
                        </Button>
                    </CurrentNodeInfoCard>
                ) : null}
                {!isPokemonToBreed ? (
                    <Command className="w-72 border">
                        <CommandInput
                            placeholder="Search pokemon..."
                            value={search}
                            onValueChange={setSearch}
                            data-cy="search-pokemon-input"
                        />
                        <div className="flex items-center gap-2 text-xs text-foreground/80 p-1">
                            <Switch checked={searchMode === SearchMode.All} onCheckedChange={handleSearchModeChange} />
                            Show only {ctx.pokemon?.name}&apos;s egg groups
                        </div>
                        <CommandEmpty>{!pending ? 'No results' : ''}</CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className="h-72">
                                {pending ? (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <Loader className="animate-spin text-primary" />
                                    </div>
                                ) : (
                                    pokemonList
                                        .filter((pokemon) => pokemon.name.toLowerCase().includes(search.toLowerCase()))
                                        .map((pokemon) => (
                                            <React.Fragment key={`${id}:${pokemon.name}`}>
                                                <CommandItem
                                                    value={pokemon.name}
                                                    onSelect={setPokemonSpecies}
                                                    data-cy={`${pokemon.name}-value`}
                                                >
                                                    {pokemon.name}
                                                </CommandItem>
                                                <Separator />
                                            </React.Fragment>
                                        ))
                                )}
                            </ScrollArea>
                        </CommandGroup>
                    </Command>
                ) : null}
            </PopoverContent>
        </Popover>
    )
}
