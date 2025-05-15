import { Point } from "../interfaces/point";
import { PointerController } from "../pointerController";
import { SnackbarService } from "../snackbar/snackbar.service";
import { drawSpielstand, rollDice } from "./gameUtils";
import Spielstand, { getDefaultSpielstand } from "./spielstand";
import User from "./user";

export default class Game {
    private canvas?: HTMLCanvasElement;

    public constructor(private readonly user1: User, private readonly user2: User, private readonly snackbarService: SnackbarService, private readonly afterGame: (winner: User) => void, private readonly spielstand: Spielstand = getDefaultSpielstand()) { }

    public startGame(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        new PointerController(this.canvas, {
            pointerEnd: (p: Point) => {
                this.activeUser?.click(p);
            }
        }, false);
        this.user1.canvas = canvas;
        this.user1.white = true;
        this.user2.canvas = canvas;
        this.user2.white = false;

        this.doNextMove(this.user1, true);
    }

    public doNextMove(user: User, firstMove: boolean = false) {
        if (this.canvas === undefined) {
            throw new Error("Canvas is not defined");
        }

        drawSpielstand(this.canvas, this.spielstand);

        const d1 = rollDice();
        const d2 = rollDice();

        if (firstMove) {
            if (d1 > d2) {
                this.snackbarService.openSnackbar(`${this.user1.name} hat den ersten Zug mit ${d1} gegen ${d2} gewonnen!`);
                user = this.user1;
            } else if (d1 === d2) {
                this.doNextMove(user, true); // No one wins, so we roll again
                return;
            } else {
                this.snackbarService.openSnackbar(`${this.user2.name} hat den ersten Zug mit ${d2} gegen ${d1} gewonnen!`);
                user = this.user2;
            }
        }

        this.activeUser = user;

        user.move(d1, d2, d1 === d2 ? [d1, d1, d1, d1] : [d1, d2], this.spielstand, () => {
            this.doNextMove(user === this.user1 ? this.user2 : this.user1);
        }, (u: User) => {
            this.snackbarService.openSnackbar(`${u.name} hat das Spiel gewonnen!`);
            this.afterGame(u);
        })

    }

    public activeUser?: User;

}