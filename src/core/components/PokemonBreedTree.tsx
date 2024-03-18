import React from 'react'
import { Button } from '@/components/ui/button'
import { usePokemonToBreed } from './PokemonToBreedContext'
import { PokemonBreedTreeNode } from '../tree/BreedTreeNode'
import { assert } from '@/lib/assert'
import { BreedTreeStore } from '../tree/BreedTreeStore'
import { PokemonBreedTreePosition } from '../tree/BreedTreePosition'
import { Breeder } from '../breed'
import { PokemonSelect } from './PokemonSelect'
import { IvColors } from './IvColors'
import { pokemonBreedTreeStore } from '../store'

export function PokemonBreedTree() {
    const ctx = usePokemonToBreed()
    if (!ctx.pokemon) {
        return null
    }

    return <_PokemonBreedTree />
}

function _PokemonBreedTree() {
    const ctx = usePokemonToBreed()
    const generations = Object.values(ctx.ivs).filter(Boolean).length
    assert.exists(ctx.pokemon, 'Pokemon must be defined in useBreedMap')
    pokemonBreedTreeStore.init(
        PokemonBreedTreeNode.ROOT(ctx),
        ctx.ivs,
        generations,
    )
    const map = React.useSyncExternalStore(
        pokemonBreedTreeStore.subscribe,
        pokemonBreedTreeStore.getSnapshot,
    )
    const [lastPositionChange, setLastPositionChange] =
        React.useState<PokemonBreedTreePosition[]>()
    const breeder = React.useMemo(() => new Breeder(map.nodes), [map])

    React.useEffect(() => {
        //TODO: Implement breeding logic when nodes change
    }, [lastPositionChange, breeder, map])

    return (
        <div className="flex flex-col-reverse items-center gap-8">
            {Array.from({ length: generations }).map((_, row) => (
                <div className="flex" key={`row:${row}`}>
                    {Array.from({ length: Math.pow(2, row) }).map((_, col) => {
                        const position = new PokemonBreedTreePosition(row, col)
                        const selectedPokemon = map.getNode(position)
                        assert.exists(
                            selectedPokemon,
                            'All Nodes must exist in map',
                        )

                        return (
                            <div key={`row:${row}col:${col}`}>
                                <PokemonSelect
                                    position={position}
                                    selectedPokemon={selectedPokemon.species}
                                    breedTree={map}
                                />
                            </div>
                        )
                    })}
                </div>
            ))}
            <Button onClick={() => console.log(map)}>
                Debug
            </Button>
            <IvColors />
        </div>
    )
}
