export interface IResponseApiInterface<T> {
  success: boolean;
  message: string;
  data: T;
}
