import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements AfterViewInit {
  
  @ViewChild("canvas") canvas!: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => {
      this.gameService.game?.startGame(this.canvas.nativeElement);
    }, 0);
  }

  constructor(public readonly gameService: GameService) { }
}
