/* WORK ORDER DOMAIN ENTITY
   This class represents the core business logic for a Repair Order.
   Aligned with DomainExceptions and i18n keys.
*/

import { InvalidDomainValueException } from 'src/modules/common/domain/exceptions/InvalidDomainValueException';
import { InvalidOrderOperationException } from './exceptions/invalid-order-status-transition.exception';

export enum WorkOrderStatus {
  RECEIVED = 'RECIBIDO',
  DIAGNOSING = 'DIAGNOSTICANDO',
  BUDGETED = 'PRESUPUESTADO',
  WAITING_PARTS = 'ESPERANDO_REPUESTO',
  REPAIRING = 'REPARANDO',
  TESTEANDO = 'TESTEANDO',
  READY = 'LISTO',
  DELIVERED = 'ENTREGADO',
  CANCELLED = 'CANCELADO',
}

export interface WorkOrderProps {
  id?: string;
  clientId: string;
  clientName?: string;
  equipmentType: string;
  brand: string;
  model: string;
  reportedFailure: string;
  serialNumber?: string;
  aestheticCondition?: string;
  status?: WorkOrderStatus;
  laborCost?: number;
  totalAmount?: number;
  technicianId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deliveryDate?: Date;
  technicalDiagnosis?: string;
}

export class WorkOrder {
  private props: WorkOrderProps;

  constructor(props: WorkOrderProps) {
    // 🛡️ Validaciones de inicialización usando llaves de i18n
    if (!props.clientId) {
      throw new InvalidDomainValueException('CLIENT_ID_REQUIRED');
    }
    if (!props.brand || props.brand.trim() === '') {
      throw new InvalidDomainValueException('EQUIPMENT_BRAND_REQUIRED');
    }
    if (!props.equipmentType || props.equipmentType.trim() === '') {
      throw new InvalidDomainValueException('EQUIPMENT_TYPE_REQUIRED');
    }

    this.props = {
      ...props,
      status: props.status || WorkOrderStatus.RECEIVED,
    };
  }

  /**
   * Actualización de datos técnicos.
   * Bloquea la edición si la orden ya fue entregada.
   */
  public updateTechnicalData(
    data: Partial<Omit<WorkOrderProps, 'id' | 'clientId' | 'status'>>,
  ): void {
    if (this.props.status === WorkOrderStatus.DELIVERED) {
      // Usamos la clave específica del JSON
      throw new InvalidOrderOperationException(
        'CANNOT_UPDATE_DELIVERED_ORDER',
        this.props.status,
      );
    }

    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        if (key === 'deliveryDate' && typeof value === 'string') {
          acc[key] = new Date(value);
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as any);

    this.props = {
      ...this.props,
      ...cleanData,
    };
  }

  /**
   * Control maestro de transiciones de estado.
   */
  public changeStatus(newStatus: WorkOrderStatus): void {
    const current = this.props.status;

    if (current === WorkOrderStatus.DELIVERED) {
      throw new InvalidOrderOperationException(
        'ORDER_ALREADY_DELIVERED',
        current,
      );
    }

    // Regla: No se puede volver a 'Recibido' si ya estaba 'Listo'
    if (
      current === WorkOrderStatus.READY &&
      newStatus === WorkOrderStatus.RECEIVED
    ) {
      throw new InvalidOrderOperationException(
        'INVALID_STATUS_TRANSITION',
        current,
      );
    }

    this.props.status = newStatus;
  }

  private ensureCanPerformAction(
    actionKey: string, // Ahora pasamos la clave de error directamente
    forbiddenStatuses: WorkOrderStatus[],
  ) {
    if (forbiddenStatuses.includes(this.status)) {
      throw new InvalidOrderOperationException(actionKey, this.status);
    }
  }

  // Métodos de guarda para Casos de Uso
  canBeCancelled() {
    this.ensureCanPerformAction('INVALID_STATUS_TRANSITION', [
      WorkOrderStatus.READY,
      WorkOrderStatus.DELIVERED,
      WorkOrderStatus.CANCELLED,
    ]);
  }

  canAddParts() {
    this.ensureCanPerformAction('CANNOT_UPDATE_DELIVERED_ORDER', [
      WorkOrderStatus.DELIVERED,
      WorkOrderStatus.CANCELLED,
    ]);
  }

  canBeDelivered() {
    if (this.status !== WorkOrderStatus.READY) {
      throw new InvalidOrderOperationException(
        'INVALID_STATUS_TRANSITION',
        this.status,
      );
    }
  }

  // Getters (Mantener igual...)
  get id() {
    return this.props.id;
  }
  get status() {
    return this.props.status || WorkOrderStatus.RECEIVED;
  }
  get clientId() {
    return this.props.clientId;
  }
  get clientName() {
    return this.props.clientName;
  }
  get equipmentType() {
    return this.props.equipmentType;
  }
  get brand() {
    return this.props.brand;
  }
  get model() {
    return this.props.model;
  }
  get reportedFailure() {
    return this.props.reportedFailure;
  }
  get serialNumber() {
    return this.props.serialNumber;
  }
  get aestheticCondition() {
    return this.props.aestheticCondition;
  }
  get laborCost() {
    return this.props.laborCost;
  }
  get totalAmount() {
    return this.props.totalAmount;
  }
  get technicianId() {
    return this.props.technicianId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get deliveryDate() {
    return this.props.deliveryDate;
  }
  get technicalDiagnosis() {
    return this.props.technicalDiagnosis;
  }
}
