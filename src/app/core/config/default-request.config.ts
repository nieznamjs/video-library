import { SavedVideoData } from '../../shared/interfaces/saved-video-data.interface';
import { VIMEO_VIDEO_TYPE, YT_VIDEO_TYPE } from './videos-type.config';

export const DEFAULT_VIDEOS_DATA: SavedVideoData[] = [
  {
    id: 'dQw4w9WgXcQ',
    isFavourite: false,
    type: YT_VIDEO_TYPE,
    addedToLibraryAt: new Date(),
    isDefault: true,
  }, {
    id: 'y6120QOlsfU',
    isFavourite: false,
    type: YT_VIDEO_TYPE,
    addedToLibraryAt: new Date(),
    isDefault: true,
  }, {
    id: '134663979',
    isFavourite: false,
    type: VIMEO_VIDEO_TYPE,
    addedToLibraryAt: new Date(),
    isDefault: true,
  },
];
