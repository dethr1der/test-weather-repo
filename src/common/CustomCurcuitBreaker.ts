export class CustomCircuitBreaker {
  private failureCount: number = 0;
  private lastFailureTime: number | null = null;
  private readonly failureThreshold: number;
  private readonly resetTimeout: number;
  private state: 'closed' | 'open' | 'half-closed' = 'closed';

  constructor(failureThreshold: number, resetTimeout: number) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    switch (this.state) {
      case 'open':
        if (this.isResetTimeoutExpired()) {
          this.state = 'half-closed';
        } else {
          throw new Error('Circuit is open');
        }
        break;
      case 'half-closed':
        this.state = 'open';
        break;
    }

    try {
      const result = await fn();
      this.reset();
      return result;
    } catch (error) {
      this.handleFailure();
      throw error;
    }
  }

  private handleFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.tripCircuit();
    }
  }

  private tripCircuit() {
    this.state = 'open';
    this.lastFailureTime = Date.now();
  }

  private isResetTimeoutExpired(): boolean {
    if (!this.lastFailureTime) {
      return true;
    }
    return Date.now() - this.lastFailureTime >= this.resetTimeout;
  }

  private reset() {
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'closed';
  }
}
