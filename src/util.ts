export function rangeRandom(
  minInclusive: number,
  maxExclusive: number
): number {
  return minInclusive + (maxExclusive - minInclusive) * Math.random();
}

export function randomPass(ifLessThan: number, value = Math.random()): boolean {
  return value < ifLessThan;
}

export function randomRange(
  min: number,
  max: number,
  value = Math.random()
): number {
  return min + value * (max - min);
}

export function randomInt(max: number, value = Math.random()): number {
  return Math.floor(value * max);
}

export function choice<T>(list: T[], value = Math.random()): T {
  return list[Math.floor(value * list.length)];
}

export function shuffleInPlace<T>(list: T[]): T[] {
  let currentIndex = list.length;
  let randomIndex = 0;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [list[currentIndex], list[randomIndex]] = [
      list[randomIndex],
      list[currentIndex],
    ];
  }

  return list;
}

export function shuffleCopy<T>(list: T[]): T[] {
  const result = [...list];
  shuffleInPlace(result);
  return result;
}

export function selectRandomPrefixByPowerDistribution<T>(
  probability: number,
  list: T[]
): Iterable<T> {
  let n = 0;
  while (randomPass(probability) && n < list.length) {
    n += 1;
  }
  return list.slice(0, n);
}
