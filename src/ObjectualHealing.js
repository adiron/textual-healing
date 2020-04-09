const Prando = require("prando");

const OPERATIONS = [
  "$pick",
];

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
    if (keys.indexOf("$pick") !== -1) {
      return this.parseObject(this.generator.nextArrayItem(patternObject.$pick));
    }

    if (hasOneOfNestedKeys(patternObject, OPERATIONS)) {
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
