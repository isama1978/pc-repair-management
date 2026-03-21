export interface OrderHistoryProps {
  id?: string;
  orderId: string;
  userId: string;
  previousStatus?: string;
  newStatus: string;
  notes: string;
  serialNumber?: string;
  aestheticCondition?: string;
  reportedFailure?: string;
  laborCost?: number;
  totalAmount?: number;
  technicalDiagnosis?: string;
  createdAt?: Date;
}

export class OrderHistory {
  constructor(public readonly props: OrderHistoryProps) {}

  get orderId() {
    return this.props.orderId;
  }
  get userId() {
    return this.props.userId;
  }
  get previousStatus() {
    return this.props.previousStatus;
  }
  get newStatus() {
    return this.props.newStatus;
  }
  get notes() {
    return this.props.notes;
  }
  get serialNumber() {
    return this.props.serialNumber;
  }
  get aestheticCondition() {
    return this.props.aestheticCondition;
  }
  get reportedFailure() {
    return this.props.reportedFailure;
  }
  get laborCost() {
    return this.props.laborCost;
  }
  get totalAmount() {
    return this.props.totalAmount;
  }
  get technicalDiagnosis() {
    return this.props.technicalDiagnosis;
  }
  get createdAt() {
    return this.props.createdAt;
  }
}
