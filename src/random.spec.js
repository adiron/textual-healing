const { shuffleArray, pickNFromArray } = require("./random");
const Prando = require("prando");

describe("Random utility functions", () => {
  test("shuffleArray", () => {

    const baseArray = Array(1000).fill(null)
      .map((e, i) => i);
    const shuffled = shuffleArray(new Prando("control seed"), baseArray);
    expect(shuffled).not.toEqual(baseArray);
    expect(shuffled.slice().sort((a, b) => a - b)).toEqual(baseArray);
  });

  test("pickNFromArray", () => {
    expect(pickNFromArray(new Prando(), [ 1 ], 4).length).toBe(1);

    const baseArray = Array(1000).fill(null)
      .map((e, i) => i);
    expect(pickNFromArray(new Prando(), baseArray, 4).length).toBe(4);
    expect(pickNFromArray(new Prando("control seed"), baseArray, 4)).not.toEqual(baseArray.slice(0, 4));

    const uniqueCheck = Array.from(new Set(pickNFromArray(new Prando(), baseArray, 300)));
    expect(uniqueCheck.length).toBe(300);
  });
});
