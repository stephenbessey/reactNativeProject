export class ValidationResult {
  constructor(private readonly errors: string[]) {}

  get isValid(): boolean {
    return this.errors.length === 0;
  }

  get errorMessages(): string[] {
    return [...this.errors];
  }

  get firstError(): string | null {
    return this.errors[0] || null;
  }

  get errorCount(): number {
    return this.errors.length;
  }

  getErrorsAsString(separator: string = '\n'): string {
    return this.errors.join(separator);
  }

  hasError(errorMessage: string): boolean {
    return this.errors.includes(errorMessage);
  }

  merge(additionalErrors: string[]): ValidationResult {
    return new ValidationResult([...this.errors, ...additionalErrors]);
  }

  static success(): ValidationResult {
    return new ValidationResult([]);
  }

  static failure(error: string): ValidationResult {
    return new ValidationResult([error]);
  }

  static failures(errors: string[]): ValidationResult {
    return new ValidationResult(errors);
  }
}