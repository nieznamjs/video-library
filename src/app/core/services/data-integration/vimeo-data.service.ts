import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { VimeoResponse } from '../../../shared/interfaces/vimeo/vimeo-response.interface';
import { environment } from '../../../../environments/environment';
import { VIMEO_API_KEY } from '../../../../secrets';
import { catchError, map } from 'rxjs/operators';
import { VideoNotSaved } from '../../../shared/interfaces/video-not-saved.interface';
import { VimeoVideo } from '../../../shared/interfaces/vimeo/vimeo-video.interface';
import { VIMEO_VIDEO_TYPE } from '../../../shared/constans/videos-types';
import { HelperService } from '../utils/helper.service';

@Injectable({
  providedIn: 'root'
})
export class VimeoDataService {

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
  ) {}

  private readonly VIMEO_HTTP_HEADERS = new HttpHeaders({
    'Authorization': `Bearer ${VIMEO_API_KEY}`,
  });

  public getVideoByIds(idsArray: string[]): Observable<VideoNotSaved[]> {
    const ids = idsArray.map((id: string) => `/videos/${id}`).join(',');

    return this.http.get<VimeoResponse>(`${environment.VIMEO_API_URL}?uris=${ids}`, { headers: this.VIMEO_HTTP_HEADERS })
      .pipe(
        map((response: VimeoResponse) => {
          return response.data.map((vimeoVideo: VimeoVideo) => {
            return {
              id: this.helperService.extractId(vimeoVideo.link),
              title: vimeoVideo.name,
              likes: vimeoVideo.metadata.connections.likes.total.toString(),
              thumbnailUrl: vimeoVideo.pictures.sizes[2].link,
              type: VIMEO_VIDEO_TYPE,
            };
          });
        }),
        catchError(() => {
          return of([]);
        }),
      );
  }
}
