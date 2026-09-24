import type { AppRes } from "./utils.types";

interface Popup {
	Id: number;
  Title: string;
  Image: string;
  Video: string;
  VideoEmbed: string;
  Type: string;
}

export interface PopupRes extends AppRes<Popup> {}
