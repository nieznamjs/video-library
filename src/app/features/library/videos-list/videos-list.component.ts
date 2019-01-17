import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';

import { VideosService } from '../../../core/services/data-integration/videos.service';
import { ShownVideo } from '../../../shared/interfaces/shown-video.interface';
import { ViewModeService } from '../../../core/services/utils/view-mode.service';

@Component({
  selector: 'app-videos-list',
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.scss']
})
export class VideosListComponent implements OnInit {

  public videosData: ShownVideo[];
  public isLoading$ = this.videosService.isLoading$;
  public viewMode$ = this.viewModeService.viewMode$;
  public paginatorLength: number;
  public pageIndex = 0;
  public pageSize = 6;
  public readonly PAGE_SIZE_OPTIONS = [6, 12, 24, 48, 96];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private videosService: VideosService,
    private viewModeService: ViewModeService,
  ) { }

  public ngOnInit(): void {
    this.videosService.getAllVideos();

    this.videosService.videos$
      .subscribe((videos: ShownVideo[]) => {
        this.videosData = videos;
        this.paginatorLength = videos.length;
      });
  }

  public getPaginatorData(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  public clearAllVideos(): void {
    this.videosService.clearLibrary();
  }
}
