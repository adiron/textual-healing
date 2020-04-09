const Prando = require("prando");

// Text expansion constants
const REPLACE_PATTERN = /{([A-z!:|]+)?( ?\(([A-z0-9]+)\))?}/;
const TAG_RECALL_PATTERN = /{\(([A-z0-9]+)\)}/;
const FILTER_SEPARATOR = ":";
const UNION_SEPARATOR = "|";


function filterWarning(str) {
  return s => {
    // eslint-disable-next-line
    console.warn(`Filter not found: ${ str }`);
    return s;
  };
}

const defaultTextFilters = {
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
  constructor(data, seed, filters = defaultTextFilters) {
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

  /**
   * Parse a text string
   * @param {String} pattern The base pattern
   * @param {Object} tags Any saved patterns (for later recall)
   * @returns {String} output
   */
  parseText(pattern, tags = {}) {
    // Select pattern
    while (pattern.search(REPLACE_PATTERN) !== -1) {

      // Recall groups are groups that only recall tags. For example:
      // {(0)}
      // {(iceCreamFlavor)}

      const matchGroup = pattern.match(REPLACE_PATTERN);

      const t = matchGroup[0]; // {token}
      const base = matchGroup[1]; // token
      const tag = matchGroup[3]; // Tag, if any;

      // No base and a tag, means this is tag recall
      if (!base && tag) {
        // Doing recall
        const recallMatchGroup = matchGroup[0].match(TAG_RECALL_PATTERN);
        const requestedTag = recallMatchGroup[1];

        // Throw errors about unknown tags:
        if (tags[requestedTag] === undefined) {
          throw new Error(`Unknown tag: ${ requestedTag }`);
        }

        // Finally do the replacement
        pattern = pattern.replace(
          TAG_RECALL_PATTERN, tags[requestedTag],
        );
      } else {

        const firstFilterColon = base.indexOf(FILTER_SEPARATOR);

        const tokenGroups = (firstFilterColon === -1 ? base : base.slice(0, firstFilterColon))
          .split(UNION_SEPARATOR);
        const tokenGroupsArray = tokenGroups.map(e => this.getGroup(e))
          .reduce((a, b) => a.concat(b));

        const requestedFilters = base.split(FILTER_SEPARATOR).slice(1)
          .map(str => str.trim().toLowerCase());
        const filters = requestedFilters.map(f => this.filters[f] || filterWarning(f));

        const result = this.parseText(this.generator.nextArrayItem(tokenGroupsArray), tags);
        const resultAfterFilters = filters.reduce((accumulator, fn) => fn(accumulator), result);

        // If a tag needs to be saved, save it
        if (tag !== undefined) {
          tags[tag] = resultAfterFilters;
        }

        pattern = pattern.replace(
          t,
          // Run all the filters
          resultAfterFilters
        );
      }

    }

    return pattern;
  }

  generate(patternObject) {
    return this.parseText(this.generator.nextArrayItem(patternObject));
  }

  start(chainStarter = "start") {
    return this.generate(this.data[chainStarter]);
  }
}

module.exports = TextualHealing;

