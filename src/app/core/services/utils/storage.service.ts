import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public get(key: string) {
    const data = localStorage.getItem(key);

    return JSON.parse(data);
  }

  public set(key: string, data: any) {
    const serializedData = JSON.stringify(data);

    localStorage.setItem(key, serializedData);
  }
}
