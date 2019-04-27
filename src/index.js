const Prando = require("prando");

const REPLACE_PATTERN = /{([A-z!:|]+)}/;
const FILTER_SEPARATOR = ":";
const UNION_SEPARATOR = "|";

function filterWarning(str) {
  return s => {
    // eslint-disable-next-line
    console.warn(`Filter not found: ${ str }`);
    return s;
  };
}

const defaultFilters = {
  "definite": str => "the " + str,
  "indefinite": str => (str.match(/^[haeiuo]/i) ? "an " : "a ") + str,
  "capitalize": str => str[0].toUpperCase() + str.slice(1),
  "pl": str => {
    if (str.match(/[osh]$/)) {
      return str + "es";
    } else if (str.length === 3 && str.match(/y$/)) {
      return str.slice(0, str.length - 1) + "ies";
    }

    return str + "s";
  },
};

class TextualHealing {
  constructor(data, seed, filters = defaultFilters) {
    this.generator = new Prando(seed);
    this.seed = this.generator._seed;
    this.filters = filters;
    this.data = data;
  }

  getGroup(groupName) {
    const name = groupName.toLowerCase();
    if (this.data[name] !== undefined) {
      return this.data[name];
    }

    throw new Error(`Unknown group: ${ groupName }`);
  }

  generate(pattern) {
    // Select pattern
    while (pattern.search(REPLACE_PATTERN) !== -1) {
      const matchGroup = pattern.match(REPLACE_PATTERN);
      const t = matchGroup[0]; // {token}
      const base = matchGroup[1]; // token

      const firstFilterColon = base.indexOf(FILTER_SEPARATOR);

      const tokenGroups = (firstFilterColon === -1 ? base : base.slice(0, firstFilterColon))
        .split(UNION_SEPARATOR);
      const tokenGroupsArray = tokenGroups.map(e => this.getGroup(e))
        .reduce((a, b) => a.concat(b));

      const requestedFilters = base.split(FILTER_SEPARATOR).slice(1)
        .map(str => str.trim().toLowerCase());
      const filters = requestedFilters.map(f => this.filters[f] || filterWarning(f));

      const result = this.generate(this.generator.nextArrayItem(tokenGroupsArray));

      pattern = pattern.replace(
        t,
        // Run all the filters
        filters.reduce((accumulator, fn) => fn(accumulator), result)
      );
    }

    return pattern;
  }

  start(chainStarter = "start") {
    const pattern = this.generator.nextArrayItem(this.data[chainStarter]);
    return this.generate(pattern);
  }
}

module.exports = TextualHealing;

