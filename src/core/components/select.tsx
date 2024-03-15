import { Button } from '@/components/ui/button'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Loader } from 'lucide-react'
import React from 'react'
import { CurrentNodeInformationCard } from './current-node-information-card'
import { PokemonGender, type PokemonIv, type PokemonSpecies } from '../pokemon'
import pokemons from '@/data/data.json' assert { type: 'json' }
import { type Color, getColorsByIvs } from './IvColors'
import type { useBreedMap } from './useBreedMap'
import type { PokemonBreedTree } from '../tree/BreedTree'
import type { PokemonBreedTreePosition } from '../tree/BreedTreePosition'
import { usePokemonToBreed } from './PokemonToBreedContext'
import type { PokemonBreedTreeNode } from '../tree/BreedTreeNode'

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

function filterPokemonByEggGroups(list: PokemonSelectList, currentPokemon: Pokemon): PokemonSelectList {
    const newList: PokemonSelectList = []

    const ditto = list.find((poke) => poke.name === 'Ditto') ?? raise('Ditto should be defined')

    newList.push(ditto)

    if (currentPokemon.eggTypes.includes('Genderless')) {
        const breedable = GenderlessPokemonEvolutionTree[
            currentPokemon.name as keyof typeof GenderlessPokemonEvolutionTree
        ] as Array<string>

        return newList.concat(list.filter((poke) => breedable.includes(poke.name)))
    }

    list.forEach((pokemon) => {
        const compatible = pokemon.eggTypes.some((e) => currentPokemon.eggTypes.includes(e))
        if (!compatible) return

        newList.push(pokemon)
    })
    return newList
}

enum SearchMode {
    All,
    EggGroupMatches
}

export function PokemonSelect(props: {
    selectedPokemon?: PokemonSpecies
    position: PokemonBreedTreePosition
    breedTree: PokemonBreedTree
}) {
    const id = React.useId()
    const ctx = usePokemonToBreed()
    const isPokemonToBreed = props.position.col === 0 && props.position.row === 0
    const [searchMode, setSearchMode] = React.useState(SearchMode.All)
    const [search, setSearch] = React.useState('')
    const [gender, setGender] = React.useState(PokemonGender.Male)
    const [currentNode, setCurrentNode] = React.useState<PokemonBreedTreeNode>()
    const [colors, setColors] = React.useState<Color[]>()
    const [pending, startTransition] = React.useTransition()

    async function handleSelectPokemon(name: string) {
        const pokemon = pokemons.find((p)=> p.name === name)
        if (!pokemon) return

        const node = breedMap.get(position)
        if (!node) return

        const newNode = {
            gender: gender,
            ivs: node.ivs,
            nature: node.nature,
            parents: node.parents,
            pokemon,
        } satisfies BreedNode

        breedMap.set(position, newNode)
        setCurrentNode(newNode)
    }

    function handleChangeGender(gender: GenderType) {
        setGender(gender)

        if (!selectedPokemon) return

        const node = breedMap.get(position)
        if (!node) return

        breedMap.set(position, {
            ...node,
            gender,
        })
    }

    function handleSearchModeChange() {
        startTransition(() => {
            setSearchMode((prev) => (prev === 'ALL' ? 'EGG_GROUP' : 'ALL'))
        })
    }

    const pokemonList = React.useMemo(
        () => (searchMode === 'ALL' ? pokemons : filterPokemonByEggGroups(pokemons, pokemonToBreed!)),
        [searchMode],
    )

    React.useEffect(() => {
        if (!currentNode) {
            const currentNode = breedMap.get(position)
            setCurrentNode(currentNode ?? null)
        }
    }, [])

    React.useEffect(() => {
        if (!currentNode) return
        if (colors.length > 0) return

        const newColors: Array<Color> = []

        if (currentNode.nature) {
            newColors.push(ColorMap['nature'])
        }

        if (currentNode.ivs) {
            newColors.push(...getColorsByIvs(currentNode.ivs))
        }

        setColors(newColors)
    }, [currentNode])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size={'icon'}
                    className="relative rounded-full bg-neutral-300 dark:bg-neutral-800 overflow-hidden"
                    style={{
                        scale: NodeScaleByColorAmount[String(colors.length) as keyof typeof NodeScaleByColorAmount],
                    }}
                >
                    {colors.map((color) => (
                        <div
                            key={randomString(3)}
                            style={{
                                height: '100%',
                                backgroundColor: color,
                                width: 100 / colors.length,
                            }}
                        />
                    ))}
                    {selectedPokemon || isPokemonToBreed ? (
                        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                        <img
                            src={getPokemonSpriteUrl(isPokemonToBreed ? pokemonToBreed!.name : selectedPokemon!.name)}
                            style={{
                                imageRendering: 'pixelated',
                                scale: SpriteScaleByColorAmount[
                                    String(colors.length) as keyof typeof SpriteScaleByColorAmount
                                ],
                            }}
                            className="mb-1 absolute"
                        />
                    ) : null}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 flex gap-4 max-w-lg w-full border-none bg-none shadow-none">
                {currentNode ? (
                    <CurrentNodeInformationCard
                        currentNode={currentNode}
                        gender={gender}
                        setGender={handleChangeGender}
                        breedMap={breedMap}
                        position={position}
                    >
                        <Button size={'sm'} onClick={() => console.log(breedMap.get(position))}>
                            Debug
                        </Button>
                    </CurrentNodeInformationCard>
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
                            <Switch checked={searchMode === 'EGG_GROUP'} onCheckedChange={handleSearchModeChange} />
                            Show only {pokemonToBreed?.name}&apos;s egg groups
                        </div>
                        <CommandEmpty>{!pending ? 'No results' : ''}</CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className="h-72">
                                {pending ? (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <Loader className="animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <For
                                        each={pokemonList.filter((pokemon) =>
                                            pokemon.name.toLowerCase().includes(search.toLowerCase()),
                                        )}
                                    >
                                        {(pokemon) => (
                                            <React.Fragment key={`${id}:${pokemon.name}`}>
                                                <CommandItem
                                                    value={pokemon.name}
                                                    onSelect={handleSelectPokemon}
                                                    data-cy={`${pokemon.name}-value`}
                                                >
                                                    {parseNames(pokemon.name)}
                                                </CommandItem>
                                                <Separator />
                                            </React.Fragment>
                                        )}
                                    </For>
                                )}
                            </ScrollArea>
                        </CommandGroup>
                    </Command>
                ) : null}
            </PopoverContent>
        </Popover>
    )
}
