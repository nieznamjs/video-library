import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { SuccessSnackbarComponent } from '../../../shared/components/snackbars/success-snackbar/success-snackbar.component';
import { ErrorSnackbarComponent } from '../../../shared/components/snackbars/error-snackbar/error-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) { }

  public openSuccessSnackbar(message: string): void {
    this.snackbar.openFromComponent(SuccessSnackbarComponent, {
      data: message,
    });
  }

  public openErrorSnackbar(message: string): void {
    this.snackbar.openFromComponent(ErrorSnackbarComponent, {
      data: message,
    });
  }
}
