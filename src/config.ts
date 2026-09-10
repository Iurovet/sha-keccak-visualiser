class Config {
  static sha1 = {
    startValues: ["67452301", "EFCDAB89", "98BADCFE", "10325476", "0xC3D2E1F0"],
    
    rounds: 80,

    function: {
      "0": "OR(AND(B, C), AND(NOT(C), D))",
      "20": "XOR(B, C, D)",
      "40:": "XOR(AND(B, C), AND(B, C)",
      "60:": "XOR(B, C, D)"
    },

    roundConstant: {
      "0": "5A827999",
      "20": "6ED9EBA1",
      "40:": "8F1BBCDC",
      "60:": "CA62C1D6"
    }
  }
}
  
export { Config };