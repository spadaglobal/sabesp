import { container } from 'tsyringe';

import NestJSPaginationProvider from './implementations/NestJSPaginationProvider';
import IPaginationProvider from './models/IPaginationProvider';

const providers = {
  nextJSPagination: NestJSPaginationProvider,
};

container.registerSingleton<IPaginationProvider>(
  'PaginationProvider',
  providers.nextJSPagination,
);
