/* TYPEORM REPOSITORY ADAPTER
   Implements the WorkOrderRepository interface using TypeORM.
   It translates Domain Entities to ORM Entities and vice versa.
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkOrderRepository } from '../../domain/work-order.repository';
import { WorkOrder, WorkOrderStatus } from '../../domain/work-order.entity';
import { WorkOrderOrmEntity } from './work-order.orm-entity';
import { WorkOrderHistoryOrmEntity } from './work-order-history.orm-entity';
import { OrderHistory } from '../../domain/work-order-history.entity';
import { InvalidDomainValueException } from '../../../common/domain/exceptions/InvalidDomainValueException';

@Injectable()
export class TypeOrmWorkOrderRepository extends WorkOrderRepository {
  constructor(
    @InjectRepository(WorkOrderOrmEntity)
    private readonly typeOrmRepository: Repository<WorkOrderOrmEntity>,
    @InjectRepository(WorkOrderHistoryOrmEntity)
    private readonly typeOrmHistoryRepository: Repository<WorkOrderHistoryOrmEntity>,
  ) {
    super();
  }

  // Dentro de TypeOrmWorkOrderRepository

  async findByClientDni(dni: string): Promise<WorkOrder[]> {
    const orms = await this.typeOrmRepository.find({
      where: { client: { dni: dni } }, // Asumiendo que tienes la relación con 'client'
      relations: ['client'],
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  async findBySerialNumber(serialNumber: string): Promise<WorkOrder | null> {
    const orm = await this.typeOrmRepository.findOne({
      where: { serialNumber: serialNumber },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findByStatus(status: WorkOrderStatus): Promise<WorkOrder[]> {
    const orms = await this.typeOrmRepository.find({
      where: { status: status },
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  async save(order: WorkOrder): Promise<WorkOrder> {
    // Map Domain -> ORM
    const ormEntity = this.typeOrmRepository.create({
      id: order.id, // Si viene un ID, TypeORM hará un UPDATE; si no, un INSERT
      clientId: order.clientId,
      equipmentType: order.equipmentType,
      brand: order.brand,
      model: order.model,
      serialNumber: order.serialNumber, // <--- Faltaba
      aestheticCondition: order.aestheticCondition, // <--- Faltaba
      reportedFailure: order.reportedFailure,
      technicalDiagnosis: order.technicalDiagnosis, // <--- Faltaba
      laborCost: order.laborCost,
      totalAmount: order.totalAmount,
      technicianId: order.technicianId,
      status: order.status,
      deliveryDate: order.deliveryDate, // <--- Faltaba
      // createdAt no hace falta pasarlo si usas @CreateDateColumn, Postgres lo pone solo
    });

    const saved = await this.typeOrmRepository.save(ormEntity);

    // Map ORM -> Domain (To return a pure domain object)
    return new WorkOrder({
      id: saved.id,
      clientId: saved.clientId,
      brand: saved.brand,
      equipmentType: saved.equipmentType,
      model: saved.model,
      reportedFailure: saved.reportedFailure,
      status: saved.status as WorkOrderStatus,
      laborCost: saved.laborCost, // <--- Añadido
      totalAmount: saved.totalAmount, // <--- Añadido
      technicianId: saved.technicianId,
      createdAt: saved.createdAt,
      deliveryDate: saved.deliveryDate, // <--- Añadido
      technicalDiagnosis: saved.technicalDiagnosis, // <--- Añadido
      serialNumber: saved.serialNumber, // <--- Añadido
      aestheticCondition: saved.aestheticCondition, // <--- Añadido
    });
  }

  async findById(id: string): Promise<WorkOrder | null> {
    const ormEntity = await this.typeOrmRepository.findOne({ where: { id } });

    if (!ormEntity) return null;

    // Rehidratamos la entidad de dominio con los datos de la DB
    return new WorkOrder({
      id: ormEntity.id,
      clientId: ormEntity.clientId,
      clientName: ormEntity.client?.fullname, // <--- Añadido
      equipmentType: ormEntity.equipmentType,
      brand: ormEntity.brand,
      model: ormEntity.model,
      reportedFailure: ormEntity.reportedFailure,
      serialNumber: ormEntity.serialNumber, // <--- Añadido
      aestheticCondition: ormEntity.aestheticCondition, // <--- Añadido
      status: ormEntity.status as WorkOrderStatus, // Cast al enum de dominio
      laborCost: ormEntity.laborCost, // <--- Añadido
      totalAmount: ormEntity.totalAmount, // <--- Añadido
      technicianId: ormEntity.technicianId,
      createdAt: ormEntity.createdAt,
      deliveryDate: ormEntity.deliveryDate, // <--- Añadido
      technicalDiagnosis: ormEntity.technicalDiagnosis, // <--- Añadido
    });
  }

  async findAll(): Promise<WorkOrder[]> {
    const all = await this.typeOrmRepository.find({ relations: ['client'] });
    return all.map((orm) => {
      return new WorkOrder({
        id: orm.id,
        clientId: orm.clientId,
        clientName: orm.client ? orm.client.fullname : 'Cliente no encontrado', // <--- Aquí sacamos el nombre
        brand: orm.brand,
        equipmentType: orm.equipmentType,
        model: orm.model,
        reportedFailure: orm.reportedFailure,
        serialNumber: orm.serialNumber, // <--- Añadido
        aestheticCondition: orm.aestheticCondition, // <--- Añadido
        status: orm.status as WorkOrderStatus, // Cast al enum de dominio
        laborCost: orm.laborCost, // <--- Añadido
        totalAmount: orm.totalAmount, // <--- Añadido
        technicianId: orm.technicianId,
        createdAt: orm.createdAt,
        deliveryDate: orm.deliveryDate, // <--- Añadido
        technicalDiagnosis: orm.technicalDiagnosis, // <--- Añadido
      });
    });
  }

  async update(order: WorkOrder): Promise<void> {
    if (!order.id) {
      throw new InvalidDomainValueException('ORDER_ID_REQUIRED_FOR_UPDATE');
    }
    const updateData: any = {};
    if (order.status !== undefined) updateData.status = order.status;
    if (order.laborCost !== undefined) updateData.laborCost = order.laborCost;
    if (order.totalAmount !== undefined)
      updateData.totalAmount = order.totalAmount;
    if (order.technicianId !== undefined)
      updateData.technicianId = order.technicianId;
    if (order.deliveryDate !== undefined)
      updateData.deliveryDate = order.deliveryDate;
    if (order.technicalDiagnosis !== undefined)
      updateData.technicalDiagnosis = order.technicalDiagnosis;
    if (order.serialNumber !== undefined)
      updateData.serialNumber = order.serialNumber; // <--- Añadido
    if (order.aestheticCondition !== undefined)
      updateData.aestheticCondition = order.aestheticCondition; // <--- Añadido
    if (order.reportedFailure !== undefined)
      updateData.reportedFailure = order.reportedFailure;
    if (order.serialNumber !== undefined)
      updateData.serialNumber = order.serialNumber; // <--- Añadido
    if (order.aestheticCondition !== undefined)
      updateData.aestheticCondition = order.aestheticCondition;
    await this.typeOrmRepository.update(order.id, updateData);
  }

  async findByTechnician(technicianId: string): Promise<WorkOrder[]> {
    const ormEntities = await this.typeOrmRepository.find({
      where: { technicianId: technicianId },
    });

    return ormEntities.map(
      (ormEntity) =>
        new WorkOrder({
          id: ormEntity.id,
          clientId: ormEntity.clientId,
          clientName: ormEntity.client?.fullname, // <--- Añadido
          technicianId: ormEntity.technicianId,
          equipmentType: ormEntity.equipmentType,
          brand: ormEntity.brand,
          model: ormEntity.model,
          reportedFailure: ormEntity.reportedFailure,
          status: ormEntity.status as WorkOrderStatus, // Cast al enum de dominio
          laborCost: ormEntity.laborCost, // <--- Añadido
          totalAmount: ormEntity.totalAmount, // <--- Añadido
          createdAt: ormEntity.createdAt,
          deliveryDate: ormEntity.deliveryDate, // <--- Añadido
          technicalDiagnosis: ormEntity.technicalDiagnosis, // <--- Añadido
        }),
    );
  }

  async saveHistory(history: OrderHistory): Promise<void> {
    // Ahora TypeScript reconocerá 'orderId' porque está en la clase de arriba
    const historyEntity = this.typeOrmHistoryRepository.create({
      orderId: history.orderId,
      userId: history.userId,
      previousStatus: history.previousStatus,
      newStatus: history.newStatus,
      notes: history.notes, // O history.notes si lo agregaste al dominio
      serialNumber: history.serialNumber, // <--- Añadido
      aestheticCondition: history.aestheticCondition, // <--- Añadido
      reportedFailure: history.reportedFailure,
      laborCost: history.laborCost, // <--- Añadido
      totalAmount: history.totalAmount, // <--- Añadido
      technicalDiagnosis: history.technicalDiagnosis, // <--- Añadido
      changedAt: history.createdAt, // Sincronizamos el nombre del dominio con el del ORM
    });
    await this.typeOrmHistoryRepository.save(historyEntity);
  }

  async findHistoryByOrderId(orderId: string): Promise<OrderHistory[]> {
    const ormEntities = await this.typeOrmHistoryRepository.find({
      where: { orderId: orderId },
      order: { changedAt: 'DESC' }, // Ver lo más reciente primero
    });

    return ormEntities.map(
      (orm) =>
        new OrderHistory({
          id: orm.id,
          orderId: orm.orderId,
          userId: orm.userId,
          previousStatus: orm.previousStatus ?? undefined,
          newStatus: orm.newStatus,
          notes: orm.notes,
          serialNumber: orm.serialNumber ?? undefined, // <--- Añadido
          aestheticCondition: orm.aestheticCondition ?? undefined, // <--- Añadido
          reportedFailure: orm.reportedFailure ?? undefined, // <--- Añadido
          laborCost: orm.laborCost ?? undefined, // <--- Añadido
          totalAmount: orm.totalAmount ?? undefined, // <--- Añadido
          technicalDiagnosis: orm.technicalDiagnosis ?? undefined, // <--- Añadido
          createdAt: orm.changedAt, // Sincronizamos el nombre del dominio con el del ORM
        }),
    );
  }

  private toDomain(orm: WorkOrderOrmEntity): WorkOrder {
    return new WorkOrder({
      id: orm.id,
      clientId: orm.clientId,
      serialNumber: orm.serialNumber,
      aestheticCondition: orm.aestheticCondition,
      equipmentType: orm.equipmentType,
      brand: orm.brand,
      model: orm.model,
      reportedFailure: orm.reportedFailure,
      technicalDiagnosis: orm.technicalDiagnosis,
      status: orm.status as WorkOrderStatus,
      laborCost: Number(orm.laborCost),
      totalAmount: Number(orm.totalAmount),
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}
