import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { VimeoResponse } from '../../../shared/interfaces/vimeo/vimeo-response.interface';
import { environment } from '../../../../environments/environment';
import { VIMEO_API_KEY } from '../../../../secrets';

@Injectable({
  providedIn: 'root'
})
export class VimeoDataService {

  constructor(private http: HttpClient) {}

  private readonly VIMEO_HTTP_HEADERS = new HttpHeaders({
    'Authorization': `Bearer ${VIMEO_API_KEY}`,
  });

  public getVideoByIds(idsArray: string[]): Observable<VimeoResponse> {
    const ids = idsArray.map((id: string) => {
      return `/videos/${id}`;
    }).join(',');

    return this.http.get<VimeoResponse>(`${environment.VIMEO_API_URL}?uris=${ids}`, { headers: this.VIMEO_HTTP_HEADERS });
  }
}
