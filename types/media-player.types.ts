export type PlayerSrc = MediaSrc | MediaSrc[];

export type MediaSrc =
  | string
  | AudioSrc
  | VideoSrc
  | HLSSrc
  | DASHSrc
  | YouTubeSrc
  | VimeoSrc;

export interface AudioSrc {
  type: 'audio';
  src: string;
}

export interface VideoSrc {
  type: 'video';
  src: string;
  poster?: string;
}

export interface HLSSrc {
  type: 'hls';
  src: string;
}

export interface DASHSrc {
  type: 'dash';
  src: string;
}

export interface YouTubeSrc {
  type: 'youtube';
  src: string;
}

export interface VimeoSrc {
  type: 'vimeo';
  src: string;
}
