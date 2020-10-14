import IPaginationProvider from '../models/IPaginationProvider';

class FakePaginationProvider implements IPaginationProvider {
  public async pagination(): Promise<[]> {
    return [];
  }
}

export default FakePaginationProvider;
