import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { BASE_SPRITES_URL } from './consts'
import { assert } from './assert'

export function cn(...inputs: Array<ClassValue>) {
    return twMerge(clsx(inputs))
}

export function getPokemonSpriteUrl(name: string) {
    let _name = name.replace(' ♂', '-m').replace(' ♀', '-f').replace("'", '')

    return `${BASE_SPRITES_URL}/${_name.toLowerCase()}.png`
}

export function randomString(length: number) {
    return Math.random()
        .toString(36)
        .substring(2, 2 + length)
}

export function pascalToSpacedPascal(input: string) {
    return input.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase())
}

export function capitalize(input: string) {
    assert.exists(input[0])

    return input[0].toUpperCase() + input.slice(1)
}
