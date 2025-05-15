import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameService } from '../game.service';
import Game from '../global/game/game';
import { SnackbarService } from '../global/snackbar/snackbar.service';
import User from '../global/game/user';
import Bot from '../global/game/bot';
import Person from '../global/game/person';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  public spieler1: string = "Player 1";
  public spieler2: string = "Player 2";

  public spieler1Typ: Spielertypen = "Spieler";
  public spieler2Typ: Spielertypen = "Bot";

  public startGame(): void {
    this.gameService.game = new Game(this.getSpieler(this.spieler1Typ, this.spieler1), this.getSpieler(this.spieler2Typ, this.spieler2), this.snackbarService, () => {
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    });
    
    this.router.navigate(['game']);
  }

  private getSpieler(typ: Spielertypen, name: string): User {
    if (typ === "Bot") {
      return new Bot(name, this.snackbarService);
    } else {
      return new Person(name, this.snackbarService);
    }
  }

  constructor(private readonly gameService: GameService, private readonly snackbarService: SnackbarService, private readonly router: Router) { }

  public spielerTypen: Spielertypen[] = ["Bot", "Spieler"];
}

type Spielertypen = "Bot" | "Spieler";