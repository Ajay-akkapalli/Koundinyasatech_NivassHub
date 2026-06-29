export type ResidentStatus = 'Active' | 'Inactive';

export interface Resident {
  id: string;
  name: string;
  flat: string;
  block: string;
  phone: string;
  email: string;
  status: ResidentStatus;
  moveInDate: string;
  members: number;
  vehicleNo: string | null;
  avatar: string;
}
