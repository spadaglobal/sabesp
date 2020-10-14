import ISentMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

class FakeMailProvider implements IMailProvider {
  private messages: ISentMailDTO[] = [];

  public async sendEmail(message: ISentMailDTO): Promise<void> {
    this.messages.push(message);
  }
}

export default FakeMailProvider;
