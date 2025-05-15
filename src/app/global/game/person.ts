import { Point } from "../interfaces/point";
import { SnackbarService } from "../snackbar/snackbar.service";
import { drawSpielstand, getPossibleMovesFromPos, getPosToPoint } from "./gameUtils";
import User from "./user";

export default class Person extends User {
    constructor(name: string, snackbar: SnackbarService) {
        super(name, snackbar);
    }

    private selectedPos?: number;

    public override click(p: Point): void {
        if (this.activeSpielstand !== undefined && this.activeDann !== undefined && this.canvas !== undefined) {
            const clickedPos = getPosToPoint(p);

            if (clickedPos === undefined) {
                // Dann hat jemand daneben geklickt
                this.selectedPos = undefined;
                drawSpielstand(this.canvas!, this.activeSpielstand);
                return;
            } else {
                if (this.selectedPos !== undefined) {
                    const possibleMoves = getPossibleMovesFromPos(this.selectedPos, this.activeSpielstand, this.white, this.currentDice, true);
                    for (let i = 0; i < possibleMoves.length; i++) {
                        if (possibleMoves[i][1] === clickedPos) {
                            // Wenn der Zug möglich ist, dann wird er ausgeführt
                            this.moveSpielstein(this.selectedPos, clickedPos, possibleMoves[i][2]);

                            // Zurücksetzen
                            this.selectedPos = undefined;
                            
                            return; // Dann sind wir fertig
                        }
                    }

                }

                // Wenn noch kein Stein zuvor ausgewählt wurde bzw. kein Zug möglich ist, dann wird der Stein ausgewählt
                this.selectedPos = clickedPos;
                const possibleMoves = getPossibleMovesFromPos(clickedPos, this.activeSpielstand, this.white, this.currentDice, true);
                
                if (possibleMoves.length === 0) {
                    // Wenn von der neuen Position keine Züge möglich sind, dann wird die Auswahl zurückgesetzt
                    this.selectedPos = undefined;
                    drawSpielstand(this.canvas, this.activeSpielstand);
                } else {
                    drawSpielstand(this.canvas, this.activeSpielstand, possibleMoves.map(i => i[1]), [this.selectedPos], this.white);
                } 
            }
        }
    }

}