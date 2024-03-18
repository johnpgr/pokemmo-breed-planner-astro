import type { IVSet } from '../components/PokemonToBreedContext'
import { PokemonBreedTree } from './BreedTree'
import { PokemonBreedTreeNode } from './BreedTreeNode'

/**
 * Wrapper for PokemonBreedTree that allows for subscription to changes in React
 */
export class BreedTreeStore {
    private readonly breedTree = PokemonBreedTree.EMPTY()
    private readonly listeners = new Set<() => void>()

    public static EMPTY(): BreedTreeStore {
        return new BreedTreeStore()
    }

    public init(
        finalPokemonNode: PokemonBreedTreeNode,
        finalPokemonIvMap: IVSet,
        generations: number,
    ): BreedTreeStore {
        //React double initial render bullshit
        if (this.breedTree.nodes.size > 0) {
            return this
        }

        this.breedTree.init(
            finalPokemonNode,
            finalPokemonIvMap,
            generations,
            this.listeners,
        )
        this.breedTree.emitChange()

        return this
    }

    //using arrow function to bind this
    public subscribe = (onStoreChange: () => void): (() => void) => {
        this.listeners.add(onStoreChange)

        return () => {
            this.listeners.delete(onStoreChange)
        }
    }

    //using arrow function to bind this
    public getSnapshot = (): PokemonBreedTree => {
        return this.breedTree
    }
}
