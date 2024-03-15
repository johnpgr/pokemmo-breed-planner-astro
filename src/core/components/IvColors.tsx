import type { IVSet } from './PokemonToBreedContext';
import type { PokemonIv, PokemonNature } from '../pokemon';
import { pascalToSpacedPascal } from '@/lib/utils';

const COLOR_MAP = {
    Hp: '#55b651',
    Attack: '#F44336',
    Defense: '#f78025',
    SpecialAttack: '#e925f7',
    SpecialDefense: '#f7e225',
    Speed: '#25e2f7',
    Nature: '#e0f1f4',
} as const

export type Color = (typeof COLOR_MAP)[keyof typeof COLOR_MAP]

export function IvColors(props: { ivs: IVSet; nature?: PokemonNature }) {
    return (
        <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
                <div
                    className="rounded-full p-3 h-4 w-4"
                    style={{
                        backgroundColor: COLOR_MAP[props.ivs.A],
                    }}
                />
                <span className="text-sm">
                    {pascalToSpacedPascal(props.ivs.A)}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div
                    className="rounded-full p-3 h-4 w-4"
                    style={{
                        backgroundColor: COLOR_MAP[props.ivs.B],
                    }}
                />
                <span className="text-sm">
                    {pascalToSpacedPascal(props.ivs.B)}
                </span>
            </div>
            {props.ivs.C ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: COLOR_MAP[props.ivs.C],
                        }}
                    />
                    <span className="text-sm">
                        {pascalToSpacedPascal(props.ivs.C)}
                    </span>
                </div>
            ) : null}
            {props.ivs.D ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: COLOR_MAP[props.ivs.D],
                        }}
                    />
                    <span className="text-sm">
                        {pascalToSpacedPascal(props.ivs.D)}
                    </span>
                </div>
            ) : null}
            {props.ivs.E ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: COLOR_MAP[props.ivs.E],
                        }}
                    />
                    <span className="text-sm">
                        {pascalToSpacedPascal(props.ivs.E)}
                    </span>
                </div>
            ) : null}
            {props.nature ? (
                <div className="flex items-center gap-2">
                    <div
                        className="rounded-full p-3 h-4 w-4"
                        style={{
                            backgroundColor: COLOR_MAP['Nature'],
                        }}
                    />
                    <span className="text-sm">{props.nature}</span>
                </div>
            ) : null}
        </div>
    )
}

export function getColorsByIvs(ivs: PokemonIv[]): Color[] {
    return ivs.map((iv) => COLOR_MAP[iv])
}
