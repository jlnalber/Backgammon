export default interface Spielstand {
    black: number[],
    white: number[]
}

export function getDefaultSpielstand(): Spielstand {
    return {
        black: [
            0, 0,
            11, 11, 11, 11, 11,
            16, 16, 16,
            18, 18, 18, 18, 18
        ],
        white: [
            23, 23,
            12, 12, 12, 12, 12,
            7, 7, 7,
            5, 5, 5, 5, 5
        ]
    }
}
