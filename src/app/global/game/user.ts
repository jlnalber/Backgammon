import { Point } from "../interfaces/point";
import { SnackbarService } from "../snackbar/snackbar.service";
import { drawSpielstand, getPossibleMoves, spielerHatGewonnen } from "./gameUtils";
import Spielstand from "./spielstand";

export default abstract class User {

    constructor(public name: string, protected readonly snackbar: SnackbarService) { }

    public canvas: HTMLCanvasElement | undefined;

    public white: boolean = true;

    public click(p: Point): void {

    }
    
    public activeDice: number[] = [];
    public currentDice: number[] = [];
    public activeD1: number = -1;
    public activeD2: number | undefined = -1;
    protected activeSpielstand: Spielstand | undefined = undefined;
    protected activeDann?: () => void;
    protected activeFinish?: (user: User) => void;

    public move(d1: number, d2: number, dice: number[], spielstand: Spielstand, dann: () => void, finish: (user: User) => void): void {
        this.activeDann = dann;
        this.activeFinish = finish;
        this.activeSpielstand = spielstand;

        this.activeDice = dice.map(i => i);
        this.currentDice = dice.map(i => i);
        this.activeD1 = d1;
        this.activeD2 = d2;

        // check if the user can move
        this.checkPossibleMovesAndProceedIfNecessary(true);
    }

    protected hatGewonnen(): boolean {
        return this.activeSpielstand !== undefined && spielerHatGewonnen(this.white ? this.activeSpielstand.white : this.activeSpielstand.black);
    }

    protected moveSpielstein(from: number, to: number, newDices: number[], activateDann: boolean = true): void {
        if (this.activeSpielstand && this.canvas && this.activeDann && this.activeFinish) {
            // bewegen
            const arr = this.activeSpielstand[this.white ? "white" : "black"];
            const pos = arr.indexOf(from);
            if (pos !== -1) {
                // Bewege den Stein
                arr[pos] = to;
                
                const oppArr = this.activeSpielstand[this.white ? "black" : "white"];
                const oppPos = oppArr.indexOf(to);
                if (oppPos !== -1 && to !== -1) {
                    oppArr[oppPos] = -2; // remove the stone from the board
                }
            }

            // neu malen
            drawSpielstand(this.canvas, this.activeSpielstand);

            // Habe ich das Spiel gewonnen?
            if (this.hatGewonnen()) {
                this.activeFinish(this);
                return;
            }

            // Falls es automatisch weitergehen soll, muss hier eine Prüfung stattfinden, ob noch Züge möglich sind
            if (activateDann) {
                // Gibt es überhaupt noch Würfel?
                this.currentDice = newDices.map(i => i);
                if (this.currentDice.length === 0 && !this.hatGewonnen()) {
                    // Falls der Zug zu Ende ist
                    this.activeDann();
                    return;
                }

                // Gibt es noch Möglichkeiten zu ziehen?
                if (!this.checkPossibleMovesAndProceedIfNecessary(true)) {
                    return; // Falls der Zug zu Ende ist
                }
            }
        }
    }

    protected checkPossibleMovesAndProceedIfNecessary(showMessage: boolean): boolean {
        // Gibt es noch Möglichkeiten zu ziehen?
        if (!this.checkPossibleMoves() && this.activeDann !== undefined) {
            // Falls der Zug zu Ende ist
            if (showMessage) {
                this.snackbar.openErrorSnackbar("Es sind keine Züge mehr möglich! Der nächste Spieler ist dran.");
            }

            if (!this.hatGewonnen()) {
                this.activeDann(); // nur wenn der Spieler nicht gewonnen hat
            }
            return false;
        }

        return true;
    }

    protected checkPossibleMoves(): boolean {
        if (this.activeSpielstand === undefined || this.currentDice.length === 0) {
            return false; // keine Züge möglich
        }

        // Gibt es noch Möglichkeiten zu ziehen?
        return getPossibleMoves(this.activeSpielstand, this.white, this.currentDice, false).length !== 0;
    }
}