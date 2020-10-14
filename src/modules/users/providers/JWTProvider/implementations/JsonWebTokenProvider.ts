import authConfig from '@config/auth';
import { sign } from 'jsonwebtoken';

import IJWTProvider from '../models/IJWTProvider';

class JsonWebTokenProvider implements IJWTProvider {
  public async signToken(user_id: string): Promise<string> {
    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user_id,
      expiresIn,
    });

    return token;
  }
}

export default JsonWebTokenProvider;
