export interface statisticalInterface {
  data: number;
  count: number;
}

export interface peak10Interface {
  _id: number;
  count: number;
}

export interface peakStationInterface {
  _id: string;
  count: number;
  station: {
    name: string;
    code: string;
  }[];
}
