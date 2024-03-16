import React from 'react'
import { Female, Male } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { pascalToSpacedPascal, getPokemonSpriteUrl, randomString } from '@/lib/utils'
import { HelpCircle } from 'lucide-react'
import { HeldItem, HeldItemsView } from './held-items'
import type { PokemonBreedTreeNode } from '../tree/BreedTreeNode'
import { PokemonGender, PokemonIv } from '../pokemon'
import type { PokemonBreedTree } from '../tree/BreedTree'
import { assert } from '@/lib/assert'

//TODO: Improve the UI on this.
export function CurrentNodeInfoCard(props: {
    position: Position
    currentNode: PokemonBreedTreeNode
    breedTree: PokemonBreedTree
    setGender: (gender: PokemonGender) => void
    children?: React.ReactNode
}) {
    function onCheckedChange(value: boolean) {
        props.setGender(value ? PokemonGender.Female : PokemonGender.Male)
    }

    function getHeldItem(): HeldItem | undefined {
        assert.exists(props.currentNode.ivs, 'IVs must exist in every node')
        const breedPartner = props.currentNode.getPartnerNode(props.breedTree)

        if (!breedPartner) {
            return
        }

        assert.exists(breedPartner.ivs, 'IVs must exist in every node')

        const ivThatDoesntExistOnBreedPartner = props.currentNode.ivs.filter((iv) => !breedPartner.ivs!.includes(iv))
        if (ivThatDoesntExistOnBreedPartner.length === 0) {
            return
        }

        switch (ivThatDoesntExistOnBreedPartner[0]) {
            case PokemonIv.HP:
                return HeldItem.HP
            case PokemonIv.Attack:
                return HeldItem.Attack
            case PokemonIv.Defense:
                return HeldItem.Defense
            case PokemonIv.SpecialAttack:
                return HeldItem.SpecialAttack
            case PokemonIv.SpecialDefense:
                return HeldItem.SpecialDefense
            case PokemonIv.Speed:
                return HeldItem.Speed
            default:
                return
        }
    }

    const heldItem = getHeldItem()

    return (
        <Card className="w-fit h-fit relative">
            <CardHeader className="pb-2 pt-4">
                {heldItem ? (
                    <HeldItemsView
                        item={
                            //if not natured, ivs must exist.
                            props.currentNode.nature ? HeldItem.Nature : heldItem
                        }
                    />
                ) : null}
                <CardTitle className="flex items-center">
                    {props.currentNode && props.currentNode.species ? (
                        <React.Fragment>
                            <img
                                src={getPokemonSpriteUrl(props.currentNode.species.name)}
                                style={{
                                    imageRendering: 'pixelated',
                                }}
                                alt={props.currentNode.species.name}
                                className="mb-1"
                            />
                            {props.currentNode.species.name}
                        </React.Fragment>
                    ) : (
                        <HelpCircle size={32} />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="gap-4 flex flex-col">
                <div className="flex flex-col gap-1">
                    {Boolean(props.currentNode.ivs) ? <p>Ivs:</p> : null}
                    {props.currentNode.ivs?.map((iv) => <span key={randomString(4)}>31 {pascalToSpacedPascal(iv)}</span>)}
                </div>
                {props.currentNode.nature && <i className="block">{props.currentNode.nature}</i>}
                {props.currentNode.species ? (
                    <React.Fragment>
                        <div className="flex flex-col gap-1">
                            <p>Egg Groups:</p>
                            {props.currentNode.species.eggGroups.map((egg) => (
                                <span key={randomString(3)}>{egg}</span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Male className="fill-blue-500 h-6 w-fit" />
                            <Switch
                                className="data-[state=unchecked]:bg-primary"
                                checked={props.currentNode.gender === PokemonGender.Female}
                                onCheckedChange={onCheckedChange}
                            />
                            <Female className="fill-pink-500 h-6 w-fit -ml-1" />
                        </div>
                    </React.Fragment>
                ) : null}
                {props.children}
            </CardContent>
        </Card>
    )
}
