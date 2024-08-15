import { OrderDTO } from '../dto/order.dto';
import { Order } from '../entities/order.entity';

export class OrderMapper {
  static toDTO(order: Order): OrderDTO {
    const orderDTO = new OrderDTO();
    orderDTO.id = order.id;
    orderDTO.userId = order.user.id;
    orderDTO.orderItems = order.items;
    orderDTO.createdAt = order.createdAt;
    orderDTO.orderStatus = order.status;
    return orderDTO;
  }
}
