export interface VimeoVideo {
  created_time: Date;
  link: string;
  name: string;
  pictures: {
    sizes: {
      link: string;
      height: number;
      width: number;
    }[];
  };
  metadata: {
    connections: {
      likes: {
        total: number;
      };
    };
  };
}
