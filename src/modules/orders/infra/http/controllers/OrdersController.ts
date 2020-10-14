import CreateOrderService from '@modules/orders/services/CreateOrderService';
import DeleteOrderService from '@modules/orders/services/DeleteOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';
import ListOrderService from '@modules/orders/services/ListOrderService';
import UpdateOrderService from '@modules/orders/services/UpdateOrderService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class OrdersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10 } = request.query;

    const listOrders = container.resolve(ListOrderService);

    const orders = await listOrders.execute({
      options: {
        page: page as number,
        limit: limit as number,
        route: `${process.env.APP_API_URL}/orders`,
      },
      entity: 'Order',
    });

    return response.json(orders);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { description } = request.body;

    const createOrder = container.resolve(CreateOrderService);

    const order = await createOrder.execute({
      description,
    });

    return response.json(order);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: order_id } = request.params;
    const { description } = request.body;

    const updateOrder = container.resolve(UpdateOrderService);

    const order = await updateOrder.execute({
      order_id,
      description,
    });

    return response.json(order);
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id: order_id } = request.params;

    const findOrder = container.resolve(FindOrderService);

    const order = await findOrder.execute({
      order_id,
    });

    return response.json(order);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id: order_id } = request.params;

    const deleteOrder = container.resolve(DeleteOrderService);

    await deleteOrder.execute({
      order_id,
    });

    return response.status(204).json();
  }
}
