export default interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
  enabled?: boolean;
  role?: string;
}
