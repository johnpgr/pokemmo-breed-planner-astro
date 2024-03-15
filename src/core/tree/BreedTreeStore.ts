import type { PokemonBreederKind, PokemonIv } from "../pokemon";
import { PokemonBreedTree } from "./BreedTree";
import type { PokemonBreedTreeNode } from "./BreedTreeNode";

/** 
 * Wrapper for PokemonBreedTree that allows for subscription to changes in React
 */
export class BreedTreeStore {
    private readonly breedTree: PokemonBreedTree
    private listeners = new Set<() => void>()

    constructor(finalPokemonNode: PokemonBreedTreeNode, finalPokemonIvMap: Map<PokemonBreederKind, PokemonIv>){
        this.breedTree = new PokemonBreedTree(finalPokemonNode, finalPokemonIvMap, this.listeners)
    }

    public subscribe(onStoreChange: () => void): () => void {
        this.listeners.add(onStoreChange)

        return () => {
            this.listeners.delete(onStoreChange)
        }
    }

    public getSnapshot(): PokemonBreedTree {
        return this.breedTree
    }
}
