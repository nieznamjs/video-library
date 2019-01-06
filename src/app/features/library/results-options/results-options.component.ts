import { Component, Inject } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';

import { ViewModeService } from '../../../core/services/utils/view-mode.service';
import { SORT_ASCENDING, SORT_DESCENDING } from '../../../shared/constans/sort-values';
import { VideosService } from '../../../core/services/data-integration/videos.service';

@Component({
  selector: 'app-results-options',
  templateUrl: './results-options.component.html',
  styleUrls: ['./results-options.component.scss'],
  providers: [
    { provide: SORT_ASCENDING, useValue: SORT_ASCENDING },
    { provide: SORT_DESCENDING, useValue: SORT_DESCENDING },
  ],
})
export class ResultsOptionsComponent {

  public onlyFavourites: boolean;
  public sortType: string = this.sortDescending;

  constructor(
    private viewModeService: ViewModeService,
    private videosService: VideosService,
    @Inject(SORT_ASCENDING) public sortAscending,
    @Inject(SORT_DESCENDING) public sortDescending,
  ) {}

  public changeSorting(): void {
    this.videosService.sortType = this.sortType;
    this.videosService.getVideosData();
  }

  public changeViewToList(): void {
    this.viewModeService.setModeToList();
  }

  public changeViewToTiles(): void {
    this.viewModeService.setModeToTiles();
  }

  public toggleFavourites(event: MatSlideToggleChange): void {
    this.videosService.showOnlyFavourites = event.checked;
    this.videosService.getVideosData();
  }
}
