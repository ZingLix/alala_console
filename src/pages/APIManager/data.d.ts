export interface APIType {
  _id: string;
  url: string;
  name: string;
  disabled: boolean;
  eval: string;
  creator: string;
  headers: {
    header: string;
    content: string;
  }[];
  method: string;
  body: string;
}
