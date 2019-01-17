import { Injectable } from '@angular/core';

import { SnackbarService } from './snackbar.service';
import { LOCAL_STORAGE_ERROR } from '../../../shared/constans/snackbar-messages';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private snackbarService: SnackbarService) {}

  public get(key: string): any {
    try {
      const data = localStorage.getItem(key);

      return JSON.parse(data);
    } catch (err) {
      this.snackbarService.openErrorSnackbar(`${LOCAL_STORAGE_ERROR}: Error code: ${err.code}`);
    }
  }

  public set(key: string, data: any): void {
    try {
      const serializedData = JSON.stringify(data);

      localStorage.setItem(key, serializedData);
    } catch (err) {
      this.snackbarService.openErrorSnackbar(`${LOCAL_STORAGE_ERROR}: Error code: ${err.code}`);
    }
  }

  public clear(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      this.snackbarService.openErrorSnackbar(`${LOCAL_STORAGE_ERROR}: Error code: ${err.code}`);
    }
  }
}
