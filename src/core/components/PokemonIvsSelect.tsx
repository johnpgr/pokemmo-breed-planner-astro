import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { pascalToSpacedPascal, randomString } from '@/lib/utils'
import React from 'react'
import { PokemonIv } from '../pokemon'
import type { PokemonNodeInSelect } from './PokemonBreedSelect'
import { DEFAULT_IV_DROPDOWN_VALUES } from './consts'

export const pokemonBreederKindCountByGenerations = {
    2: { natured: { A: 2, B: 1 }, natureless: { A: 1, B: 1 } },
    3: { natured: { A: 4, B: 2, C: 1 }, natureless: { A: 2, B: 1, C: 1 } },
    4: {
        natured: { A: 6, B: 5, C: 3, D: 1 },
        natureless: { A: 3, B: 2, C: 2, D: 1 },
    },
    5: {
        natured: { A: 11, B: 10, C: 6, D: 2, E: 2 },
        natureless: { A: 5, B: 5, C: 3, D: 2, E: 1 },
    },
} as const

export function PokemonIvsSelect(props: {
    natured: boolean
    desired31IVCount: number
    setDesired31IVCount: React.Dispatch<React.SetStateAction<number>>
    currentIVDropdownValues: PokemonIv[]
    setCurrentIVDropdownValues: React.Dispatch<
        React.SetStateAction<PokemonIv[]>
    >
    currentPokemonInSelect: PokemonNodeInSelect
    setCurrentPokemonInSelect: React.Dispatch<
        React.SetStateAction<PokemonNodeInSelect>
    >
}) {
    function handleDesired31IvCountChange(number: string) {
        const value = parseInt(number)
        const ivSet = new Set(props.currentIVDropdownValues.slice(0, value))
        props.setCurrentPokemonInSelect((prev) => ({
            ...prev,
            ivs: Array.from(ivSet),
        }))
    }

    const pokemonCount = props.natured
        ? pokemonBreederKindCountByGenerations[
              props.desired31IVCount as keyof typeof pokemonBreederKindCountByGenerations
          ].natured
        : pokemonBreederKindCountByGenerations[
              props.desired31IVCount as keyof typeof pokemonBreederKindCountByGenerations
          ].natureless

    // function handleChange(value: PokemonIv, index: number) {
    //     const previousValue = props.currentIVDropdownValues[index]
    //     const newValues = [...props.currentIVDropdownValues]
    //     newValues[index] = value
    //
    //     props.setCurrentPokemonInSelect((prev) => {
    //         const newIvs = new Set([...prev.ivs])
    //         if (!isPreviousValueCurrentlySelected(previousValue, index)) {
    //             newIvs.delete(previousValue)
    //         }
    //         newIvs.add(value)
    //         return Array.from(newIvs)
    //     })
    //
    //     setCurrentSelectValues(newValues)
    // }
    //
    // function isPreviousValueCurrentlySelected(
    //     value: PokemonIv,
    //     currentValueIndex: number,
    // ) {
    //     const currentSelects:PokemonIv[] = []
    //
    //     for (let i = 0; i < props.desired31IVCount; i++) {
    //         if (i === currentValueIndex) continue
    //         const value = props.currentIVDropdownValues[i]
    //         assert.exists(value)
    //         currentSelects.push(value)
    //     }
    //
    //     return currentSelects.includes(value)
    // }

    function handleIvSelectChange(value: PokemonIv, index: number) {
        const newDropDownValues = [...props.currentIVDropdownValues]
        newDropDownValues[index] = value
        props.setCurrentIVDropdownValues(newDropDownValues)
        props.setCurrentPokemonInSelect((prev) => ({
            ...prev,
            ivs: newDropDownValues.slice(0, props.desired31IVCount),
        }))
    }

    return (
        <div>
            <RadioGroup
                className="border rounded w-fit flex"
                defaultValue={'2'}
                onValueChange={handleDesired31IvCountChange}
            >
                <RadioGroupItem className="border-0" value={'2'}>
                    2
                </RadioGroupItem>
                <RadioGroupItem className="border-0" value={'3'}>
                    3
                </RadioGroupItem>
                <RadioGroupItem className="border-0" value={'4'}>
                    4
                </RadioGroupItem>
                <RadioGroupItem className="border-0" value={'5'}>
                    5
                </RadioGroupItem>
            </RadioGroup>
            <div className="flex flex-col md:flex-row items-center gap-2">
                {Object.entries(pokemonCount).map(([_, value], i) => (
                    <div key={randomString(6)} className="w-full">
                        <Label
                            key={randomString(6)}
                            className="text-sm text-foreground/70"
                        >
                            <strong className="text-lg text-foreground mr-1">
                                {value}
                            </strong>{' '}
                            1x31 IV in
                        </Label>
                        <Select
                            value={props.currentIVDropdownValues[i]!}
                            onValueChange={(v) =>
                                handleIvSelectChange(v as PokemonIv, i)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue
                                    aria-label={
                                        props.currentIVDropdownValues[i]
                                    }
                                >
                                    {pascalToSpacedPascal(
                                        props.currentIVDropdownValues[i]!,
                                    )}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {DEFAULT_IV_DROPDOWN_VALUES.map((iv) => (
                                    <SelectItem
                                        key={randomString(6)}
                                        value={iv}
                                    >
                                        {pascalToSpacedPascal(iv)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))}
            </div>
        </div>
    )
}
