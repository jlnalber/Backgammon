import { isIn } from "../essentials/utils";
import { Point } from "../interfaces/point";
import { Rect } from "../interfaces/rect";
import Spielstand from "./spielstand";

export type Move = [number, number, number[]] // From, To, Dices left

const res = 2;
const padding = 10 * res;
const paddingRight = 30 * res;
const bar = 30 * res;
const punkteBreite = 25 * res;
const punkteMargin = 5 * res;
const spielsteinRadius = 10 * res;
const spielsteinInnerRadius = 6 * res;
const spielsteinMargin = 2 * res;
const spielHälfteWidth = 6 * punkteBreite + 7 * punkteMargin;
const punkteVerticalMargin = 60 * res;
const punkteHeight = 120 * res;
const spielHälfteHeight = 2 * punkteHeight + punkteVerticalMargin;
const strokeWidth = 1 * res;

const emphasizeSpielstein = "#f00";
const emphazisePunkteFill = "#f00";
const emphasizeSpielsteinInner = "#a00";

const width = 2 * spielHälfteWidth + padding + paddingRight + bar;
const height = 2 * padding + spielHälfteHeight;

export function drawSpielstand(canvas: HTMLCanvasElement, spielstand: Spielstand, emphazisePunkte: number[] = [], emphaziseSpielsteine: number[] = [], emphaziseWhite: boolean = true): void {
    const ctx = canvas.getContext("2d");
    if (ctx) {

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = "#995500"
        ctx.fillRect(0, 0, width, height);
        ctx.lineWidth = strokeWidth;

        const drawHälfte = (x: number, left: boolean) => {
            ctx.fillStyle = "#ddaa33";
            ctx.strokeStyle = "#333";
            ctx.fillRect(x, padding, spielHälfteWidth, spielHälfteHeight);
            ctx.strokeRect(x, padding, spielHälfteWidth, spielHälfteHeight);

            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                const b = "#540"
                const w = "#f0f0cc"
                ctx.moveTo(x + punkteMargin * (i + 1) + i * punkteBreite, padding)
                ctx.lineTo(x + punkteMargin * (i + 1) + (i + 1) * punkteBreite, padding)
                ctx.lineTo(x + punkteMargin * (i + 1) + (i + 1 / 2) * punkteBreite, padding + punkteHeight)
                ctx.closePath();

                const oIsE = left && emphazisePunkte.indexOf(i + 12) !== -1 || !left && emphazisePunkte.indexOf(i + 18) !== -1;
                if (oIsE) {
                    ctx.fillStyle = emphazisePunkteFill;
                } else {
                    if (i % 2 === 0) {
                        ctx.fillStyle = w
                    }
                    else {
                        ctx.fillStyle = b
                    }
                }
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(x + punkteMargin * (i + 1) + i * punkteBreite, height - padding)
                ctx.lineTo(x + punkteMargin * (i + 1) + (i + 1) * punkteBreite, height - padding)
                ctx.lineTo(x + punkteMargin * (i + 1) + (i + 1 / 2) * punkteBreite, height - (padding + punkteHeight))
                ctx.closePath();

                const uIsE = left && emphazisePunkte.indexOf(11 - i) !== -1 || !left && emphazisePunkte.indexOf(5 - i) !== -1;
                if (uIsE) {
                    ctx.fillStyle = emphazisePunkteFill;
                } else {   
                    if (i % 2 !== 0) {
                        ctx.fillStyle = w
                    }
                    else {
                        ctx.fillStyle = b
                    }
                }
                ctx.fill();
                ctx.stroke();
            }
        }

        const numOfSpielsteineAtPos: number[] = [];
        for (let i = 0; i < 4 * 6; i++) {
            numOfSpielsteineAtPos.push(0);
        }

        const drawSpielstein = (pos: number, color: string, stroke: string, innerCircleFill: string, white: boolean) => {
            if (pos !== -1) {
                ctx.beginPath();
                const num = pos === -2 ? 0 : numOfSpielsteineAtPos[pos]++;
                const dx = (pos % 6 + 1) * punkteMargin + (pos % 6 + 1 / 2) * punkteBreite;
                const x = pos === -2 ? padding + spielHälfteWidth + bar / 2 :
                        pos < 6 ? width - paddingRight - dx : 
                        pos < 12 ? padding + spielHälfteWidth - dx :
                        pos < 18 ? padding + dx : padding + bar + spielHälfteWidth + dx;
                const dy = (2 * num + 1) * spielsteinRadius + (num + 1) * spielsteinMargin;
                const y = pos < 12 && pos >= 0 || pos === -2 && !white ? height - padding - dy : padding + dy;
                ctx.ellipse(x, y, spielsteinRadius, spielsteinRadius, 0, 0, 2 * Math.PI);
                ctx.fillStyle = color;
                ctx.strokeStyle = stroke;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                
                ctx.beginPath();
                ctx.ellipse(x, y, spielsteinInnerRadius, spielsteinInnerRadius, 0, 0, 2 * Math.PI);
                ctx.fillStyle = innerCircleFill;
                ctx.fill();
                ctx.closePath();
            }
        }


        drawHälfte(padding, true);
        drawHälfte(padding + bar + spielHälfteWidth, false);

        if (emphazisePunkte.indexOf(-1) !== -1) {
            ctx.fillStyle = emphazisePunkteFill;
            ctx.fillRect(width - paddingRight + strokeWidth / 2, padding, paddingRight, spielHälfteHeight);
        }

        for (let i = 0; i < spielstand.black.length; i++) {
            if (!emphaziseWhite && emphaziseSpielsteine.indexOf(spielstand.black[i]) !== -1 && spielstand.black.lastIndexOf(spielstand.black[i]) === i) {
                drawSpielstein(spielstand.black[i], emphasizeSpielstein, "#333", emphasizeSpielsteinInner, false);
            } else {
                drawSpielstein(spielstand.black[i], '#000', "#aaa", "#333", false);
            }
        }
        for (let i = 0; i < spielstand.white.length; i++) {
            if (emphaziseWhite && emphaziseSpielsteine.indexOf(spielstand.white[i]) !== -1 && spielstand.white.lastIndexOf(spielstand.white[i]) === i) {
                drawSpielstein(spielstand.white[i], emphasizeSpielstein, "#333", emphasizeSpielsteinInner, true);
            } else {
                drawSpielstein(spielstand.white[i], "#fff", "#333", "#bbb", true);
            }
        }
    }
}

export function getPosToPoint(p: Point): number | undefined {
    const collisionRects: Rect[] = [];
    for (let i = 0; i < 24; i++) {
        const dx = (i % 6) * punkteBreite + (1 / 2 + i % 6) * punkteMargin;
        if (i < 6) {
            collisionRects.push({
                x: width - (paddingRight + dx + punkteBreite + punkteMargin),
                y: height - (padding + punkteHeight + punkteVerticalMargin / 2),
                width: punkteBreite + punkteMargin,
                height: punkteVerticalMargin / 2 + punkteHeight
            })
        } else if (i < 12) {
            collisionRects.push({
                x: padding + spielHälfteWidth - (dx + punkteBreite + punkteMargin),
                y: height - (padding + punkteHeight + punkteVerticalMargin / 2),
                width: punkteBreite + punkteMargin,
                height: punkteVerticalMargin / 2 + punkteHeight
            })
        } else if (i < 18) {
            collisionRects.push({
                x: padding + dx,
                y: padding,
                width: punkteBreite + punkteMargin,
                height: punkteVerticalMargin / 2 + punkteHeight
            })
        } else {
            collisionRects.push({
                x: bar + spielHälfteWidth + padding + dx,
                y: padding,
                width: punkteBreite + punkteMargin,
                height: punkteVerticalMargin / 2 + punkteHeight
            })
        }
    }
    collisionRects.push({
        x: padding + 2 * spielHälfteWidth + bar,
        y: 0,
        width: paddingRight,
        height: height
    }) // -1
    collisionRects.push({
        x: padding + spielHälfteWidth,
        y: 0,
        width: bar,
        height: height
    }) // -2

    // search for the collision rect
    for (let i = 0; i < collisionRects.length; i++) {
        if (isIn(p, collisionRects[i])) {
            return i >= 24 ? 23 - i : i;
        }
    }
    return undefined;
}

export function getPossibleMoves(spielstand: Spielstand, white: boolean, dice: number[], allowMultipleDices: boolean): Move[] {
    // get all possible moves for one player
    const res: Move[] = [];
    for (let i = -2; i < 24; i++) {
        if (i !== -1) {
            res.push(...getPossibleMovesFromPos(i, spielstand, white, dice, allowMultipleDices));
        }
    }
    return res;
}

export function allInHomeQuarter(myArray: number[], white: boolean): boolean {
    for (let i of myArray) {
        if (i !== -1 && (white && i >= 6 || !white && i < 18 || i === -2)) {
            return false;
        }
    }
    return true;
}

export function getDistanceBetweenPos(from: number, to: number, white: boolean): number {
    if (white) {
        return from - to;
    } else {
        return to - from;
    }
}

function combinationsDiceNoOrder(dice: number[]): number[][] {
    if (dice.length === 0) {
        return [[]];
    }
    const c = []; // take everything but the first
    for (let i = 1; i < dice.length; i++) {
        c.push(dice[i]);
    }
    const r = combinationsDiceNoOrder(c); // get all combinations for the last ones
    return r.map(i => [dice[0], ...i]).concat(r);
}

function combinationsDiceWithOrder(dice: number[]): number[][] {
    const cdno = combinationsDiceNoOrder(dice);
    const res: number[][] = [];
    for (let i of cdno) {
        res.push(...getAllOrdersForOneDice(i));
    }
    return res;
}

function getAllOrdersForOneDice(dice: number[]): number[][] {
    if (dice.length <= 1) {
        return [dice];
    }

    const res: number[][] = [];
    for (let i = 0; i < dice.length; i++) {
        // build partial array
        const arr = [];
        for (let j = 0; j < dice.length; j++) {
            if (j !== i) {
                arr.push(dice[j]);
            }
        }

        // get all the combinations with dice[i] in the beginning
        const aofod = getAllOrdersForOneDice(arr);
        res.push(...aofod.map(a => [dice[i], ...a]));
    }
    return res;
}

function isPossibleCombination(dice: number[], from: number, white: boolean, spielstand: Spielstand): boolean {
    const permutations = getAllOrdersForOneDice(dice);
    const oppArr = white ? spielstand.black : spielstand.white;

    for (let i = 0; i < permutations.length; i++) {
        const p = permutations[i];
        let pos = from === -2 ? white ? 24 : -1 : from; // Behandele Spezialfall
        let possible = true;
        
        for (let j = 0; j < p.length; j++) {
            pos += white ? -p[j] : p[j];
            if (pos >= 0 && pos < 24 && (oppArr.indexOf(pos) !== -1 && (j !== p.length - 1 || oppArr.filter(i => i === pos).length > 1))) {
                // Dann liegt irgendwo ein Stein des Gegners
                // Wenn auf dem Zielpunkt mehr als 1 Stein des Gegners ist, dann ist der Zug nicht möglich
                // Wenn auf dem Zielpunkt nur 1 Stein des Gegners ist, dann würde der Stein geschlagen. Das soll der Spieler jedoch persönlich machen, es sei denn es ist am Ende.
                possible = false;
                break;
            }
        }

        if (possible) {
            return true;
        }
    }
    return false;
}

export function isPossibleMove(from: number, to: number, spielstand: Spielstand, white: boolean, dice: number[], allowMultipleDices: boolean): number[] | undefined {
    // check, whether a move is possible for a player
    const myArray = white ? spielstand.white : spielstand.black;
    const oppArray = !white ? spielstand.white : spielstand.black;
    
    if (from === -1 || to === -2 || myArray.indexOf(from) === -1 || dice.length === 0 || (from !== -2 && myArray.indexOf(-2) !== -1)) {
        // Wenn der Spielstein schon draußen ist, bzw. auf die Bar gelegt werden soll, bzw. kein Spielstein zur Verfügung steht, bzw. kein Wurf mehr verfügbar ist, bzw. noch ein Spielstein auf der Bar liegt
        return undefined;
    } else if (to === -1 && from !== -1) {
        // Wenn der Spielstein herausgestellt werden soll
        
        // Prüfe, ob schon alle im letzten Viertel stehen
        if (allInHomeQuarter(myArray, white)) {
            const dist = white ? from + 1 : 24 - from;

            if (allowMultipleDices && false) { // DO NOT ALLOW MULTIPLE DICES FOR THIS MOVE
                // nur die Möglichkeiten sind relevant, bei denen tatsächlich auch ins Ende gespielt werden kann, sowie die überhaupt funktionieren
                const possibleCombinationsOfDices = combinationsDiceNoOrder(dice).filter(i => i.reduce((a, b) => a + b, 0) >= dist && isPossibleCombination(i, from, white, spielstand));
                if (possibleCombinationsOfDices.length === 0) {
                    return undefined;
                }
    
                // berechne nun das Minimum an Schritten, das gegangen werden muss:
                let minSteps = Number.MAX_VALUE;
                for (let i of possibleCombinationsOfDices) {
                    const isum = i.reduce((a, b) => a + b, 0);
                    if (isum < minSteps) {
                        minSteps = isum;
                    }
                }
    
                // filter nun alle Möglichkeiten heraus, bei denen genau das Minimum an Schritten gegangen wird
                const minimumStepsCombinations = possibleCombinationsOfDices.filter(i => i.reduce((a, b) => a + b, 0) === minSteps);
    
                // finde das, das am wenigsten Würfel verwendet:
                let minI = 0;
                for (let i = 1; i < minimumStepsCombinations.length; i++) {
                    if (minimumStepsCombinations[i].length < minimumStepsCombinations[minI].length) {
                        minI = i;
                    }
                }

                // Berechne die komplementären Würfel
                const res = [...dice];
                for (let i = 0; i < minimumStepsCombinations[minI].length; i++) {
                    const indexOfDice = res.indexOf(minimumStepsCombinations[minI][i]);
                    if (indexOfDice !== -1) {
                        res.splice(indexOfDice, 1);
                    } else {
                        return undefined; // Das sollte nicht passieren, aber falls doch, dann ist es ein Fehler
                    }
                }
                return res;
            } else {
                // Zuerst suchen nach einem Würfel, der genau die Distanz hat
                const indexOfExaktDice = dice.indexOf(dist);
                let indexOfDice: number;
                if (indexOfExaktDice !== -1) {
                    indexOfDice = indexOfExaktDice;
                } else {
                    // Der Würfel ist nicht vorhanden, also suchen nach dem nächstgrößeren.
                    // Das ist jedoch nur erlaubt, wenn der Stein der hinterste ist
                    const spielsteineDavor = myArray.filter(i => i !== -1 && i !== -2 && (white ? i > from : i < from));
                    if (spielsteineDavor.length > 0) {
                        // Dann ist der Stein nicht der hinterste, also ist das nicht erlaubt
                        return undefined;
                    }

                    // Nun suchen nach einem Würfel, der größer ist als die Distanz
                    const possibleDices = dice.filter(i => i > dist);
                    if (possibleDices.length === 0) {
                        return undefined;
                    }
                    
                    // finde das geringste aus den möglichen Würfeln
                    let minI = 0;
                    for (let i = 1; i < possibleDices.length; i++) {
                        if (possibleDices[i] < possibleDices[minI]) {
                            minI = i;
                        }
                    }

                    indexOfDice = minI;
                }

                // wähle dann nur den einen Würfel heraus
                const res: number[] = [];
                for (let i = 0; i < dice.length; i++) {
                    if (i !== indexOfDice) {
                        res.push(dice[i]);
                    }
                }
                return res;
            }
        } else {
            return undefined;
        }
    }

    const start = from === -2 ? white ? 24 : -1 : from;
    const dist = getDistanceBetweenPos(start, to, white);
    if (dist <= 0) {
        // Wenn nicht vorwärts gegangen wird
        return undefined;
    }

    // Nun wird tatsächlich vorwärts gegangen und zwar nicht in das Ende
    const oppCountOnTarget = oppArray.filter(i => i === to).length;
    if (oppCountOnTarget > 1) {
        // Auf dem gegnerischen Feld stehen zu viele Spielsteine
        return undefined;
    }

    if (allowMultipleDices) {
        // nur die Möglichkeiten sind relevant, bei denen tatsächlich auch bis zum Ziel gespielt werden kann, sowie die überhaupt funktionieren (weil keine gegnerische Steine im Weg liegen)
        const possibleCombinationsOfDices = combinationsDiceNoOrder(dice).filter(i => i.reduce((a, b) => a + b, 0) === dist && isPossibleCombination(i, from, white, spielstand));
        if (possibleCombinationsOfDices.length === 0) {
            return undefined;
        }
        
        // finde das, das am wenigsten Würfel verwendet:
        let minI = 0;
        for (let i = 1; i < possibleCombinationsOfDices.length; i++) {
            if (possibleCombinationsOfDices[i].length < possibleCombinationsOfDices[minI].length) {
                minI = i;
            }
        }
        

        // Berechne die komplementären Würfel
        const res = [...dice];
        for (let i = 0; i < possibleCombinationsOfDices[minI].length; i++) {
            const indexOfDice = res.indexOf(possibleCombinationsOfDices[minI][i]);
            if (indexOfDice !== -1) {
                res.splice(indexOfDice, 1);
            } else {
                return undefined; // Das sollte nicht passieren, aber falls doch, dann ist es ein Fehler
            }
        }
        return res;
    } else {
        const indexOfDice = dice.indexOf(dist);
        if (indexOfDice === -1) {
            // Der Würfel ist nicht vorhanden
            return undefined;
        }

        // Der Würfel ist vorhanden, also den Würfel entfernen
        const res: number[] = [];
        for (let i = 0; i < dice.length; i++) {
            if (i !== indexOfDice) {
                res.push(dice[i]);
            }
        }
        return res;
    }
}

export function getPossibleMovesFromPos(from: number, spielstand: Spielstand, white: boolean, dice: number[], allowMultipleDices: boolean): Move[] {
    // get all possible moves for one player from a position
    const res: Move[] = [];
    for (let i = -1; i < 24; i++) {
        const a = isPossibleMove(from, i, spielstand, white, dice, allowMultipleDices);
        if (a !== undefined) {
            res.push([from, i, a]);
        }
    }
    return res;
}

export function rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
}

export function spielerHatGewonnen(arr: number[]): boolean {
    return arr.filter(i => i !== -1).length === 0;
}