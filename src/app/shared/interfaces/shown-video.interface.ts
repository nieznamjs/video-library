export interface ShownVideo {
  id: string;
  type: string;
  title: string;
  likes: string;
  views?: string;
  thumbnailUrl: string;
  addedToLibraryAt: Date;
  isFavourite: boolean;
  isDefault: boolean;
}
