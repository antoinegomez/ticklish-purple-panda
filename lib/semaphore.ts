/*
 *
 * I asked claude to generate me a Semaphore queue task manager
 * The goal is to limit the number of concurrent async process.
 *
 * For
 *
 * 1) Not overload the external API
 * 2) Not overload our app
 *
 * I have used a lot the npm package named p-limit to do that but I wanted
 * here to have a solution without a package.
 *
 * */
export class Semaphore {
  private permits: number;
  private queue: (() => void)[] = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    this.permits++;

    if (this.queue.length > 0 && this.permits > 0) {
      this.permits--;
      const nextResolve = this.queue.shift();
      if (nextResolve) nextResolve();
    }
  }
}

export class SemaphoreTaskQueue {
  private semaphore: Semaphore;

  constructor(concurrency: number) {
    this.semaphore = new Semaphore(concurrency);
  }

  async addTask<T>(task: () => Promise<T>): Promise<T> {
    await this.semaphore.acquire();
    try {
      return await task();
    } finally {
      this.semaphore.release();
    }
  }
}
