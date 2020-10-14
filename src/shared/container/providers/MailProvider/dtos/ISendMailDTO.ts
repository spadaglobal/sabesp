import IParseMailTemplateDTO from '../../MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContact {
  name: string;
  email: string;
}

export default interface ISentMailDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateLayout: IParseMailTemplateDTO;
}
