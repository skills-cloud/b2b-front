const isPlainObject = require('./is-plain-object');

const defaultSortFn = (a, b) => a.localeCompare(b);

const sort = (source, comparator) => {
    let output;

    if(Array.isArray(source)) {
        return source.sort().map((item) => sort(item, comparator || defaultSortFn));
    }

    if(isPlainObject(source)) {
        output = {};

        Object.keys(source).sort(comparator || defaultSortFn).forEach((key) => {
            const clearedKey = key.replace(/[\{|\}]/g, '');

            output[clearedKey] = sort(source[key], comparator);
        });

        return output;
    }

    return source;
};

module.exports = sort;
