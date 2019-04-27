# Textual Healing

Textual Healing is a text generator for Javascript. It generates texts with
simple replacements and filters. It is seedable, so that the generated result is
predictable given a specific combination of filters, seed & data.

Under the hood, Textual Healing uses [Prando](https://www.npmjs.com/package/prando).

## How to use

Install the package if you haven't already:

```javascript
npm i --save textual-healing
```

First, you're going to need some data:

```javascript
const data = {
  "bread": [ // This is a group of bread-like foods
    "sandwich",
    "pizza",
    "cake",
    "burrito"
  ],
  "kind": [ // This is a group of kinds of aforementioned foods
    "pepperoni",
    "veggie",
    "fish",
    "cheese",
    "chocolate",
    "disappointment"
  ],
  "start": [ // This is what a basic pattern looks like
    "{kind} {bread}"
  ]
}
```

Now given this data, create a new instance of TextualHealing:

```javascript
const TextualHealing = require("textual-healing");

const t = new TextualHealing(data);
```

Enjoy:

```javascript
t.start(); // 'fish pizza'
t.start(); // 'pepperoni sandwich'
t.start(); // 'disappointment cake'
…
```

## Advanced usage

Groups can be combined. For example the pattern `{bread|kind}` will return an
item from either the group `bread` or `kind`. This works by concating the groups
and then choosing an item at random (so it's not a 50:50 split necessarily).

There are also filters which can be used. By default there are a few filters
useful in the English language. For example the pattern `{bread:pl}` will return
"pizzas", "cakes", "sandwiches" or "burritos".

Another fun thing to try is to have recursive patterns. For example, if the
pattern `bread` contained `{bread} {bread}`, expect to find yourself some "pizza
cake", "sandwich burrito" or even "pizza cake cake pizza".

Check out the very short source code for more info.
