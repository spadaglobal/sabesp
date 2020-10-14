import ISentMailDTO from '../dtos/ISendMailDTO';

export default interface IMailProvider {
  sendEmail(data: ISentMailDTO): Promise<void>;
}
