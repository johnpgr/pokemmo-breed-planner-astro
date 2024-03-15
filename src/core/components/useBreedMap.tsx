import React from 'react'
import type { PokemonBreedTreeNode } from '../tree/BreedTreeNode'
import type { PokemonBreederKind, PokemonIv } from '../pokemon'
import { BreedTreeStore } from '../tree/BreedTreeStore'
import type { PokemonBreedTreePosition } from '../tree/BreedTreePosition'
import { Breeder } from '../breed'

export function useBreedMap(props: {
    generations: number
    pokemonToBreed: PokemonBreedTreeNode
    finalPokemonIvMap: Map<PokemonBreederKind, PokemonIv>
}) {
    const breedTreeStore = React.useMemo(
        () => new BreedTreeStore(props.pokemonToBreed, props.finalPokemonIvMap, props.generations),
        [props.generations, props.pokemonToBreed, props.finalPokemonIvMap],
    )
    const map = React.useSyncExternalStore(breedTreeStore.subscribe, breedTreeStore.getSnapshot)
    const [lastPositionChange, setLastPositionChange] = React.useState<PokemonBreedTreePosition[]>()
    const breeder = React.useMemo(() => new Breeder(map.nodes), [map])

    React.useEffect(() => {
        //TODO: Implement breeding logic when nodes change
    }, [lastPositionChange, breeder, map])

    return map
}
