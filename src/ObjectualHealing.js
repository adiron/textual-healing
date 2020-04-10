const Prando = require("prando");
const getProp = require("lodash.get");
const { pickNFromArray } = require("./random");

const OPERATIONS = {
  $pick(o, generator) {
    if (typeof o.$pick__amount !== "undefined") {
      // An amount was specified.
      const amount = Array.isArray(o.$pick__amount)
        ? generator.nextInt(...o.$pick__amount)
        : o.$pick__amount;
      return pickNFromArray(generator, o.$pick, amount);
    }
    return generator.nextArrayItem(o.$pick);
  },
  $randInt(o, generator) {
    return generator.nextInt(...o.$randInt);
  },
  $ref(o, _, data) {
    return getProp(data, o.$ref);
  },
};

const OPERATION_NAMES = Object.keys(OPERATIONS);

function hasOneOfNestedKeys(object, matchingKeys) {
  if (typeof object !== "object") {
    return false;
  }

  if (Array.isArray(object)) {
    return object.some(element => hasOneOfNestedKeys(element, matchingKeys));
  }

  const objectKeys = Object.keys(object);

  if (objectKeys.some(key => matchingKeys.indexOf(key) !== -1)) {
    return true;
  }

  return objectKeys.some(key => hasOneOfNestedKeys(object[key], matchingKeys));
}

function mapObjectValues(object, predicate) {
  const o = {};
  Object.keys(object).forEach(
    key => {
      o[key] = predicate(object[key]);
    }
  );
  return o;
}

class ObjectualHealing {
  constructor(data, seed, filters = {}) {
    this.generator = new Prando(seed);
    this.seed = this.generator._seed;
    this.filters = filters;
    this.data = data;
  }

  parseObject(patternObject) {
    const keys = Object.keys(patternObject);
    // Loop through the keys and check if there's an operation
    for (const key of keys) {
      if (OPERATION_NAMES.indexOf(key) !== -1) {
        return this.parseObject(OPERATIONS[key](patternObject, this.generator, this.data));
      }
    }

    // There isn't an operation here
    if (hasOneOfNestedKeys(patternObject, OPERATION_NAMES)) {
      return mapObjectValues(patternObject, value => this.parseObject(value));
    }
    return patternObject;

  }

  generate(patternObject) {
    return this.parseObject(patternObject);
  }

  start(chainStarter = "start") {
    return this.generate(this.data[chainStarter]);
  }
}

module.exports = ObjectualHealing;
