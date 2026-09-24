export interface Network {
  Id: number;
  Name: string;
  Address: string;
  Latitude: string;
  Longitude: string;
}

export interface Regions {
  Id: number;
  Name: string;
  Networks: Network[];
}
