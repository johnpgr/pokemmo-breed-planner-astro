import fs from 'fs'
import csvParser from 'csv-parser'
import { EggGroup, Pokemon } from '@/pokemons'
import Bun from 'bun'

const csvDataPath = Bun.resolveSync('./data.csv', import.meta.dirname)
const jsonDataPath = Bun.resolveSync('./data.json', import.meta.dirname)

const skippedPokemons = [
    'Mega',
    'Partner',
    'Alolan',
    'Galarian',
    'Castform ',
    'Wormadam Sandy Cloak',
    'Wormadam Trash Cloak',
    'Wash',
    'Frost',
    'Heat',
    'Fan',
    'Mow',
    'Basculin Blue-Striped Form',
    'Darmanitan Zen Mode',
]

function fixPokemonEggGroups(pokemon: Pokemon): [EggGroup, EggGroup?] {
    switch (pokemon.name) {
        case 'Nidorina':
            return [EggGroup.Field, EggGroup.Monster]
        case 'Nidoqueen':
            return [EggGroup.Field, EggGroup.Monster]
        case 'Rotom':
            return [EggGroup.Genderless]
        case 'Magnemite':
            return [EggGroup.Genderless]
        case 'Magneton':
            return [EggGroup.Genderless]
        case 'Magnezone':
            return [EggGroup.Genderless]
        case 'Staryu':
            return [EggGroup.Genderless]
        case 'Starmie':
            return [EggGroup.Genderless]
        case 'Bronzor':
            return [EggGroup.Genderless]
        case 'Bronzong':
            return [EggGroup.Genderless]
        case 'Solrock':
            return [EggGroup.Genderless]
        case 'Lunatone':
            return [EggGroup.Genderless]
        case 'Beldum':
            return [EggGroup.Genderless]
        case 'Metang':
            return [EggGroup.Genderless]
        case 'Metagross':
            return [EggGroup.Genderless]
        case 'Baltoy':
            return [EggGroup.Genderless]
        case 'Claydol':
            return [EggGroup.Genderless]
        case 'Voltorb':
            return [EggGroup.Genderless]
        case 'Electrode':
            return [EggGroup.Genderless]
        case 'Porygon':
            return [EggGroup.Genderless]
        case 'Porygon2':
            return [EggGroup.Genderless]
        case 'Porygon-Z':
            return [EggGroup.Genderless]
        case 'Klink':
            return [EggGroup.Genderless]
        case 'Klang':
            return [EggGroup.Genderless]
        case 'Klinklang':
            return [EggGroup.Genderless]
        case 'Cryogonal':
            return [EggGroup.Genderless]
        case 'Golett':
            return [EggGroup.Genderless]
        case 'Golurk':
            return [EggGroup.Genderless]
        default:
            return pokemon.eggGroups
    }
}

function parseEggGroup(eggGroup: string): EggGroup | undefined {
    switch (eggGroup) {
        case 'Water 1':
            return EggGroup.WaterA
        case 'Water 2':
            return EggGroup.WaterB
        case 'Water 3':
            return EggGroup.WaterC
        case 'Undiscovered':
            return EggGroup.CannotBreed
        case 'Human-Like':
            return EggGroup.Humanoid
        case '':
            return undefined
        default:
            return eggGroup as EggGroup
    }
}

function parseName(name: string): string {
    switch (name) {
        case 'Wormadam Plant Cloak':
            return 'Wormadam'
        case 'Basculin Red-Striped Form':
            return 'Basculin'
        case 'Darmanitan Standard Mode':
            return 'Darmanitan'
        case 'Nidoran':
            return 'Nidoran ♀'
        case 'Nidoran':
            return 'Nidoran ♂'
        default:
            return name
    }
}

const pokemons: Pokemon[] = []

fs.createReadStream(csvDataPath, 'utf8')
    .pipe(
        csvParser({
            mapHeaders: ({ header }) => header.trim(),
        }),
    )
    .on('data', (row) => {
        if (
            skippedPokemons.some((name) =>
                (row['name'] as string).startsWith(name),
            )
        ) {
            return
        }

        const pokemon = new Pokemon(
            parseInt(row['pokedex_number']),
            parseName(row['name']),
            [row['type_1'], row['type_2']].filter(Boolean),
            //@ts-ignore
            [
                parseEggGroup(row['egg_type_1']),
                parseEggGroup(row['egg_type_2']),
            ],
            parseFloat(row['percentage_male']),
        )

        const fix = fixPokemonEggGroups(pokemon)

        if (fix) {
            pokemon.eggGroups[0] = fix[0]
            if (fix[1]) {
                pokemon.eggGroups[1] = fix[1]
            }
        }

        pokemons.push(pokemon)
    })
    .on('end', () => {
        fs.writeFileSync(jsonDataPath, JSON.stringify(pokemons, null, 4))
    })
