export interface INormalizeObject {
    [key: string]: unknown
}

export interface INormalizeRules {
    allowEmptyArrays?: boolean,
    allowFalseBooleans?: boolean
}

const defaultRules: INormalizeRules = {
    allowEmptyArrays  : true,
    allowFalseBooleans: true
};

export const normalizeObject = (clearingObject: INormalizeObject, rules: INormalizeRules = defaultRules): INormalizeObject => {
    const keys: Array<string> = Object.keys(clearingObject);
    const clearedObject: INormalizeObject = {};

    if(keys.length) {
        keys.forEach((key) => {
            const prop = clearingObject[key];

            if(String(prop) !== 'null' && typeof prop !== 'undefined') {
                if(Array.isArray(prop) && !prop.length && !rules.allowEmptyArrays) {
                    return null;
                }

                if(typeof prop === 'string' && prop.length === 0) {
                    return null;
                }

                if(typeof prop === 'boolean' && !prop && !rules.allowFalseBooleans) {
                    return null;
                }

                if(prop === 'true' || prop === 'false') {
                    return (clearedObject[key] = prop === 'true');
                }

                clearedObject[key] = prop;
            }
        });
    }

    return clearedObject;
};
