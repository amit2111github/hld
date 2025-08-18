const MOD = 1_000_000_007;

function pow(a, n) {
  if (n == 0) return 1;
  if (n == 1) return a % MOD;
  const ans = pow(a, Math.floor(n / 2));
  if (n % 2 == 0) return (ans * ans) % MOD;
  return (((ans * ans) % MOD) * a) % MOD;
}

exports.getHashedString = (originalString) => {
  if (!originalString) throw new Error("Missing string value to hash");
  const prime = 31;
  const charCodes = originalString.split("").map((ch) => ch.charCodeAt(0));
  return charCodes.reduce((acc, cur, index) => {
    const term = (cur * pow(prime, index)) % MOD;
    return (acc + term) % MOD;
  }, 0);
};
