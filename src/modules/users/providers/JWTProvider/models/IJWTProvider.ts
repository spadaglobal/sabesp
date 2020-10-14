export default interface IJWTProvider {
  signToken(user_id: string): Promise<string>;
}
