import React from 'react'
import { Button } from '@/components/ui/button'
import { useBreedMap } from './useBreedMap'
import { usePokemonToBreed } from './PokemonToBreedContext'
import type { PokemonIv } from '../pokemon'
import type { PokemonBreedTreeNode } from '../tree/BreedTreeNode'
import { POKEMON_BREEDTREE_LASTROW_MAPPING } from '../consts'

export function PokemonBreedTree() {
    const ctx = usePokemonToBreed()
    const ivArray: PokemonIv[] = Object.values(ctx.ivs).filter(Boolean)
    const generations = ctx.nature ? ivArray.length + 1 : ivArray.length

    const breedMap = useBreedMap({
        generations,
    })

    return (
        <div className="flex flex-col-reverse items-center gap-8">
            {Array.from({ length: generations }).map((_, row) => (
                <div className="flex" key={`row:${row}`}>
                    {Array.from({ length: columnsPerRow[row] }).map(
                        (_, column) => {
                            const position = `${row},${column}` as Position
                            const selectedPokemon = selectedPokemons.find(
                                (p) => p.position === position,
                            )
                            return (
                                <div key={`row:${row}col:${column}`}>
                                    {props.pokemons && (
                                        <PokemonSelect
                                            getPokemonByName={getPokemonByName}
                                            pokemons={props.pokemons}
                                            position={position}
                                            breedMap={breedMap}
                                            selectedPokemon={selectedPokemon}
                                        />
                                    )}
                                </div>
                            )
                        },
                    )}
                </div>
            ))}
            <Button onClick={() => console.log(breedMap.toJSON())}>
                Debug
            </Button>
            <IvColors ivs={ivMap} nature={nature} />
        </div>
    )
}
