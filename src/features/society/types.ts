export interface Society {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  totalBlocks: number;
  totalUnits: number;
  createdAt: string;
}

export interface SocietyFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  totalBlocks: number;
  totalUnits: number;
}
