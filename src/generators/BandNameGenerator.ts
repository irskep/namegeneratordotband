import { baseEngModifiers, createGrammar } from "tracery-grammar";
import { AbstractGenerator } from "./AbstractGenerator";
import englishNouns from "@/datasets/english-nouns.txt?raw";
import englishAdjectives from "@/datasets/english-adjectives.txt?raw";
import personNames from "@/datasets/person-names.txt?raw";
import { choice, randomInt, randomPass } from "@/util";

function titleCase(s: string): string {
  function transform(w: string, i: number) {
    if (
      i > 0 &&
      (w === "a" ||
        w === "an" ||
        w === "the" ||
        w === "of" ||
        w === "for" ||
        w === "and")
    ) {
      return w;
    }
    return w.charAt(0).toLocaleUpperCase() + w.slice(1);
  }
  function transform2(s: string, char: string): string {
    return s.split(char).map(transform).join(char);
  }
  s = transform2(s, " ");
  s = transform2(s, "/");
  s = transform2(s, "-");
  return s;
}

function load(csvText: string): string[] {
  return csvText
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export default class BandNameGenerator extends AbstractGenerator {
  expr = "#bandname#";

  persons = load(personNames);

  replacePersons(newPersons: string[] | null) {
    this.persons = newPersons || load(personNames);
    this.recreateGrammar();
  }

  recreateGrammar() {
    this.g = createGrammar({
      bandname: [
        "#noun##adjective#",
        "#noun# of the #adjective# #noun.s#",
        "#noun# of #adjective# #noun.s#",
        "#noun# for the #noun#",
        "#noun# for the #noun# #noun#",
        "#preposition# the #noun#",
        "#preposition# #noun#",
        "#preposition# the #adjective# #noun#",
        "#adjective# #noun#",
        "#adjective# #noun#",
        "#noun#",
        "#noun#",
        "#noun.s#",
        "#noun.s#",
        "#adjective# #noun#",
        "#adjective# #noun#",
        "#adjective# #adjective# #noun#",
        "#noun#",
        "#noun#",
        "#noun.s#",
        "#noun.s#",
        "#letter##letter##letter#",
        "the #adjective# #noun.s#",

        "#noun#/#noun#",
        "#noun#-#noun#",
        "#noun# of #noun#",

        "#adjective# #person#",
        "#person# the #noun#",
        "#person# and the #noun#",
        "#person# and the #adjective# #noun.s#",

        "#person# & #person#",
        "#person#",
        "the #person.s#",
      ],
      letter: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
      adjective: load(englishAdjectives),
      noun: load(englishNouns),
      person: this.persons,
      preposition: [
        "aboard",
        "about",
        "above",
        "across",
        "after",
        "against",
        "along",
        "amid",
        "among",
        "anti",
        "around",
        "as",
        "at",
        "before",
        "behind",
        "below",
        "beneath",
        "beside",
        "besides",
        "between",
        "beyond",
        "but",
        "by",
        "concerning",
        "considering",
        "despite",
        "down",
        "during",
        "except",
        "excepting",
        "excluding",
        "following",
        "for",
        "from",
        "in",
        "inside",
        "into",
        "like",
        "minus",
        "near",
        "of",
        "off",
        "on",
        "onto",
        "opposite",
        "outside",
        "over",
        "past",
        "per",
        "plus",
        "regarding",
        "round",
        "save",
        "since",
        "than",
        "through",
        "to",
        "toward",
        "towards",
        "under",
        "underneath",
        "unlike",
        "until",
        "up",
        "upon",
        "versus",
        "via",
        "with",
        "within",
        "without",
      ],
    });
    this.g.addModifiers(baseEngModifiers);
  }

  constructor() {
    super();
    this.recreateGrammar();

    // sex has extra noun weight. prevent its use as a band name by itself.
    this.used.add("sex");
    this.used.add("Sex");
    this.used.add("s.e.x.");
    this.used.add("S.E.X.");
    // But if we get "sex?" or "sex!", let it go, because that's hilarious.
  }

  postprocess(str: string): string {
    // console.log("Postprocess", str);
    function splitSub(
      s: string,
      src: string,
      dest: string,
      prob: number
    ): string {
      const parts = s.split(src);
      if (parts.length === 1) return s;
      const result = new Array<string>();
      for (let i = 0; i < parts.length; i++) {
        result.push(parts[i]);

        if (i === parts.length - 1) continue;

        if (Math.random() > prob) {
          result.push(src);
        } else {
          result.push(dest);
        }
      }
      // console.log(src, dest, parts, result);

      return result.join("");
    }

    // Intentional misspellings
    str = splitSub(str, "ie", "y", 0.01);
    str = splitSub(str, "io", "y", 0.01);
    str = splitSub(str, "ou", "y", 0.01);
    str = splitSub(str, "i", "y", 0.01);
    str = splitSub(str, "e", "y", 0.01);
    str = splitSub(str, "a", "o", 0.01);
    str = splitSub(str, "a", "e", 0.01);
    str = splitSub(str, "e", "a", 0.01);
    str = splitSub(str, "o", "0", 0.01);

    // s/z suffix substitution
    if (randomPass(0.05) && str[str.length - 1] === "s") {
      str = str.slice(0, str.length - 1) + "z";
    }

    type Style =
      | "titlecase"
      | "lowercase"
      | "uppercase"
      | "lowercase_dots"
      | "uppercase_dots";
    const styles: Style[] = [
      "titlecase",
      "titlecase",
      "titlecase",
      "titlecase",
      "titlecase",
      "titlecase",
      "titlecase",
      "titlecase",
      "titlecase",
      "titlecase",
      "titlecase",
      "titlecase",
      "titlecase",
      "titlecase",
      "titlecase",
      "titlecase",
      "titlecase",
      "titlecase",
      "lowercase",
      "lowercase",
      "uppercase",
      "uppercase",
    ];

    const hasPunc =
      str.indexOf("-") !== -1 ||
      str.indexOf("/") !== -1 ||
      str.indexOf(".") !== -1;

    // Any given vowel has a 0.5% chance of being removed
    str = str
      .split("")
      .filter((c) => "aeiou".indexOf(c) === -1 || randomPass(0.995))
      .join("");
    if (randomPass(0.01)) {
      // Remove one letter
      const removeIndex = randomInt(str.length);
      str = str.slice(0, removeIndex) + str.slice(removeIndex + 1);
    }

    // Allow a.b.c. transform if no punctuation, plus random factor to weight it down
    if (!hasPunc && str.length < 15 && randomPass(0.5)) {
      styles.push("lowercase_dots", "uppercase_dots");
    }
    const style = choice(styles);
    switch (style) {
      case "titlecase":
        str = titleCase(str);
        break;
      case "lowercase":
        str = str.toLocaleLowerCase();
        break;
      case "lowercase_dots":
        str = str
          .toLocaleLowerCase()
          .split("")
          .map((c) => (c === " " ? " " : `${c}.`))
          .join("");
        break;
      case "uppercase_dots":
        str = str
          .split("")
          .map((c) => (c === " " ? " " : `${c.toLocaleUpperCase()}.`))
          .join("");
        break;
    }

    if (randomPass(0.01)) {
      str += "!";
    }

    if (
      !hasPunc &&
      style !== "uppercase_dots" &&
      style !== "lowercase_dots" &&
      randomPass(0.01)
    ) {
      str = str
        .split(" ")
        .map((s) => s + choice(["!", "?", "", "", ""]))
        .join(" ");
    }

    return str;
  }
}
