import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { YtVideosResponse } from '../../../shared/interfaces/youtube/yt-videos-response.interface';
import { YT_API_KEY } from '../../../../secrets';

@Injectable({
  providedIn: 'root'
})
export class YtDataService {

  constructor (private http: HttpClient) {}

  public getVideoByIds(idsArray: string[]): Observable<YtVideosResponse> {
    const ids = idsArray.join(',');

    return this.http.get<YtVideosResponse>(`${environment.YT_API_URL}videos?part=snippet,statistics&id=${ids}&key=${YT_API_KEY}`);
  }
}
