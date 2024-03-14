import React from 'react'
import { Button } from '@/components/ui/button'
import { useBreedMap } from './use-breed-map'
import { usePokemonToBreed } from './PokemonToBreedContext'
import type { PokemonIv } from '../pokemon'
import type { PokemonBreedTreeNode } from '../tree/BreedTreeNode'

export function PokemonBreedTree() {
    const ctx = usePokemonToBreed()
    const [selectedPokemons, setSelectedPokemons] = React.useState<PokemonBreedTreeNode[]>([])
    const ivArray: PokemonIv[] = Object.values(ctx.ivs).filter(Boolean)
    const generations = ctx.nature ? ivArray.length + 1 : ivArray.length

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
