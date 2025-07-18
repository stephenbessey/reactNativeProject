export class StorageError extends Error {
  constructor(
    message: string, 
    public readonly context?: { cause?: unknown; operation?: string }
  ) {
    super(message);
    this.name = 'StorageError';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StorageError);
    }
  }

  get fullMessage(): string {
    let message = this.message;
    
    if (this.context?.operation) {
      message = `[${this.context.operation}] ${message}`;
    }
    
    if (this.context?.cause) {
      const cause = this.context.cause instanceof Error 
        ? this.context.cause.message 
        : String(this.context.cause);
      message += ` (Caused by: ${cause})`;
    }
    
    return message;
  }

  static read(key: string, cause?: unknown): StorageError {
    return new StorageError(
      `Failed to read data from storage key: ${key}`,
      { operation: 'READ', cause }
    );
  }

  static write(key: string, cause?: unknown): StorageError {
    return new StorageError(
      `Failed to write data to storage key: ${key}`,
      { operation: 'WRITE', cause }
    );
  }

  static clear(key: string, cause?: unknown): StorageError {
    return new StorageError(
      `Failed to clear storage key: ${key}`,
      { operation: 'CLEAR', cause }
    );
  }

  static corruption(key: string, cause?: unknown): StorageError {
    return new StorageError(
      `Data corruption detected in storage key: ${key}`,
      { operation: 'DESERIALIZE', cause }
    );
  }
}