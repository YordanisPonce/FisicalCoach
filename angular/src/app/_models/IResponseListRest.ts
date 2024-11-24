export interface IResponseListRest<T> {
  data: T[];
  message: string;
  success: boolean;
}
