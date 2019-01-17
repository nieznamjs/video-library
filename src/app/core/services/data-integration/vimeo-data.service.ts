import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { VimeoResponse } from '../../../shared/interfaces/vimeo/vimeo-response.interface';
import { environment } from '../../../../environments/environment';
import { VIMEO_API_KEY } from '../../../../secrets';
import { VideoNotSaved } from '../../../shared/interfaces/video-not-saved.interface';
import { VimeoVideo } from '../../../shared/interfaces/vimeo/vimeo-video.interface';
import { VIMEO_VIDEO_TYPE } from '../../../shared/constans/videos-types';
import { HelperService } from '../utils/helper.service';
import { SnackbarService } from '../utils/snackbar.service';
import { INTERNAL_SERVER_ERROR } from '../../../shared/constans/snackbar-messages';

@Injectable({
  providedIn: 'root'
})
export class VimeoDataService {

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private snackbarService: SnackbarService,
  ) {}

  private readonly VIMEO_HTTP_HEADERS = new HttpHeaders({
    'Authorization': `Bearer ${VIMEO_API_KEY}`,
  });

  public getVideoByIds(idsArray: string[]): Observable<VideoNotSaved[]> {
    const ids = idsArray.map((id: string) => `/videos/${id}`).join(',');

    return this.http.get<VimeoResponse>(`${environment.VIMEO_API_URL}?uris=${ids}`, { headers: this.VIMEO_HTTP_HEADERS })
      .pipe(
        map((response: VimeoResponse) => {
          return response.data.map((vimeoVideo: VimeoVideo) => ({
              id: this.helperService.extractId(vimeoVideo.link),
              title: vimeoVideo.name,
              likes: vimeoVideo.metadata.connections.likes.total.toString(),
              thumbnailUrl: vimeoVideo.pictures.sizes[2].link,
              type: VIMEO_VIDEO_TYPE,
            })
          );
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.statusText === 'Bad Request') {
            return of([]);
          } else {
            this.snackbarService.openErrorSnackbar(INTERNAL_SERVER_ERROR);
            return throwError(err);
          }
        }),
      );
  }
}
