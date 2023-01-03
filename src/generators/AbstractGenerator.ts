import { createGrammar } from "tracery-grammar";

export type TraceryGrammar = ReturnType<typeof createGrammar>;

export class AbstractGenerator {
  g!: TraceryGrammar;
  expr!: string;

  used = new Set<string>();

  generate(expr: string | null = null): string {
    let val = this.postprocess(this.g.flatten(expr || this.expr));
    let n = 0;
    while (this.used.has(val) && n < 100) {
      val = this.postprocess(this.g.flatten(expr || this.expr));
      n += 1;
    }
    this.used.add(val);
    return val;
  }

  postprocess(s: string): string {
    return s;
  }
}
