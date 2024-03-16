const { sortPages } = require("./report.js");
const { describe, test, expect } = require("@jest/globals");

describe("sortPages", () => {
  test("sorted descending", () => {
    const inputs = {
      url1: 5,
      url2: 1,
      url3: 3,
      url4: 10,
      url5: 7,
    };

    const actual = sortPages(inputs);
    const expected = [
      ["url4", 10],
      ["url5", 7],
      ["url1", 5],
      ["url3", 3],
      ["url2", 1],
    ];
    expect(actual).toEqual(expected);
  });

  test("null case", () => {
    const input = {};
    const actual = sortPages(input);
    const expected = [];
    expect(actual).toEqual(expected);
  });
});
