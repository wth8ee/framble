export function countDiamonds(cells: any[]) {
  return cells.filter((cell) => cell === "diamond").length;
}
