'use client'
import { getPokemonByName } from '@/actions/pokemon-by-name'
import { Button } from '@/components/ui/button'
import { usePokemonToBreed } from '@/context/hooks'
import { Pokemon, PokemonSelectList } from '@/data/types'
import React from 'react'
import { columnsPerRow } from '../consts'
import { Position } from '../types'
import { useBreedMap } from '../use-breed-map'
import { IvColors } from './iv-colors'
import { PokemonSelect } from './pokemon-select'

export function PokemonTree() {
    const [selectedPokemons, setSelectedPokemons] = React.useState<
        Array<Pokemon & { position: Position }>
    >([])
    const { pokemon, nature, ivMap } = usePokemonToBreed()
    const ivArray = Object.values(ivMap).filter(Boolean)
    const generations = (nature ? ivArray.length ! + 1 : ivArray.length)

    const breedMap = useBreedMap({
        ivMap,
        nature,
        pokemonToBreed: {
            pokemon: pokemon!,
            nature,
            ivs: ivArray,
            //this is fine because this will always be the correct parents
            parents: ['1,0', '1,1'],
            gender: null,
        },
        numberOf31IvPokemon: ivArray.length,
        setSelectedPokemons,
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
