import type { Id } from "../convex/_generated/dataModel";
export interface TeamData {
  id: number; // Primary Key
  name: string;
}
export type MoraleType = "Positive" | "Neutral" | "Negative";
export interface MoraleData {
  id: Id<"morale">; // Primary Key
  name: string;
  type: MoraleType;
  color: string;
}