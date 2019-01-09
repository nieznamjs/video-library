import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { VIEW_LIST, VIEW_TILES } from '../../../shared/constans/view-mode';

@Injectable({
  providedIn: 'root'
})
export class ViewModeService {

  public viewMode$ = new BehaviorSubject<string>(VIEW_LIST);

  public setModeToList(): void {
    this.viewMode$.next(VIEW_LIST);
  }

  public setModeToTiles(): void {
    this.viewMode$.next(VIEW_TILES);
  }
}
