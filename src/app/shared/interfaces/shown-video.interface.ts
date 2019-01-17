import { VideoNotSaved } from './video-not-saved.interface';

export interface ShownVideo extends VideoNotSaved {
  addedToLibraryAt: Date;
  isFavourite: boolean;
}
