const Prando = require("prando");

const OPERATIONS = {
  $pick(o, generator) {
    return generator.nextArrayItem(o.$pick);
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
        return this.parseObject(OPERATIONS[key](patternObject, this.generator));
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
