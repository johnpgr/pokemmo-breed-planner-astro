'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { usePokemonToBreed } from '@/context/hooks'
import type { IV, IVMap } from '@/context/types'
import type { NatureType, Pokemon, PokemonSelect } from '@/pokemons/data/types'
import React from 'react'
import Ivs from './ivs'
import { NatureSelect } from './nature'
import { Species } from './species'
import pokemons from '@/pokemons/data/data.json' assert { type: 'json' }

export function PokemonToBreedSelector() {
    const ctx = usePokemonToBreed()
    const { toast } = useToast()
    const [currentSelectValues, setCurrentSelectValues] = React.useState<
        Array<IV>
    >(['hp', 'attack', 'defense', 'specialDefense', 'speed'])
    const [numberOf31IVs, setNumberOf31IVs] = React.useState<2 | 3 | 4 | 5>(2)
    const [pokemon, setPokemon] = React.useState<Pokemon | null>(null)
    const [ivs, setIvs] = React.useState<Array<IV>>(['hp', 'attack'])
    const [natured, setNatured] = React.useState(false)
    const [nature, setNature] = React.useState<NatureType | null>(null)

    //TODO: Provide the path to the incorrect fields
    function validateIvFields() {
        const selectedValues = currentSelectValues.slice(0, numberOf31IVs)
        const uniques = new Set(selectedValues)
        return uniques.size === selectedValues.length
    }

    function handleReset() {
        setPokemon(null)
        setIvs(['hp', 'attack'])
        setCurrentSelectValues([
            'hp',
            'attack',
            'defense',
            'specialDefense',
            'speed',
        ])
        setNumberOf31IVs(2)
        setNatured(false)
        setNature(null)
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const validIvs = validateIvFields()

        //Nature switch true and no nature was selected
        if (natured && !nature) {
            toast({
                title: 'No nature was selected',
                description:
                    'You must select a nature when using natured breeding.',
                variant: 'destructive',
            })
            return
        }

        if (!validIvs) {
            toast({
                title: 'Invalid IVs',
                description:
                    "You can't have the same stats in multiple IVs field.",
                variant: 'destructive',
            })
            return
        }

        //This is to make sure the Ivs are passed in order of current selection
        const ivMap = {} as IVMap
        const iterationMap = {
            '0': 'a',
            '1': 'b',
            '2': 'c',
            '3': 'd',
            '4': 'e',
        } as const

        for (let i = 0; i < ivs.length; i++) {
            ivMap[iterationMap[String(i) as keyof typeof iterationMap]] =
                currentSelectValues[i]
        }

        ctx.setIvMap(ivMap)
        ctx.setNature(nature)
        ctx.setPokemon(pokemon)
    }

    return (
        <form
            className="container max-w-6xl mx-auto flex flex-col items-center gap-4"
            onSubmit={handleSubmit}
        >
            <h1 className="text-2xl font-medium">Select a pokemon to breed</h1>
            <div className="flex w-full flex-col items-center gap-4">
                <div className="flex w-full flex-col gap-2">
                    <Species
                        pokemons={props.pokemons}
                        pokemon={pokemon}
                        setPokemon={setPokemon}
                        getPokemonByName={getPokemonByName}
                    />
                    <NatureSelect
                        checked={natured}
                        onCheckedChange={setNatured}
                        nature={nature}
                        setNature={setNature}
                    />
                    <Ivs
                        natured={natured}
                        setIvs={setIvs}
                        currentSelectValues={currentSelectValues}
                        setCurrentSelectValues={setCurrentSelectValues}
                        numberOf31IVs={numberOf31IVs}
                        setNumberOf31IVs={setNumberOf31IVs}
                    />
                </div>
            </div>
            {/* <pre>{JSON.stringify({ ivs, nature, pokemon }, null, 2)}</pre> */}
            <div className="flex items-center gap-2">
                <Button type="submit">Start Breeding</Button>
                <Button
                    type="reset"
                    variant={'destructive'}
                    onClick={handleReset}
                >
                    Clear
                </Button>
            </div>
        </form>
    )
}
