export interface RequestEntry {
  url: string;
  method: string;
  statusCode: number;
  timeStamp: string;
  statusLine?: string;
  type?: string;
  fromCache?: boolean;
  initiator?: string;
  ip?: string;
}

export interface MockEntry {
  url: string;
  method: string;
  response: string;
  active: boolean;
}

export interface FiltersState {
  method: string;
  statusGroup: string;
  fromCache: string;
}
