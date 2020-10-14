import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import IOrdersRepository from '../repositories/IOrdersRepository';

interface IRequest {
  options: {
    page: number;
    limit: number;
    route?: string;
  };
  entity: string;
}
@injectable()
class ListOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    options,
    entity,
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let orders = await this.cacheProvider.recover<IPaginationResponseDTO | []>(
      `orders-list:${options.page}`,
    );

    if (!orders) {
      orders = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          order: {
            created_at: 'DESC',
          },
        },
      });

      await this.cacheProvider.save(`orders-list:${options.page}`, orders);
    }

    return orders;
  }
}

export default ListOrderService;
