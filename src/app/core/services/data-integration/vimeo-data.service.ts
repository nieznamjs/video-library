import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VimeoDataService {

  // public getVideoByIds(idsArray: string[]): Observable<VimeoResponse> {
  //   const ids = idsArray.map((id: string) => {
  //     return `/videos/${id}`;
  //   }).join(',');
  //
  //   return this.http.get<VimeoResponse>(`${environment.VIMEO_API_URL}?uris=${ids}`, { headers: this.VIMEO_HTTP_HEADERS });
  // }
}
