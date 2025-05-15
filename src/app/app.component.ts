import { AfterViewInit, Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Game from './global/game/game';
import { SnackbarService } from './global/snackbar/snackbar.service';
import Bot from './global/game/bot';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  public game?: Game;

  constructor(private readonly snackbarService: SnackbarService, private readonly viewContainerRef: ViewContainerRef) {
    this.snackbarService.rootViewContainerRef = this.viewContainerRef;
  }
}
