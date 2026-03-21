/* ORDERS CONTROLLER
   The entry point for HTTP requests related to repair orders.
*/
import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UseGuards,
  Patch,
  Param,
  Get,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateOrderUseCase } from '../../application/create-order.use-case';
import { CreateOrderDto } from './dto/create-order.dto';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusUseCase } from '../../application/update-order-status.use-case';
import { FindAllOrdersUseCase } from '../../application/find-all-orders.use-case';
import { FindOrdersByTechnicianUseCase } from '../../application/find-orders-by-technician.use-case';
import { GetOrderHistoryUseCase } from '../../application/get-order-history.use-case';
import { CancelOrderUseCase } from 'src/modules/orders/application/cancel-order.use-case';
import { FindInventoryItemsByOrderIdUseCase } from '../../application/find-inventory-item-by-order-id.use-case';
import { CreateOrderPartDto } from './dto/create-order-part.dto';
import { AddPartToOrderUseCase } from '../../application/add-part-to-order.use-case';
import { FindOrdersByClientDniUseCase } from '../../application/find-orders-by-client-dni.use-case';
import { FindOrdersBySerialNumberUseCase } from '../../application/find-orders-by-client-serial-number.use-case';
import { FindOrdersByStatusUseCase } from '../../application/find-orders-by-client-status.use-case';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly findAllOrdersUseCase: FindAllOrdersUseCase, // <--- 4. Inyectar el caso de uso
    private readonly findOrdersByTechnicianUseCase: FindOrdersByTechnicianUseCase, // <--- 4. Añadir el caso de uso
    private readonly getOrderHistoryUseCase: GetOrderHistoryUseCase, // <--- 4. Añadir el caso de uso
    private readonly cancelOrderUseCase: CancelOrderUseCase, // <--- 4. Añadir el caso de uso
    private readonly findInventoryItemsByOrderIdUseCase: FindInventoryItemsByOrderIdUseCase, // <--- 4. Añadir el caso de uso
    private readonly addPartToOrderUseCase: AddPartToOrderUseCase, // <--- 4. Añadir el caso de uso
    private readonly findOrdersByClientDniUseCase: FindOrdersByClientDniUseCase, // <--- 4. Añadir el caso de uso
    private readonly findOrdersBySerialNumberUseCase: FindOrdersBySerialNumberUseCase, // <--- 4. Añadir el caso de uso
    private readonly findOrdersByStatusUseCase: FindOrdersByStatusUseCase, // <--- 4. Añadir el caso de uso
  ) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser('userId') technicianId: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.createOrderUseCase.execute({
        ...createOrderDto,
        technicianId,
      });

      return res.status(HttpStatus.CREATED).json({
        message: 'Order created successfully',
        data: result,
      });
    } catch (error) {
      // The error message here is already translated by the Use Case i18n
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateStatus(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.updateOrderStatusUseCase.execute(id, userId, updateOrderDto);
  }

  @Get() // <--- 2. Definir la ruta GET /orders
  async findAll() {
    return this.findAllOrdersUseCase.execute();
  }

  @Get('my-orders') // 2. Nueva ruta específica
  async findMyOrders(@GetUser('userId') technicianId: string) {
    // Fíjate: Sacamos el ID del TOKEN, no del body ni de la URL
    return this.findOrdersByTechnicianUseCase.execute(technicianId);
  }

  @Get(':id/history')
  async getHistory(@Param('id') id: string) {
    return this.getOrderHistoryUseCase.execute(id);
  }

  @Patch(':id/cancel')
  async cancelOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('userId') technicianId: string,
    @Body('notes') notes: string,
  ) {
    return await this.cancelOrderUseCase.execute(id, technicianId, notes);
  }

  @Get(':id/parts') // El :id es el orderId
  async getOrderParts(@Param('id', ParseUUIDPipe) id: string) {
    return await this.findInventoryItemsByOrderIdUseCase.execute(id);
  }

  @Get(':dni/dni')
  async getOrdersByDni(@Param('dni') dni: string) {
    return await this.findOrdersByClientDniUseCase.execute(dni);
  }

  @Get(':serialNumber/serial-number')
  async getOrderBySerialNumber(@Param('serialNumber') serialNumber: string) {
    return await this.findOrdersBySerialNumberUseCase.execute(serialNumber);
  }

  @Get(':status/orders')
  async getOrdersByStatus(@Param('status') status: string) {
    return await this.findOrdersByStatusUseCase.execute(status);
  }

  @Post(':id/parts')
  async addOrderPart(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createOrderPartDto: CreateOrderPartDto,
  ) {
    return await this.addPartToOrderUseCase.execute({
      orderId: id,
      partId: createOrderPartDto.partId,
      quantity: createOrderPartDto.quantity,
    });
  }
}
