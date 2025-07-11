import { WorkoutPartner, WorkoutDay } from '../types';

export const parseJsonSafely = <T>(jsonString: string | undefined, fallback: T): T => {
  if (!jsonString) return fallback;
  
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
};

export const serializePartners = (partners: WorkoutPartner[]): string => {
  const serializable = partners.map(p => ({ name: p.name, type: p.type }));
  return JSON.stringify(serializable);
};

export const serializeDays = (days: WorkoutDay[]): string => {
  const dayNames = days.map(d => d.day);
  return JSON.stringify(dayNames);
};