import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { InventoryService } from '../../application/inventory.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // 1. Obtener todo el catálogo de repuestos
  @Get()
  async findAll() {
    return await this.inventoryService.findAll();
  }

  // 2. Nueva ruta específica para ítems con stock bajo
  @Get('low-stock') // <--- 2. Nueva ruta específica
  async findLowStockItems() {
    return await this.inventoryService.findLowStockItems();
  }

  // 3. Crear un nuevo ítem en el catálogo
  @Post()
  async create(@Body() createDto: CreateInventoryItemDto) {
    // Aquí llamarías al CreateInventoryItemUseCase a través del service
    return await this.inventoryService.create(createDto);
  }

  // 4. Actualizar datos básicos (Precio, Nombre, Categoría)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateInventoryItemDto,
  ) {
    return await this.inventoryService.update(id, updateDto);
  }

  // 5. Ajuste manual de stock (Entrada de mercadería)
  @Patch(':id/increase')
  async increaseStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return await this.inventoryService.adjustStock(id, quantity, 'increase');
  }

  // 6. Ajuste manual de stock (Mermas o roturas)
  @Patch(':id/decrease')
  async decreaseStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return await this.inventoryService.adjustStock(id, quantity, 'decrease');
  }
}
