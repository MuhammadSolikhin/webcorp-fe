enum Type {
  Fax = "Fax",
  Phone = "Phone",
}

interface Contact {
  Id: number;
  Type: Type;
  Value: string;
}

export interface Network {
  Id: number;
  Name: string;
  Address: string;
  Latitude: string;
  Longitude: string;
  Contacts: Contact[];
}

export interface Location {
  Id: number;
  Name: string;
  Networks: Network[];
}
