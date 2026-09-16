class SHA1 {
  // Private lists - these are expanded to what they should be each round
  #fFunctionList: string[] = [
    "OR(AND(B, C), AND(NOT(C), D))",
    "XOR(B, C, D)",
    "XOR(AND(B, C), AND(B, D), AND(C, D))",
    "XOR(B, C, D)"
  ];

  #msgFunctionList: string[] = [
    "NONE",
    "ROTL(XOR(T, E, F, S), 1)", // 1st letters of 3, 8, 14, 16
  ];

  // Only one not requiring expansion, private purely for consistency
  #otherFunctionList: string[] = [
    "ROTL(W1, 5)",
    "ROTL(W2, 30)",
    "ADDMOD232(W1, W2)"
  ];

  #roundConstantList: string[] = [
    "5A827999",
    "6ED9EBA1",
    "8F1BBCDC",
    "CA62C1D6"
  ];

  startValue = "67452301EFCDAB8998BADCFE10325476C3D2E1F0";
  rounds = 80;
  
  // The function changes every 20 rounds out of 80
  fFunctions = Array.from({ length: this.rounds }, (_, index) => {
    const itemIndex = Math.floor(index / (this.rounds / this.#fFunctionList.length));
    return this.#fFunctionList[itemIndex];
  });

  // Can only take the n-16th word for n ∈ [16, 80], else do nothing
  msgFunctions = Array.from({ length: this.rounds }, (_, index) => {
    return this.#msgFunctionList[index < 16 ? 0 : 1];
  });

  // No change (bit shift and add mod 2^32)
  otherFunctions = this.#otherFunctionList;

  // The value changes every 20 rounds out of 80
  roundConstants =  Array.from({ length: this.rounds }, (_, index) => {
    // Math.floor(index / 20) switches items every 20 elements
    const itemIndex = Math.floor(index / (this.rounds / this.#roundConstantList.length));
    return this.#roundConstantList[itemIndex];
  });
}
  
export { SHA1 };