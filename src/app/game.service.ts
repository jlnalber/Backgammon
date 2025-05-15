import { Injectable } from '@angular/core';
import Game from './global/game/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  public game?: Game;
}
