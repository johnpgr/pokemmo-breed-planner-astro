import { assert } from "@/lib/assert"
import { PokemonBreederKind, PokemonIv } from "../pokemon"
import { PokemonBreedTreeNode } from "./BreedTreeNode"
import type { BreedErrorKind } from "../breed"
import { POKEMON_BREEDTREE_LASTROW_MAPPING } from "../consts"
import { PokemonBreedTreePosition } from "./BreedTreePosition"

export type BreedTreePositionKey = string

export class PokemonBreedTree {
    public nodes = new Map<BreedTreePositionKey, PokemonBreedTreeNode>()
    public breedErrors = new Map<[BreedTreePositionKey, BreedTreePositionKey], BreedErrorKind>()

    constructor(
        finalPokemonNode: PokemonBreedTreeNode,
        finalPokemonIvMap: Map<PokemonBreederKind, PokemonIv>,
    ) {
        this.nodes.set(finalPokemonNode.position.key(), finalPokemonNode)

        const natured = Boolean(finalPokemonNode.nature)

        assert.exists(finalPokemonNode.ivs, 'Final pokemon should have ivs')
        const generations = natured
            ? finalPokemonNode.ivs.length + 1
            : finalPokemonNode.ivs.length

        const lastRowBreeders = POKEMON_BREEDTREE_LASTROW_MAPPING[generations]
        assert.exists(lastRowBreeders, 'Invalid generations number')

        this.initNodes(
            generations,
            natured ? lastRowBreeders.natured : lastRowBreeders.natureless,
            finalPokemonNode,
            finalPokemonIvMap,
        )
    }

    private initNodes(
        generations: number,
        lastRowBreedersPositions: ReadonlyMap<BreedTreePositionKey, PokemonBreederKind>,
        finalPokemonNode: PokemonBreedTreeNode,
        finalPokemonIvs: Map<PokemonBreederKind, PokemonIv>,
    ) {
        // initialize last row
        for (const [k, v] of lastRowBreedersPositions.entries()) {
            switch (v) {
                case PokemonBreederKind.Nature: {
                    const position = PokemonBreedTreePosition.fromKey(k)
                    this.nodes.set(
                        position.key(),
                        new PokemonBreedTreeNode(
                            position,
                            undefined,
                            undefined,
                            finalPokemonNode.nature,
                            undefined,
                        )
                    )
                    break
                }
                default: {
                    const position = PokemonBreedTreePosition.fromKey(k)
                    const ivs = finalPokemonIvs.get(v)
                    assert.exists(ivs, 'Ivs should exist for last row breeders')

                    this.nodes.set(
                        position.key(),
                        new PokemonBreedTreeNode(
                            position,
                            undefined,
                            undefined,
                            undefined,
                            [ivs],
                        ),
                    )
                    break
                }
            }
        }

        // initialize the rest of the tree
        // start from the second to last row
        // stops on the first row where the final pokemon node is already set
        let row = generations - 2
        while (row > 0) {
            let col = 0
            while (col < Math.pow(2, row)) {
                const pos = new PokemonBreedTreePosition(row, col)

                const node = this.nodes.get(pos.key())
                assert.exists(node, 'Node should exist')

                const parentNodes = node.getParentNodes(this.nodes)
                assert.exists(parentNodes, 'Parent nodes should exist')

                const p1Node = parentNodes[0]
                const p2Node = parentNodes[1]

                const ivs = [...(p1Node.ivs ?? []), ...(p2Node.ivs ?? [])]

                const nature = p1Node.nature ?? p2Node.nature ?? undefined

                this.nodes.set(
                    pos.key(),
                    new PokemonBreedTreeNode(
                        pos,
                        undefined,
                        undefined,
                        nature,
                        ivs,
                    ),
                )
                col = col + 1
            }
            row = row - 1
        }
    }
}