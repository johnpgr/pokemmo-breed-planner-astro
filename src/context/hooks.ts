import { assert } from '@/lib/utils'
import { useContext } from 'react'
import { PokemonToBreedContextPrimitive } from '.'

export function usePokemonToBreed() {
    const ctx = useContext(PokemonToBreedContextPrimitive)
    assert(ctx !== null, 'usePokemonToBreed must be used within a PokemonToBreedContextProvider')

    return ctx
}
