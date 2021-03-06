const TextualHealing = require("./TextualHealing.js");


const pizzaData = {
  "bread": [
    "sandwich",
    "pizza",
    "cake",
    "burrito",
  ],
  "kind": [
    "pepperoni",
    "veggie",
    "fish",
    "cheese",
    "chocolate",
    "disappointment",
  ],
  "start": [
    "{kind} {bread}",
  ],
};

describe("TextualHealing class and sanity checks", () => {
  test("instantiates", () => {
    const t = new TextualHealing({});
    expect(t).toBeInstanceOf(TextualHealing);
  });

  test("seed is properly set", () => {
    const s = 1234538;
    const t = new TextualHealing({}, s);
    expect(t.seed).toBe(s);
  });
});

describe("Text expansion", () => {
  test("expands a simple token string", () => {
    const t = new TextualHealing({
      "start": [ "{a} {b}" ],
      "a": [ "a" ],
      "b": [ "b" ],
    });
    expect(t.start()).toBe("a b");
  });

  test("simple expansion (with random seed)", () => {
    const t = new TextualHealing(pizzaData, 1234830);

    const result = (new Array(100)).fill(null)
      .map(() => t.start())
      .join("\n");
    expect(result).toMatchSnapshot();
  });

  test("string returned as-is", () => {
    const t = new TextualHealing(pizzaData);
    expect(t.parseText("hello")).toBe("hello");
  });

  test("union groups", () => {
    const t = new TextualHealing(pizzaData, 1234830);

    const result = (new Array(100)).fill(null)
      .map(() => t.parseText("{kind|bread}"))
      .join("\n");
    expect(result).toMatchSnapshot();
  });

  test("error thrown for invalid groups", () => {
    const t = new TextualHealing(pizzaData);

    expect(() => {
      t.parseText("{thisDoesntExist}");
    }).toThrow();
  });

});

describe("Text expansion filters", () => {
  test("capitalize filter", () => {
    const t = new TextualHealing(pizzaData);
    expect(t.parseText("{start:capitalize}").match(/^[A-Z]/)).toBeTruthy();
  });

  test("pluralize filter", () => {
    const t = new TextualHealing({
      "a": [ "sandwich" ],
      "b": [ "pizza" ],
      "c": [ "fly" ],
    });

    expect(t.parseText("{a:pl}")).toBe("sandwiches");
    expect(t.parseText("{b:pl}")).toBe("pizzas");
    expect(t.parseText("{c:pl}")).toBe("flies");
  });

  test("definite filter", () => {
    const t = new TextualHealing({
      "a": [ "sandwich" ],
    });

    expect(t.parseText("{a:definite}")).toBe("the sandwich");
  });

  test("indefinite filter", () => {
    const t = new TextualHealing({
      "a": [ "sandwich" ],
      "b": [ "hour" ],
    });

    expect(t.parseText("{a:indefinite}")).toBe("a sandwich");
    expect(t.parseText("{b:indefinite}")).toBe("an hour");
  });

  test("custom filters", () => {
    const t = new TextualHealing(
      {
        "a": [ "sandwich" ],
        "b": [ "hour" ],
      },
      undefined,
      {
        "uppercase": s => s.toUpperCase(),
      }
    );

    expect(t.parseText("eating a {a:uppercase}")).toBe("eating a SANDWICH");
    expect(t.parseText("{b:indefinite}")).toBe("hour"); // Graceful failure
  });

  test("multiple filters", () => {
    const t = new TextualHealing({
      "a": [ "sandwich" ],
    });

    expect(t.parseText("{a:definite:pl:capitalize}")).toBe("The sandwiches");
    expect(t.parseText("{a:capitalize:definite:pl}")).toBe("the Sandwiches");
  });

});

describe("Text expansion (tags)", () => {
  test("tags do not alter patterns", () => {
    const t = new TextualHealing({
      "start": [ "{a (pizza)} {b (cake)}" ],
      "a": [ "a" ],
      "b": [ "b" ],
    });
    expect(t.start()).toBe("a b");
  });

  test("can tag and recall tags", () => {
    const t = new TextualHealing({
      "a": [ "disappointment" ],
    });
    const doubleString = t.parseText("{a (0)} {(0)}");
    expect(doubleString).toBe("disappointment disappointment");
  });

  test("can tag and recall tags (advanced)", () => {
    const t = new TextualHealing(pizzaData, 123844);
    const pattern = "I like {kind (theKind)} {bread:pl (theBread)}. Although, I could trade {(theKind)} for {kind (newKind)}. That's right: {(newKind)} {(theBread)}.";
    const result = (new Array(100)).fill(null)
      .map(() => t.parseText(pattern))
      .join("\n");
    expect(result).toMatchSnapshot();
  });

});
