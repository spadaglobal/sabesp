import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '@modules/orders/infra/typeorm/entities/Order';
import { uuid } from 'uuidv4';

import IOrdersRepository from '../IOrdersRepository';

class FakeOrdersRepository implements IOrdersRepository {
  private orders: Order[] = [];

  public async findById(id: string): Promise<Order | undefined> {
    const orderFound = this.orders.find(order => order.id === id);
    return orderFound;
  }

  public async create(orderData: ICreateOrderDTO): Promise<Order> {
    const order = new Order();
    Object.assign(order, { id: uuid() }, orderData);

    this.orders.push(order);

    return order;
  }

  public async remove(order_id: string): Promise<void> {
    const findIndexOrder = this.orders.findIndex(
      findOrder => findOrder.id === order_id,
    );

    this.orders.splice(findIndexOrder, 1);
  }

  public async save(order: Order): Promise<Order> {
    const findIndex = this.orders.findIndex(
      findOrder => findOrder.id === order.id,
    );
    this.orders[findIndex] = order;
    return order;
  }
}

export default FakeOrdersRepository;
