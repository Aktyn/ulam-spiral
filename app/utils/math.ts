export function isPrime(n: number) {
  if (isNaN(n) || !isFinite(n) || !Number.isInteger(n) || n < 2) {
    return false
  }

  if (n % 2 == 0) {
    return n == 2
  }

  const sqrt = Math.sqrt(n)
  for (let i = 3; i < sqrt; i += 2) {
    if (n % i == 0) {
      return false
    }
  }

  return true
}
