import { VimeoPictures } from './vimeo-pictures.interface';
import { VimeoMetadata } from './vimeo-metadata.interface';

export interface VimeoVideo {
  created_time: Date;
  link: string;
  name: string;
  pictures: VimeoPictures;
  metadata: VimeoMetadata;
}
