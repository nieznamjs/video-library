import { Component, OnInit } from '@angular/core';

import { MatSlideToggleChange } from '@angular/material';
import { ViewModeService } from '../../../core/services/utils/view-mode.service';

@Component({
  selector: 'app-results-options',
  templateUrl: './results-options.component.html',
  styleUrls: ['./results-options.component.scss'],
})
export class ResultsOptionsComponent implements OnInit {

  public onlyFavourites: boolean;

  constructor(private viewModeService: ViewModeService) {}

  public ngOnInit(): void {
    this.viewModeService.showOnlyFavourites$
      .subscribe((value: boolean) => {
        this.onlyFavourites = value;
      });
    }

  public changeViewToList(): void {
    this.viewModeService.setModeToList();
  }

  public changeViewToTiles(): void {
    this.viewModeService.setModeToTiles();
  }

  public toggleFavourites(event: MatSlideToggleChange): void {
    this.viewModeService.toggleFavourites(event.checked);
  }
}
