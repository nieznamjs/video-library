import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { VIEW_LIST, VIEW_TILES } from '../../config/view-mode.config';

@Injectable({
  providedIn: 'root'
})
export class ViewModeService {

  public viewMode$ = new BehaviorSubject<string>(VIEW_LIST);
  public showOnlyFavourites$ = new BehaviorSubject<boolean>(false);

  public setModeToList(): void {
    this.viewMode$.next(VIEW_LIST);
  }

  public setModeToTiles(): void {
    this.viewMode$.next(VIEW_TILES);
  }

  public toggleFavourites(onlyFavourites: boolean): void {
    // TODO here
  }
}
