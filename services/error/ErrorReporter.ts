import { WorkoutError } from './WorkoutError';

export interface ErrorReport {
  code: string;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  stack?: string;
  userId?: string;
  sessionId?: string;
}

export interface ErrorHandler {
  handle(report: ErrorReport): void;
}

export class ErrorReporter {
  private static instance: ErrorReporter;
  private readonly handlers: ErrorHandler[] = [];
  private readonly sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }

  addHandler(handler: ErrorHandler): void {
    this.handlers.push(handler);
  }

  removeHandler(handler: ErrorHandler): void {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
    }
  }

  reportError(error: WorkoutError | Error, context?: Record<string, unknown>): void {
    const errorReport = this.createErrorReport(error, context);
    
    this.handlers.forEach(handler => {
      try {
        handler.handle(errorReport);
      } catch (handlerError) {
        console.error('Error handler failed:', handlerError);
      }
    });
  }

  private createErrorReport(
    error: WorkoutError | Error, 
    additionalContext?: Record<string, unknown>
  ): ErrorReport {
    const baseReport: ErrorReport = {
      code: this.getErrorCode(error),
      message: error.message,
      timestamp: new Date(),
      stack: error.stack,
      sessionId: this.sessionId,
    };

    if (error instanceof WorkoutError && error.context) {
      baseReport.context = { ...error.context };
    }

    if (additionalContext) {
      baseReport.context = { ...baseReport.context, ...additionalContext };
    }

    return baseReport;
  }

  private getErrorCode(error: WorkoutError | Error): string {
    if (error instanceof WorkoutError) {
      return error.code;
    }
    
    return error.name || 'UNKNOWN_ERROR';
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  clearHandlers(): void {
    this.handlers.length = 0;
  }

  getHandlerCount(): number {
    return this.handlers.length;
  }
}
