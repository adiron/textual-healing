const ObjectiveHealing = require("./ObjectiveHealing");

describe("Generic tree expansion", () => {
  test("basic generic tree returns values as expected", () => {
    const t = new ObjectiveHealing({
      "start": {
        "$pick": [
          { "a": 1 },
        ],
      },
    });

    expect(t.start()).toEqual({ "a": 1 });
  });

  test("arrays returned as-is", () => {
    const t = new ObjectiveHealing({
      "start": {
        "$pick": [
          [ "a", "b", "c" ],
        ],
      },
    });

    expect(t.start()).toEqual([ "a", "b", "c" ]);
  });

  test("nested generic tree with $pick", () => {
    const t = new ObjectiveHealing({
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

  test("multiple items with $pick", () => {
    const t = new ObjectiveHealing({
      "start": {
        "$pick": [
          {
            "pizza": { "$pick": [
              "tasty", "amazing", "disgusting", "interesting", "neutral", "I don't know",
            ],
            "$pick__amount": 2 },
            "fennel": { "$pick": { "$ref": "tastes" },
              "$pick__amount": [ 1, 2 ] },
          },
        ],
      },
      "tastes": [
        "tasty", "amazing", "disgusting", "interesting", "neutral", "I don't know",
      ],
    });

    const result = t.start();
    expect(result.pizza.length).toEqual(2);
    expect(result.fennel.length).toBeLessThan(3);
  });

  test("nested generic tree with $pick (multi level)", () => {
    const t = new ObjectiveHealing({
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
    const t = new ObjectiveHealing({
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

  test("$ref properly accesses data", () => {
    const t = new ObjectiveHealing({
      "start": {
        "name": "pizza",
        "price": {
          "$ref": "pizzaPrice",
        },
        "priceAgain": {
          "$ref": "pizzaPrice",
        },
        "size": {
          "$ref": "pizzaKinds.small",
        },
      },
      "pizzaPrice": 12,
      "pizzaKinds": {
        "small": {
          "$pick": [
            "s",
          ],
        },
      },
    });

    expect(t.start().price).toBe(12);
    expect(t.start().priceAgain).toBe(12);
    expect(t.start().size).toBe("s");


  });


});
