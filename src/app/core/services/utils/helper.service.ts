import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  public extractId(data: string) {
    const vimeoRegex = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
    const ytRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;

    const ytId = data.match(ytRegex);
    const vimeoId = data.match(vimeoRegex);

    if (ytId) {
      return ytId[7];
    } else if (vimeoId) {
      return vimeoId[5];
    } else {
      return data;
    }
  }
}
