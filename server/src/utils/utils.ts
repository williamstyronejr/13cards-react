/**
 * Generates a random string using Math.random.
 * @param {Number} len Desired length of string
 * @param {String} append String to append to the random string
 * @return {String} Returns a random string.
 */
export function generateString(length = 16, append = ''): string {
  return (
    (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    ).substring(0, length) + append
  );
}

/**
 * Compares two cards to determine the smaller card with rules of the game.
 * @param c1 Card value in "suitnumber" format
 * @param c2 Card value in "suitnumber" format
 * @return {Number} Returns a number indicating the comparison of the two cards.
 *  0 if equal, 1 if c1 is greater then c2, or -1 if c1 is less than c2.
 */
export function compareCards(c1: string, c2: string): number {
  if (c1 === c2) return 0;

  const c1Suit = c1.charAt(0);
  const c2Suit = c2.charAt(0);
  let c1Value = parseInt(c1.substr(1), 10);
  let c2Value = parseInt(c2.substr(1), 10);
  c1Value = c1Value < 3 ? c1Value + 20 : c1Value;
  c2Value = c2Value < 3 ? c2Value + 20 : c2Value;

  // Same card value
  if (c1Value === c2Value) {
    if (c1Suit === 'h') return 1;
    if (c1Suit === 's') return -1;
    if (c1Suit === 'c' && (c2Suit === 'd' || c2Suit === 'h')) return -1;
    if (c1Suit === 'd' && c2Suit === 'h') return -1;
    return 1;
  }

  return c1Value > c2Value ? 1 : -1;
}
