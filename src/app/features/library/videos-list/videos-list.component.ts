import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';

import { VideosService } from '../../../core/services/data-integration/videos.service';
import { VideosStoreService } from '../../../core/services/data-integration/videos-store.service';
import { ShownVideo } from '../../../shared/interfaces/shown-video.interface';
import { ViewModeService } from '../../../core/services/utils/view-mode.service';

@Component({
  selector: 'app-videos-list',
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.scss']
})
export class VideosListComponent implements OnInit {

  private savedVideosData$ = this.videosStoreService.savedVideos$;
  public videosData: ShownVideo[];
  public isLoading$ = this.videosService.isLoading$;
  public viewMode$ = this.viewModeService.viewMode$;
  public paginatorLength: number;
  public pageIndex = 0;
  public pageSize = 5;
  public lowValue = 0;
  public highValue = 5;
  public readonly PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private videosService: VideosService,
    private videosStoreService: VideosStoreService,
    private viewModeService: ViewModeService,
  ) { }

  public ngOnInit(): void {
    this.savedVideosData$.subscribe(() => {
      this.videosService.getVideosData();
    });

    this.getAllVideosData();
  }

  public sliceVideosList(event): void {
    if (event.pageIndex === this.pageIndex + 1) {
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue = this.highValue + this.pageSize;
    } else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue = this.highValue - this.pageSize;
    } else {
      this.pageSize = this.highValue = event.pageSize;
      this.lowValue = 0;
    }
    this.pageIndex = event.pageIndex;
  }

  private getAllVideosData(): void {
    this.videosService.videos$
      .subscribe((videos: ShownVideo[]) => {
        this.videosData = videos;
        this.paginatorLength = videos.length;
      });
  }

  public clearAllVideos(): void {
    this.videosStoreService.clearLibrary();
  }
}
