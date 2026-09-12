class Config {
  static #fFunctionList: string[] = [
    "OR(AND(B, C), AND(NOT(C), D))",
    "XOR(B, C, D)",
    "XOR(AND(B, C), AND(B, C)",
    "XOR(B, C, D)"
  ];

  static #msgFunctionList: string[] = [
    "NONE",
    "ROTL(XOR(T, E, F, S), 1)" // 1st letters of 3, 8, 14, 16
  ];

  static #otherFunctionList: string[] = [
    // 1st letters of 3, 8, 14, 16
    "ROTL(W1, 5)",
    "ROTL(W2, 30)",
    "ADDMOD232(W1, W2)"
  ];

  static #roundConstantList: string[] = [
    "5A827999",
    "6ED9EBA1",
    "8F1BBCDC",
    "CA62C1D6"
  ]

  static sha1 = {
    startValues: ["67452301", "EFCDAB89", "98BADCFE", "10325476", "0xC3D2E1F0"],
    rounds: 80,
    
    fFunctions: Array.from({ length: 80 }, (_, index) => {
      // Math.floor(index / 20) switches items every 20 elements
      const itemIndex = Math.floor(index / 80 / this.#fFunctionList.length); 
      return this.#fFunctionList[itemIndex];
    }),

    msgFunctions: Array.from({ length: 80 }, (_, index) => {
      return this.#msgFunctionList[index < 16 ? 0 : 1];
    }),

    roundConstants: Array.from({ length: 80 }, (_, index) => {
      // Math.floor(index / 20) switches items every 20 elements
      const itemIndex = Math.floor(index / 80 / this.#roundConstantList.length); 
      return this.#roundConstantList[itemIndex];
    }),
  }
}
  
export { Config };