export function getCofficient(bombs: number, cells: any[]) {
  const diamonds = cells.filter((cell) => cell === "diamond").length;

  let coefficient = 1;
  if (!diamonds) {
    return coefficient;
  } else {
    for (let i = 1; i < diamonds + 1; i++) {
      coefficient *= (25 - bombs - i + 1) / (25 - i + 1);
    }
  }

  return Number(((1 / coefficient) * 0.97).toFixed(2));
}

export function getNextCofficient(bombs: number, cells: any[]) {
  const diamonds = cells.filter((cell) => cell === "diamond").length + 1;

  let coefficient = 1;
  for (let i = 1; i < diamonds + 1; i++) {
    coefficient *= (25 - bombs - i + 1) / (25 - i + 1);
  }

  return Number(((1 / coefficient) * 0.97).toFixed(2));
}
