import { container } from 'tsyringe';

import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';
import IHashProvider from './HashProvider/models/IHashProvider';
import JsonWebTokenProvider from './JWTProvider/implementations/JsonWebTokenProvider';
import IJWTProvider from './JWTProvider/models/IJWTProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);

container.registerSingleton<IJWTProvider>('JWTProvider', JsonWebTokenProvider);
