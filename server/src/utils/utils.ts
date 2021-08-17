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
