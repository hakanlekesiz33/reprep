
const phoneNumberMask = [
    // "(",
    // "+",
    // "9",
    // "0",
    // ")",
    // " ",
    "(",
    /[1-9]/,
    /\d/,
    /\d/,
    ")",
    " ",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    "-",
    /\d/
  ];

export default phoneNumberMask;
  