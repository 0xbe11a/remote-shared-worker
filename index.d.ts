declare global {
  interface SharedWorker {
    new (scriptURL: string | URL, options?: WorkerOptions): SharedWorker;
  }
}