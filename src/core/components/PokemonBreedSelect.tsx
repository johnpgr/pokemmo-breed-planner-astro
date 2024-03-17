import React from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { PokemonIvsSelect } from './PokemonIvsSelect'
import { PokemonNatureSelect } from './PokemonNatureSelect'
import { PokemonSpeciesSelect } from './PokemonSpeciesSelect'
import { IVSet, usePokemonToBreed } from './PokemonToBreedContext'
import { PokemonIv, PokemonNature, PokemonSpecies } from '../pokemon'
import { assert } from '@/lib/assert'
import { DEFAULT_IV_DROPDOWN_VALUES } from './consts'

/**
 * This type is used to represent the state of the full pokemon node that is going to be used in the PokemonToBreedContext
 * It is a state object that will change as the user changes the select fields
 */
export type PokemonNodeInSelect = {
    species?: PokemonSpecies
    nature?: PokemonNature
    ivs: PokemonIv[]
}

export function PokemonToBreedSelect() {
    const { toast } = useToast()
    const ctx = usePokemonToBreed()
    const [natured, setNatured] = React.useState(false)
    const [desired31IVCount, setDesired31IVCount] = React.useState(2)
    const [currentIVDropdownValues, setCurrentIVDropdownValues] = React.useState(DEFAULT_IV_DROPDOWN_VALUES)
    const [currentPokemonInSelect, setCurrentPokemonInSelect] = React.useState<PokemonNodeInSelect>({
        ivs: DEFAULT_IV_DROPDOWN_VALUES.slice(0, desired31IVCount),
    })

    //TODO: Provide the path to the incorrect fields
    function validateIvFields() {
        const selectedValues = currentIVDropdownValues.slice(0, desired31IVCount)
        const uniques = new Set(selectedValues)
        return uniques.size === selectedValues.length
    }

    function handleResetFields() {
        setNatured(false)
        setDesired31IVCount(2)
        setCurrentIVDropdownValues(DEFAULT_IV_DROPDOWN_VALUES)
        setCurrentPokemonInSelect({
            ivs: DEFAULT_IV_DROPDOWN_VALUES.slice(0, 2),
        })
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!currentPokemonInSelect.species) {
            toast({
                title: 'No pokemon was selected',
                description: 'You must select a pokemon to breed.',
                variant: 'destructive',
            })
            return
        }

        //Nature switch true and no nature was selected
        if (natured && !ctx.nature) {
            toast({
                title: 'No nature was selected',
                description: 'You must select a nature when using natured breeding.',
                variant: 'destructive',
            })
            return
        }

        if (!validateIvFields()) {
            toast({
                title: 'Invalid IVs',
                description: "You can't have the same stats in multiple IVs field.",
                variant: 'destructive',
            })
            return
        }

        assert.exists(currentPokemonInSelect.ivs[0], 'At least 2 IV fields must be selected')
        assert.exists(currentPokemonInSelect.ivs[1], 'At least 2 IV fields must be selected')

        ctx.setIvs(
            new IVSet(
                currentPokemonInSelect.ivs[0],
                currentPokemonInSelect.ivs[1],
                currentPokemonInSelect.ivs[2],
                currentPokemonInSelect.ivs[3],
                currentPokemonInSelect.ivs[4],
            ),
        )
        ctx.setNature(currentPokemonInSelect.nature)
        ctx.setPokemon(currentPokemonInSelect.species)
    }

    return (
        <form className="container max-w-6xl mx-auto flex flex-col items-center gap-4" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-medium">Select a pokemon to breed</h1>
            <div className="flex w-full flex-col items-center gap-4">
                <div className="flex w-full flex-col gap-2">
                    <PokemonSpeciesSelect
                        currentSelectedNode={currentPokemonInSelect}
                        setCurrentSelectedNode={setCurrentPokemonInSelect}
                    />
                    <PokemonNatureSelect checked={natured} onCheckedChange={setNatured} />
                    <PokemonIvsSelect
                        natured={natured}
                        desired31IVCount={desired31IVCount}
                        setDesired31IVCount={setDesired31IVCount}
                        currentPokemonInSelect={currentPokemonInSelect}
                        currentIVDropdownValues={currentIVDropdownValues}
                        setCurrentPokemonInSelect={setCurrentPokemonInSelect}
                        setCurrentIVDropdownValues={setCurrentIVDropdownValues}
                    />
                </div>
            </div>
            {/* <pre>{JSON.stringify({ ivs, nature, pokemon }, null, 2)}</pre> */}
            <div className="flex items-center gap-2">
                <Button type="submit">Start Breeding</Button>
                <Button type="reset" variant={'destructive'} onClick={handleResetFields}>
                    Clear
                </Button>
            </div>
        </form>
    )
}
