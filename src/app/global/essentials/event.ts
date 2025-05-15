import StrictEvent from "./strictEvent";

export class Event<T> extends StrictEvent<T | undefined> {

  public override emit(t?: T): void {
    super.emit(t);
  }
}
