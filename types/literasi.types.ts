// literasi/types.ts

export interface Video {
    id: number;
    title: string;
    image: string;
    description: string;
    views: number;
    link: string;
    stars: number;
    longDescription: string;
  }
  
export interface Literasi {
    videos: Video[];
}
