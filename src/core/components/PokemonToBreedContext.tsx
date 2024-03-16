import React from 'react'
import { PokemonBreederKind, PokemonIv, PokemonNature, PokemonSpecies } from '@/core/pokemon'
import { assert } from '@/lib/assert'

export const PokemonToBreedContextPrimitive = React.createContext<IPokemonToBreedContext | null>(null)

export function PokemonToBreedContext(props: { children: React.ReactNode }) {
    const [pokemon, setPokemon] = React.useState<PokemonSpecies>()
    const [nature, setNature] = React.useState<PokemonNature>()
    const [ivs, setIvs] = React.useState<IVSet>(IVSet.DEFAULT)

    return (
        <PokemonToBreedContextPrimitive.Provider
            value={{
                pokemon,
                setPokemon,
                nature,
                setNature,
                ivs,
                setIvs,
            }}
        >
            {props.children}
        </PokemonToBreedContextPrimitive.Provider>
    )
}

export function usePokemonToBreed() {
    const ctx = React.useContext(PokemonToBreedContextPrimitive)
    assert.exists(ctx, 'usePokemonToBreed must be used within a PokemonToBreedContextProvider')

    return ctx
}

export class IVSet {
    constructor(
        public A: PokemonIv,
        public B: PokemonIv,
        public C?: PokemonIv,
        public D?: PokemonIv,
        public E?: PokemonIv,
    ) {}

    public get(kind: PokemonBreederKind): PokemonIv | undefined {
        switch (kind) {
            case PokemonBreederKind.A:
                return this.A
            case PokemonBreederKind.B:
                return this.B
            case PokemonBreederKind.C:
                return this.C
            case PokemonBreederKind.D:
                return this.D
            case PokemonBreederKind.E:
                return this.E
            default:
                return undefined
        }
    }

    static DEFAULT = new IVSet(PokemonIv.HP, PokemonIv.Attack)
}

export interface IPokemonToBreedContext {
    pokemon: PokemonSpecies | undefined
    setPokemon: React.Dispatch<React.SetStateAction<PokemonSpecies | undefined>>
    ivs: IVSet
    setIvs: React.Dispatch<React.SetStateAction<IVSet>>
    nature: PokemonNature | undefined
    setNature: React.Dispatch<React.SetStateAction<PokemonNature | undefined>>
}
