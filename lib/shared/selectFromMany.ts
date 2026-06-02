export function selectFromMany(k: number, n: number): number[] {
  const selectedNumbers = [];
  const remainingNumbers = [];
  for (let i = 0; i < n; i++) {
    remainingNumbers.push(i);
  }

  while (selectedNumbers.length < k) {
    const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
    selectedNumbers.push(remainingNumbers[randomIndex]);
    remainingNumbers.splice(randomIndex, 1);
  }

  return selectedNumbers;
}
