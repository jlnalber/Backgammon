type Listener<T> = (t: T) => void;

export default class StrictEvent<T> {
  protected readonly listeners: Listener<T>[] = [];

  public addListener(listener: Listener<T>): void {
    this.listeners.push(listener);
  }

  public removeListener(listener: Listener<T>): boolean {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
      return true;
    }
    return false;
  }

  public emit(t: T): void {
    for (let listener of this.listeners) {
      listener(t);
    }
  }

  public get empty(): boolean {
    return this.listeners.length == 0;
  }

  public get length(): number {
    return this.listeners.length;
  }
}
