import { PokemonToBreedSelect } from '@/core/components/PokemonBreedSelect'
import { PokemonToBreedContext, usePokemonToBreed } from '@/core/components/PokemonToBreedContext'
import { PokemonTree } from '@/core/components/tree'

export default function Index() {
    const ctx = usePokemonToBreed()
    return (
        <PokemonToBreedContext>
            <PokemonToBreedSelect />
            {ctx.pokemon
                ? <PokemonTree />
                : null
            }
        </PokemonToBreedContext>
    )
}
