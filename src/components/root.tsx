import { PokemonToBreedSelect } from '@/core/components/PokemonBreedSelect'
import { PokemonToBreedContext } from '@/core/components/PokemonToBreedContext'
import { PokemonBreedTree } from '@/core/components/PokemonBreedTree'

export function Root() {
    return (
        <PokemonToBreedContext>
            <PokemonToBreedSelect />
            <PokemonBreedTree />
        </PokemonToBreedContext>
    )
}
