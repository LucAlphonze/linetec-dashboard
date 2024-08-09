import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  constructor(private _spinnerService: NgxSpinnerService) {}

  public llamarSpinner(spinner: string) {
    this._spinnerService.show(spinner);
  }
  public detenerSpinner(spinner: string) {
    this._spinnerService.hide(spinner);
  }
}
