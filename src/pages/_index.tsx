import { PokemonToBreedSelector } from '@/core/components/pokemon-form'
import { PokemonTree } from '@/core/components/tree'
import { PokemonToBreedContext } from '../context'
import { usePokemonToBreed } from '@/context/hooks'

export default function Index() {
    const ctx = usePokemonToBreed()
    return (
        <PokemonToBreedContext>
            <PokemonToBreedSelector />
            {ctx.pokemon
                ? <PokemonTree />
                : null
            }
        </PokemonToBreedContext>
    )
}
