import { uuid } from 'uuidv4';

import IJWTProvider from '../models/IJWTProvider';

class FakeJWTProvider implements IJWTProvider {
  public async signToken(): Promise<string> {
    return uuid();
  }
}

export default FakeJWTProvider;
