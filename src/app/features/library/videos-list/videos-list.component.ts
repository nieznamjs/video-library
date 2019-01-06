import { Component, OnInit } from '@angular/core';

import { VideosService } from '../../../core/services/data-integration/videos.service';
import { VideosStoreService } from '../../../core/services/data-integration/videos-store.service';

@Component({
  selector: 'app-videos-list',
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.scss']
})
export class VideosListComponent implements OnInit {

  private savedVideosData$ = this.videosStoreService.savedVideos$;
  public videosData$ = this.videosService.videos$;
  public isLoading$ = this.videosService.isLoading$;

  constructor(
    private videosService: VideosService,
    private videosStoreService: VideosStoreService,
  ) { }

  public ngOnInit(): void {
    this.savedVideosData$.subscribe(() => {
      this.videosService.getVideosData();
    });
  }
}
