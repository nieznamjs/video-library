import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { YtVideosResponse } from '../../../shared/interfaces/youtube/yt-videos-response.interface';
import { YT_API_KEY } from '../../../../secrets';
import { YtVideo } from '../../../shared/interfaces/youtube/yt-video.interface';
import { YT_VIDEO_TYPE } from '../../config/videos-type.config';
import { VideoNotSaved } from '../../../shared/interfaces/video-not-saved.interface';

@Injectable({
  providedIn: 'root'
})
export class YtDataService {

  constructor (private http: HttpClient) {}

  public getVideoByIds(idsArray: string[]): Observable<VideoNotSaved[]> {
    const ids = idsArray.join(',');

    return this.http.get<YtVideosResponse>(`${environment.YT_API_URL}videos?part=snippet,statistics&id=${ids}&key=${YT_API_KEY}`)
      .pipe(
        map((response: YtVideosResponse) => {
          return response.items.map((ytVideo: YtVideo) => {
            return {
              id: ytVideo.id,
              title: ytVideo.snippet.title,
              likes: ytVideo.statistics.likeCount,
              views: ytVideo.statistics.viewCount,
              thumbnailUrl: ytVideo.snippet.thumbnails.default.url,
              type: YT_VIDEO_TYPE,
            };
          });
        })
      );
  }
}
