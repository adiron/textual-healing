const ObjectualHealing = require("./ObjectualHealing");

describe("Generic tree expansion", () => {
  test("basic generic tree returns values as expected", () => {
    const t = new ObjectualHealing({
      "start": {
        "$pick": [
          { "a": 1 },
        ],
      },
    });

    expect(t.start()).toEqual({ "a": 1 });
  });

  test("arrays returned as-is", () => {
    const t = new ObjectualHealing({
      "start": {
        "$pick": [
          [ "a", "b", "c" ],
        ],
      },
    });

    expect(t.start()).toEqual([ "a", "b", "c" ]);
  });

  test("nested generic tree with $pick", () => {
    const t = new ObjectualHealing({
      "start": {
        "$pick": [
          {
            "pizza": { "$pick": [ "tasty" ] },
            "fennel": { "$pick": [ "disgusting" ] },
          },
        ],
      },
    });

    expect(t.start()).toEqual({
      "pizza": "tasty",
      "fennel": "disgusting",
    });
  });

  test("nested generic tree with $pick (multi level)", () => {
    const t = new ObjectualHealing({
      "start": {
        "$pick": [
          {
            "pizza": { "$pick": [ {
              "$pick": [ {
                "$pick": [ {
                  "$pick": [
                    "tasty",
                  ],
                } ],
              } ],
            } ] },
            "fennel": { "$pick": [ "disgusting" ] },
          },
        ],
      },
    });

    expect(t.start()).toEqual({
      "pizza": "tasty",
      "fennel": "disgusting",
    });

  });

  test("$randInt operation works as expected", () => {
    const t = new ObjectualHealing({
      "start": {
        "name": "pizza",
        "price": {
          "$randInt": [ 90, 100 ],
        },
      },
    });

    for (let i = 0; i < 1000; i++) {
      const { price, name } = t.start();
      expect(price).toBeGreaterThanOrEqual(90);
      expect(price).toBeLessThanOrEqual(100);
      expect(name).toBe("pizza");
    }

  });
});
