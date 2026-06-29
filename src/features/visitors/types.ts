export type VisitorStatus = 'In' | 'Out';

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  hostFlat: string;
  hostName: string;
  checkIn: string;
  checkOut: string | null;
  status: VisitorStatus;
  gate: string;
  vehicleNo: string | null;
}
