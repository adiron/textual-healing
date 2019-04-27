const TextualHealing = require("./index.js");


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


test("instantiates", () => {
  const t = new TextualHealing({});
  expect(t).toBeInstanceOf(TextualHealing);
});

test("seed is properly set", () => {
  const s = 1234538;
  const t = new TextualHealing({}, s);
  expect(t.seed).toBe(s);
});

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

test("capitalize filter", () => {
  const t = new TextualHealing(pizzaData);
  expect(t.generate("{start:capitalize}").match(/^[A-Z]/)).toBeTruthy();
});

test("pluralize filter", () => {
  const t = new TextualHealing({
    "a": [ "sandwich" ],
    "b": [ "pizza" ],
    "c": [ "fly" ],
  });

  expect(t.generate("{a:pl}")).toBe("sandwiches");
  expect(t.generate("{b:pl}")).toBe("pizzas");
  expect(t.generate("{c:pl}")).toBe("flies");
});

test("definite filter", () => {
  const t = new TextualHealing({
    "a": [ "sandwich" ],
  });

  expect(t.generate("{a:definite}")).toBe("the sandwich");
});

test("indefinite filter", () => {
  const t = new TextualHealing({
    "a": [ "sandwich" ],
    "b": [ "hour" ],
  });

  expect(t.generate("{a:indefinite}")).toBe("a sandwich");
  expect(t.generate("{b:indefinite}")).toBe("an hour");
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

  expect(t.generate("eating a {a:uppercase}")).toBe("eating a SANDWICH");
  expect(t.generate("{b:indefinite}")).toBe("hour"); // Graceful failure
});

test("multiple filters", () => {
  const t = new TextualHealing({
    "a": [ "sandwich" ],
  });

  expect(t.generate("{a:definite:pl:capitalize}")).toBe("The sandwiches");
  expect(t.generate("{a:capitalize:definite:pl}")).toBe("the Sandwiches");
});

test("union groups", () => {
  const t = new TextualHealing(pizzaData, 1234830);

  const result = (new Array(100)).fill(null)
    .map(() => t.generate("{kind|bread}"))
    .join("\n");
  expect(result).toMatchSnapshot();
});

test("error thrown for invalid groups", () => {
  const t = new TextualHealing(pizzaData);

  expect(() => {
    t.generate("{thisDoesntExist}");
  }).toThrow();
});

test("string returned as-is", () => {
  const t = new TextualHealing(pizzaData);
  expect(t.generate("hello")).toBe("hello");
});
