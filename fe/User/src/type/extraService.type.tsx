export type ExtraServiceUnit = "PERNIGHT" | "PERDAY" | "PERUSE" | "PERTRIP";

export interface ExtraService {
  id: number;
  serviceName: string;
  extraCharge:number;
}
