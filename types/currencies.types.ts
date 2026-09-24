export interface INAB {
  idProduct: number;
  productCode: string;
  productName: string;
  idCategory: string;
  category: string;
  ytd: string;
  oneYear: string | null;
  sixMonth: string | null;
  threeMonth: string | null;
  oneMonth: string | null;
  oneWeek: string | null;
  nabUnit: string | null;
  lastUpdate: string;
}


export interface ICurrencies {
  fullName: string;
  flag: string;
  name: string;
  buy: number;
  sell: number;
  lastUpdate: string;
}

export interface PrimeLendingRate {
  Id: number;
  Name: string;
  Percentage: string;
}