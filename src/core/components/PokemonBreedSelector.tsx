import React from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import Ivs from './ivs'
import { PokemonNatureSelect } from './PokemonNatureSelect'
import { PokemonSpeciesSelect } from './PokemonSpeciesSelect'
import { IVSet, usePokemonToBreed } from './PokemonToBreedContext'
import { PokemonIv } from '../pokemon'
import { assert } from '@/lib/assert'

const DEFAULT_IV_DROPDOWN_VALUES = [
    PokemonIv.HP,
    PokemonIv.Attack,
    PokemonIv.Defense,
    PokemonIv.SpecialDefense,
    PokemonIv.Speed,
] as const

export function PokemonToBreedSelector() {
    const ctx = usePokemonToBreed()
    const { toast } = useToast()
    const [natured, setNatured] = React.useState(false)
    const [desired31IVCount, setDesired31IVCount] = React.useState(2)
    const [selectedIVs, setSelectedIVs] = React.useState(DEFAULT_IV_DROPDOWN_VALUES.slice(0, desired31IVCount))
    const [currentIVDropdownValues, setCurrentIVDropdownValues] = React.useState(DEFAULT_IV_DROPDOWN_VALUES)

    //TODO: Provide the path to the incorrect fields
    function validateIvFields() {
        const selectedValues = currentIVDropdownValues.slice(0, desired31IVCount)
        const uniques = new Set(selectedValues)
        return uniques.size === selectedValues.length
    }

    function handleReset() {
        ctx.setPokemon(undefined)
        ctx.setNature(undefined)
        ctx.setIvs(IVSet.DEFAULT)
        setSelectedIVs(DEFAULT_IV_DROPDOWN_VALUES.slice(0, desired31IVCount))
        setCurrentIVDropdownValues(DEFAULT_IV_DROPDOWN_VALUES)
        setDesired31IVCount(2)
        setNatured(false)
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const validIvs = validateIvFields()

        //Nature switch true and no nature was selected
        if (natured && !ctx.nature) {
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

        assert.exists(selectedIVs[0], 'At least 2 IV fields must be selected')
        assert.exists(selectedIVs[1], 'At least 2 IV fields must be selected')

        ctx.setIvs(new IVSet(
            selectedIVs[0],
            selectedIVs[1],
            selectedIVs[2],
            selectedIVs[3],
            selectedIVs[4]
        ))
        ctx.setNature(undefined)
        ctx.setPokemon(undefined)
    }

    return (
        <form
            className="container max-w-6xl mx-auto flex flex-col items-center gap-4"
            onSubmit={handleSubmit}
        >
            <h1 className="text-2xl font-medium">Select a pokemon to breed</h1>
            <div className="flex w-full flex-col items-center gap-4">
                <div className="flex w-full flex-col gap-2">
                    <PokemonSpeciesSelect />
                    <PokemonNatureSelect checked={natured} onCheckedChange={setNatured} />
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
