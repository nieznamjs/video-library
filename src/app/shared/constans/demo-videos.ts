import { SavedVideoData } from '../interfaces/saved-video-data.interface';
import { VIMEO_VIDEO_TYPE, YT_VIDEO_TYPE } from './videos-types';

export const DEFAULT_VIDEOS_DATA: SavedVideoData[] = [
  {
    id: 'XxlnWfX5x58',
    isFavourite: true,
    type: YT_VIDEO_TYPE,
    addedToLibraryAt: new Date('2004'),
  }, {
    id: 'G35gKTm8N_4',
    isFavourite: true,
    type: YT_VIDEO_TYPE,
    addedToLibraryAt: new Date(),
  }, {
    id: 'J8YA3kVroRQ',
    isFavourite: true,
    type: YT_VIDEO_TYPE,
    addedToLibraryAt: new Date(),
  }, {
    id: 'dQw4w9WgXcQ',
    isFavourite: false,
    type: YT_VIDEO_TYPE,
    addedToLibraryAt: new Date(),
  }, {
    id: 'RjeLhrBKcVM',
    isFavourite: true,
    type: YT_VIDEO_TYPE,
    addedToLibraryAt: new Date(),
  }, {
    id: 'y6120QOlsfU',
    isFavourite: false,
    type: YT_VIDEO_TYPE,
    addedToLibraryAt: new Date(),
  }, {
    id: '134663979',
    isFavourite: false,
    type: VIMEO_VIDEO_TYPE,
    addedToLibraryAt: new Date(),
  }, {
    id: '306420793',
    isFavourite: true,
    type: VIMEO_VIDEO_TYPE,
    addedToLibraryAt: new Date(),
  }, {
    id: '306710518',
    isFavourite: true,
    type: VIMEO_VIDEO_TYPE,
    addedToLibraryAt: new Date(),
  },
];
