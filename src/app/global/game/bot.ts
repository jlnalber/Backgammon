import { SnackbarService } from "../snackbar/snackbar.service";
import { getPossibleMoves, Move } from "./gameUtils";
import Spielstand from "./spielstand";
import User from "./user";

export default class Bot extends User {
    constructor(name: string, snackbar: SnackbarService) {
        super(name, snackbar);
    }

    public override move(d1: number, d2: number, dice: number[], spielstand: Spielstand, dann: () => void, finish: (user: User) => void): void {
        super.move(d1, d2, dice, spielstand, dann, finish);

        // Hier muss eine Logik implementiert werden, um den besten Zug für den Bot zu finden
        const spielzuege = getAllCombinationsOfMoves(spielstand, this.white, dice);
        if (spielzuege.length !== 0) {
            const spielzuegeMitFitness = spielzuege.map(i => [i, fitness(i[1], this.white, 0.5)] as [Spielzug, number]);
            
            let maxFitnessIndex = 0;
            for (let i = 1; i < spielzuegeMitFitness.length; i++) {
                if (spielzuegeMitFitness[i][1] > spielzuegeMitFitness[maxFitnessIndex][1]) {
                    maxFitnessIndex = i;
                }
            }
            const bestMoves = spielzuegeMitFitness[maxFitnessIndex][0][0];

            // gehe die Schritte
            this.doMoves(bestMoves, dann);/*
            for (let m of bestMoves) {
                this.moveSpielstein(m[0], m[1], m[2], false);
            }*/
        } else {
            if (!this.hatGewonnen()) {
                // Hier geht es nicht mehr weiter und es muss abgebrochen werden
                dann();
            }
        }
    }

    private doMoves(moves: Move[], dann: () => void): void {
        if (moves.length === 0) {
            if (!this.hatGewonnen()) {
                dann(); // höre auf und lass den nächsten Spieler spielen
            }
        }
        else {
            setTimeout(() => {
                const m = moves[0];
                this.moveSpielstein(m[0], m[1], m[2], false); // gehe einen Schritt
                this.doMoves(moves.slice(1), dann);
            }, 2500)
        }
    }
}


function getSpielstandAfterMove(spielstand: Spielstand, white: boolean, move: Move): Spielstand {
    // Berechnet den folge Spielstand, ohne dabei darauf zu achten, dass dieser auch möglich wäre oder tatsächlich etwas zu verändern
    const res: Spielstand = {
        white: [...spielstand.white],
        black: [...spielstand.black]
    };

    // move:
    const myArray = white ? res.white : res.black;
    const oppArray = white ? res.black : res.white;
    const index = myArray.indexOf(move[0]);
    if (index !== -1) {
        myArray[index] = move[1];

        if (move[1] !== -1) {
            const indexOpp = oppArray.indexOf(move[1]);
            if (indexOpp !== -1) {
                oppArray[indexOpp] = -2;
            }
        }
    }

    // wegen Referenztyp sind die Arrays schon korrekt geändert
    return res;
}

function getAllCombinationsOfMoves(spielstand: Spielstand, white: boolean, dice: number[]): Spielzug[] {
    const res: Spielzug[] = [];
    const possibleMovesInThisStep = getPossibleMoves(spielstand, white, dice, false);

    for (let m of possibleMovesInThisStep) {
        const spielstandNachZug = getSpielstandAfterMove(spielstand, white, m);
        const nachfolgendeSpielzüge = getAllCombinationsOfMoves(spielstandNachZug, white, m[2]);

        if (nachfolgendeSpielzüge.length === 0) {
            // Falls nichts mehr geht, einfach anhängen
            res.push([[m], spielstandNachZug]);
        } else {
            // Ansonsten füge jedem Spielzug den gerade durchgeführte Move durch
            res.push(...nachfolgendeSpielzüge.map(i => {
                const l: Spielzug = [[m, ...i[0]], i[1]];
                return l;
            }));
        }
    }

    return res;
}

function fitnessEigenerStand(spielstand: Spielstand, white: boolean): number {
    // Führe eine Bewertung durch, wie gut der Spielstand für einen Spieler aussieht
    const myArray = white ? invertArray(spielstand.white) : spielstand.black;
    const oppArray = white ? invertArray(spielstand.black) : spielstand.white;

    // Idee, Zähle alle Steine, die sicher stehen, positiv. Alle, die einzeln stehen negativ.
    const factPos = 1;
    const factNeg = -2;
    const factBar = 5;
    const factEigenesViertel = 0.25; // 0,25 Bonus Punkte für einen Stein, der im eigenen Viertel steht
    const factMinus1 = 3; // 3 Bonus Punkte für einen Stein, der im Ziel steht

    let maxOpp = 0; // 24 bedeutet hier Bar und alles andere ist klar
    for (let i of oppArray) {
        if (i === -2) {
            maxOpp = 24;
            break;
        }
        else if (i > maxOpp) {
            // Nur falls nicht schon abgelegt (fällt wegen Anfangskriterium sowieso heraus)
            maxOpp = i;
        }
    }

    const map: number[] = []; // Zählt die Anzahl der Steine auf den Feldern: -2, 0, 1, ..., 23, -1
    for (let i = -2; i < 24; i++) {
        if (i !== -1) {
            // diesen Fall zählen wir später

            map.push(myArray.filter(j => j === i).length);
        }
    }
    map.push(myArray.filter(j => j === -1).length);

    // Zähle nun die Zahlen zusammen
    let positiveSum = 0;
    let negativeSum = map[0] * factBar; // Zähle die Steine auf der Bar negativ
    for (let i = 1; i < map.length; i++) {
        if (map[i] > 1 || i > maxOpp) {
            positiveSum += map[i] * i;

            if (i === map.length - 1) {
                positiveSum += map[i] * factMinus1; // Gib den Steinen im Ziel einen Bonus
            } else if (i > 18) {
                // Dann steht der Stein im eigenen Viertel
                positiveSum += map[i] * factEigenesViertel; // Gib den Steinen im eigenen Viertel einen Bonus
            }
        } else {
            // 2fach Minus, falls innerhalb von 6 Punkten vom Gegner
            const fact6 = 2;
            // 1fach Minus, falls innerhalb von 12 Punkten vom Gegner
            const fact12 = 1;
            // 0,5fach, falls weiter weg
            const fact0 = 0.5;
            // 0fach, falls vor Gegner (wird positiv gewertet)
            const factVorGegner = 0;

            let fact = 0;
            const posVorGegner = oppArray.map(i => i === -2 ? 24 : i).filter(j => j >= i);
            if (posVorGegner.length === 0) {
                // Das sollte eigentlich nicht passieren, denn der Fall würde bereits abgedeckt eigentlich
                fact = factVorGegner;
            } else {
                const minPosVorGegner = posVorGegner.reduce((a, b) => Math.min(a, b), 24);
                const diff = minPosVorGegner - (i - 1); // i - 1, weil wir ja die Bar mitzählen, daher ist i-1 die Position
                if (diff <= 6) {
                    fact = fact6;
                } else if (diff <= 12) {
                    fact = fact12;
                } else {
                    fact = fact0;
                }
            }

            negativeSum += map[i] * i * fact; // Zähle die Steine negativ, wenn sie nur 1x stehen
        }
    }

    // Verrechne nun:
    return factPos * positiveSum + factNeg * negativeSum;
}

function fitness(spielstand: Spielstand, white: boolean, aggressivität: number): number {
    const fitnessSelbst = fitnessEigenerStand(spielstand, white);
    const fitnessGegner = fitnessEigenerStand(spielstand, !white);
    return fitnessSelbst - (aggressivität / 0.5) ** 2 * fitnessGegner;
}

function invertArray(arr: number[]): number[] {
    return arr.map(i => i < 0 ? i : 23 - i);
}

type Spielzug = [Move[], Spielstand];