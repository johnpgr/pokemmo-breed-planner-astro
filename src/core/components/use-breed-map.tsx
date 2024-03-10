import React from 'react'
import type { IV, IVMap } from '@/context/types'
import { NatureType, Pokemon } from '@/data/types'
import { useMount } from '@/lib/hooks/use-mount'
import { BreedError, BreedNodeAndPosition, Breeder } from './breeder'
import { LastRowMapping, columnsPerRow, pokemonIVsPositions } from './consts'
import { getBreedPartnerPosition } from './utils'

export function useBreedMap({
    pokemonToBreed,
    ivMap,
    nature,
    numberOf31IvPokemon,
    setSelectedPokemons,
}: {
    ivMap: IVMap
    generations: number
    pokemonToBreed: BreedNode
    nature: NatureType | null
    setSelectedPokemons: React.Dispatch<
        React.SetStateAction<Array<Pokemon & { position: Position }>>
    >
}) {
    const map = React.useMemo(
        () => new ObservableMap<Position, BreedNode>([['0,0', pokemonToBreed]]),
        [],
    )
    const [lastPositionChange, setLastPositionChange] = React.useState<
        Array<number> | undefined
    >()
    const breeder = React.useMemo(() => new Breeder(map), [map])

    function setLastRow(lastRowMapping: LastRowMapping) {
        Object.entries(lastRowMapping).forEach(([key, value]) => {
            if (value === 'nature') {
                map.set(key as Position, {
                    nature,
                    ivs: null,
                    gender: null,
                    parents: null,
                    pokemon: null,
                })
                return
            }
            if (ivMap[value]) {
                map.set(key as Position, {
                    pokemon: null,
                    parents: null,
                    gender: null,
                    ivs: [ivMap[value]!],
                    nature: null,
                })
            }
        })
    }

    /* This function should be called after setFirstRowIvs.
     * It will set the remaining rows of the map with the correct IVs based on their parents. (Pokemon's that are directly above them in the breed tree)
     * Iterates through all rows starting from the second last row and inserts the correct IVs based on the two direct parents.
     */
    function setRemainingRows() {
        const numberOfRows = nature
            ? numberOf31IvPokemon + 1
            : numberOf31IvPokemon

        // Iterate through all rows starting from the second last row.
        for (let row = numberOfRows - 2; row > 0; row--) {
            // Iterate through all columns in the current row.
            for (let col = 0; col < columnsPerRow[row]; col++) {
                // console.log({ row, col })
                const key = `${row},${col}` as Position

                const parent1Pos = `${row + 1},${col * 2}` as Position
                const parent2Pos = `${row + 1},${col * 2 + 1}` as Position
                const parent1 = map.get(parent1Pos)
                const parent2 = map.get(parent2Pos)

                const ivs: Array<IV> = []
                if (parent1?.ivs) ivs.push(...parent1.ivs)
                if (parent2?.ivs) ivs.push(...parent2.ivs)

                let nature: NatureType | null = null
                if (parent1?.nature) nature = parent1.nature
                if (parent2?.nature) nature = parent2.nature

                map.set(key as Position, {
                    pokemon: null,
                    parents: [parent1Pos, parent2Pos],
                    gender: null,
                    ivs: Array.from(new Set(ivs)),
                    nature,
                })
            }
        }
    }

    useMount(() => {
        const lastRowMapping = nature
            ? pokemonIVsPositions[numberOf31IvPokemon].natured
            : pokemonIVsPositions[numberOf31IvPokemon].natureless

        setLastRow(lastRowMapping)
        setRemainingRows()
        observe(map, (change) => {
            // console.log("change", change)
            if (!('newValue' in change)) return

            //for the ui to update
            setSelectedPokemons((prev) => [
                ...prev,
                {
                    position: change.name,
                    ...change.newValue.pokemon!,
                },
            ])

            //for the breeder logic
            setLastPositionChange(
                change.name.split(',').map((n) => parseInt(n, 10)),
            )
        })
    })

    React.useEffect(() => {
        const nodePosition = lastPositionChange
        // console.log("nodePosition Change:", nodePosition)

        if (!nodePosition) return

        const nodePositionParsed = parseLastPositionChange(nodePosition)
        const node = map.get(nodePositionParsed)
        if (!node) return

        const pokemon = node.pokemon

        const partnerPosition = getBreedPartnerPosition(nodePositionParsed)
        const partnerNode = map.get(partnerPosition)
        if (!partnerNode) return

        const partner = partnerNode.pokemon

        if (!pokemon || !partner) return

        const pokemonBreedNode: BreedNodeAndPosition = {
            breedNode: node,
            position: nodePositionParsed,
        }

        const partnerBreedNode: BreedNodeAndPosition = {
            breedNode: partnerNode,
            position: partnerPosition,
        }

        //TODO: Handle error
        const breedRes = breeder.breed(pokemonBreedNode, partnerBreedNode)
        if (breedRes.err) console.error(breedRes)
    }, [lastPositionChange, breeder, map])

    return map
}
