import { Exercise } from '../../contexts/WorkoutContext';
import { ValidationResult } from './ValidationResult';

export class ExerciseValidator {
  private static readonly VALIDATION_RULES = {
    NAME: { minLength: 1, maxLength: 100 },
    SETS: { min: 1, max: 20 },
    REPS: { min: 1, max: 999 },
    WEIGHT: { min: 0, max: 9999 },
    DURATION: { min: 0, max: 3600 },
    REST_TIME: { min: 0, max: 600 },
  } as const;

  validateExercise(exercise: Partial<Exercise>): ValidationResult {
    const errors: string[] = [];

    this.validateName(exercise.name, errors);
    this.validateSets(exercise.sets, errors);
    this.validateReps(exercise.reps, errors);
    this.validateWeight(exercise.weight, errors);
    this.validateDuration(exercise.duration, errors);
    this.validateRestTime(exercise.restTime, errors);

    return new ValidationResult(errors);
  }

  validateName(name: string | undefined, errors: string[]): void {
    if (!name?.trim()) {
      errors.push('Exercise name is required');
      return;
    }

    const { minLength, maxLength } = ExerciseValidator.VALIDATION_RULES.NAME;
    const trimmedName = name.trim();
    
    if (trimmedName.length < minLength || trimmedName.length > maxLength) {
      errors.push(`Exercise name must be between ${minLength} and ${maxLength} characters`);
    }
  }

  private validateSets(sets: number | undefined, errors: string[]): void {
    if (sets === undefined) {
      errors.push('Sets is required');
      return;
    }

    if (!Number.isInteger(sets)) {
      errors.push('Sets must be a whole number');
      return;
    }

    const { min, max } = ExerciseValidator.VALIDATION_RULES.SETS;
    if (sets < min || sets > max) {
      errors.push(`Sets must be between ${min} and ${max}`);
    }
  }

  private validateReps(reps: number | undefined, errors: string[]): void {
    if (reps === undefined) {
      errors.push('Reps is required');
      return;
    }

    if (!Number.isInteger(reps)) {
      errors.push('Reps must be a whole number');
      return;
    }

    const { min, max } = ExerciseValidator.VALIDATION_RULES.REPS;
    if (reps < min || reps > max) {
      errors.push(`Reps must be between ${min} and ${max}`);
    }
  }

  private validateWeight(weight: number | undefined, errors: string[]): void {
    if (weight === undefined) return;

    if (weight < 0) {
      errors.push('Weight cannot be negative');
      return;
    }

    const { min, max } = ExerciseValidator.VALIDATION_RULES.WEIGHT;
    if (weight < min || weight > max) {
      errors.push(`Weight must be between ${min} and ${max} lbs`);
    }
  }

  private validateDuration(duration: number | undefined, errors: string[]): void {
    if (duration === undefined) return;

    if (!Number.isInteger(duration)) {
      errors.push('Duration must be a whole number of seconds');
      return;
    }

    const { min, max } = ExerciseValidator.VALIDATION_RULES.DURATION;
    if (duration < min || duration > max) {
      errors.push(`Duration must be between ${min} and ${max} seconds`);
    }
  }

  private validateRestTime(restTime: number | undefined, errors: string[]): void {
    if (restTime === undefined) return;

    if (!Number.isInteger(restTime)) {
      errors.push('Rest time must be a whole number of seconds');
      return;
    }

    const { min, max } = ExerciseValidator.VALIDATION_RULES.REST_TIME;
    if (restTime < min || restTime > max) {
      errors.push(`Rest time must be between ${min} and ${max} seconds`);
    }
  }
}