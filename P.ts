class P {
  static Obj: Record<string, P> = {};

  Code: string|null;
  constructor(Code: string|null = null) {
    this.Code = Code ;
  }
}
