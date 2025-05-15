import {Injectable, ViewContainerRef} from '@angular/core';
import {SnackbarComponent} from "./snackbar/snackbar.component";
import { getColorAsRgbFunction } from '../interfaces/color';
import { ERROR_COLOR } from '../styles/colors';

export interface SnackbarConfig {
  color?: string,
  background?: string,
  duration?: number
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  public rootViewContainerRef?: ViewContainerRef;

  constructor() { }

  public openSnackbar(message: string, snackbarConfig?: SnackbarConfig): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.rootViewContainerRef) {
        reject();
        return;
      }

      const duration = snackbarConfig?.duration ?? 4000;
      const snackbar = this.rootViewContainerRef?.createComponent(SnackbarComponent);

      if (!snackbar) {
        reject();
        return;
      }

      snackbar.instance.message = message;
      snackbar.instance.snackbarConfig = snackbarConfig;

      setTimeout(() => {
        snackbar.destroy();
        resolve();
      }, duration);
    })
  }
  
  public openErrorSnackbar(errorMessage: string = 'Ein unerwarteter Fehler ist aufgetreten!', duration?: number): void {
    this.openSnackbar(errorMessage, {
      duration,
      color: 'white',
      background: getColorAsRgbFunction(ERROR_COLOR)
    })
  }
}
