import { PokemonToBreedSelect } from '@/core/components/PokemonBreedSelect'
import { PokemonToBreedContext, usePokemonToBreed } from '@/core/components/PokemonToBreedContext'
import { PokemonBreedTree } from '@/core/components/PokemonBreedTree'

export default function Index() {
    const ctx = usePokemonToBreed()
    return (
        <PokemonToBreedContext>
            <PokemonToBreedSelect />
            {ctx.pokemon
                ? <PokemonBreedTree />
                : null
            }
        </PokemonToBreedContext>
    )
}
