class SHA1 {
  #fFunctionList: string[] = [
    "OR(AND(B, C), AND(NOT(C), D))",
    "XOR(B, C, D)",
    "XOR(AND(B, C), AND(B, C)",
    "XOR(B, C, D)"
  ];

  #msgFunctionList: string[] = [
    "NONE",
    "ROTL(XOR(T, E, F, S), 1)" // 1st letters of 3, 8, 14, 16
  ];

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
  
  fFunctions = Array.from({ length: this.rounds }, (_, index) => {
    // Math.floor(index / 20) switches items every 20 elements
    const itemIndex = Math.floor(index / this.rounds / this.#fFunctionList.length); 
    return this.#fFunctionList[itemIndex];
  });

  msgFunctions = Array.from({ length: this.rounds }, (_, index) => {
    return this.#msgFunctionList[index < 16 ? 0 : 1];
  });

  otherFunctions = this.#otherFunctionList;

  roundConstants =  Array.from({ length: this.rounds }, (_, index) => {
    // Math.floor(index / 20) switches items every 20 elements
    const itemIndex = Math.floor(index / this.rounds / this.#roundConstantList.length); 
    return this.#roundConstantList[itemIndex];
  });
}
  
export { SHA1 };