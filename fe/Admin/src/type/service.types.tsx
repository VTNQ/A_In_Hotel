export type UnitExtraService =
  | "PERNIGHT"
  | "PERDAY"
  | "PERUSE"
  | "PERTRIP";

export interface ExtraService {
  id: number;
  name: string;
  price: number; 
  unit: UnitExtraService;
}
