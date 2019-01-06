import { Component, OnInit } from '@angular/core';

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

    this.viewModeService.showOnlyFavourites$
      .subscribe((onlyFavourites: boolean) => {
        if (onlyFavourites) {
          this.videosData = this.videosData.filter(video => video.isFavourite);
        } else {
          this.getAllVideosData();
        }
      });
  }

  private getAllVideosData(): void {
    this.videosService.videos$
      .subscribe((videos: ShownVideo[]) => {
        this.videosData = videos;
      });
  }
}
