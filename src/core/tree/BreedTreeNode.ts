import type { PokemonGender, PokemonIv, PokemonNature, PokemonSpecies } from '../pokemon'
import { PokemonBreedTreePosition } from './BreedTreePosition'

export class PokemonBreedTreeNode {
    constructor(
        public position: PokemonBreedTreePosition,
        public species?: PokemonSpecies,
        public gender?: PokemonGender,
        public nature?: PokemonNature,
        public ivs?: PokemonIv[],
    ) {}

    static EMPTY(pos: PokemonBreedTreePosition): PokemonBreedTreeNode {
        return new PokemonBreedTreeNode(pos)
    }

    public copy(): PokemonBreedTreeNode {
        return structuredClone(this)
    }

    public getPartnerNode(nodes: Map<string, PokemonBreedTreeNode>): PokemonBreedTreeNode | undefined {
        const partnerCol = this.position.col % 2 === 0 ? this.position.col + 1 : this.position.col - 1

        return nodes.get(new PokemonBreedTreePosition(this.position.row, partnerCol).key())
    }

    public getParentNodes(
        nodes: Map<string, PokemonBreedTreeNode>,
    ): Readonly<[PokemonBreedTreeNode, PokemonBreedTreeNode]> | undefined {
        const parentRow = this.position.row + 1
        const parentCol = this.position.col * 2

        const parent1 = nodes.get(new PokemonBreedTreePosition(parentRow, parentCol).key())
        const parent2 = nodes.get(new PokemonBreedTreePosition(parentRow, parentCol + 1).key())

        if (!parent1 || !parent2) return undefined

        return [parent1, parent2]
    }
}
