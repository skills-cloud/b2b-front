const http = require('http');
const https = require('https');
const { mkdirSync, writeFileSync } = require('fs');
const { join, dirname, basename } = require('path');
const Ajv = require('ajv');

const sortKeys = require('./sort-keys');
const config = require('./config.json');

const request = (hostObject) => new Promise((resolve, reject) => {
    console.log('Request: %s');

    https
        .get({
            host              : hostObject.host,
            path              : hostObject.path,
            rejectUnauthorized: false,
            headers           : {
                Cookie: '_sec_=oQ6E3G1G2r9ZdXaKMbC2Doo4L5FWJu9mhSd8CtyloH37iOiW5suD1GjHvGvdMyEs; _id_=rphjo1pey8m4hfc9zsy307reonmqnp6j'
            }
        }, (response) => {
            console.log('Response: %s');
            let buffer = '';

            if(response.statusCode > 200) {
                const errorText = [
                    `request for ${hostObject.host}${hostObject.path}`,
                    `failed with status ${response.statusCode} ${response.statusMessage}`
                ].join(' ');

                reject(new Error(errorText));
            } else {
                response.on('data', (chunk) => {
                    console.log('Response download chunk: %i', chunk.length);
                    buffer += chunk;
                });

                response.on('end', () => {
                    console.log('Response complete: %i', buffer.length);
                    resolve(JSON.parse(buffer));
                });
            }
        })
        .on('error', reject);
});

const writeMapping = (payload) => {
    const path = join(process.cwd(), config['mapping-dir']);
    const mapping = {
        paths: [...new Set(Object.keys(payload.paths))]
    };

    writeFileSync(
        join(path, `mapping.json`),
        JSON.stringify(mapping, null, 4)
    );

    return {
        data: payload,
        mapping
    };
};

const collectSchemas = (payload) => {
    console.log('Collecting schemas...');

    if(payload.mapping.paths) {
        return payload.mapping.paths.reduce((accumulator, key) => {
            if(payload.data.paths[key]) {
                const methods = Object.keys(payload.data.paths[key]);

                for(const method of methods) {
                    const responses = payload.data.paths[key][method].responses;

                    if(responses) {
                        const responsesKeys = Object.keys(responses);

                        for(const responsesKey of responsesKeys) {
                            if(responses[responsesKey]?.schema) {
                                const results = responses[responsesKeys]?.schema?.properties?.results?.items;
                                const schemaItems = responses[responsesKey]?.schema?.items;
                                const schemaProperties = responses[responsesKeys]?.schema?.properties;
                                const schema = responses[responsesKey]?.schema;
                                let schemaPath = responses[responsesKey]?.schema?.items;

                                if(schemaItems) {
                                    schemaPath = schemaItems;
                                } else if(schemaProperties && !results) {
                                    schemaPath = schemaProperties;
                                } else if(results) {
                                    schemaPath = results;
                                } else if(schema) {
                                    schemaPath = schema
                                }

                                if(schemaPath && !accumulator.methods[`${key}/${method}/code-${responsesKey}`]) {
                                    console.log('Collect %s, code: %s', key, responsesKey);

                                    accumulator.methods[`${key}/${method}/code-${responsesKey}`] = schemaPath;
                                }
                            }
                        }
                    }
                }
            }

            return accumulator;
        }, {
            definitions: payload.data.definitions,
            methods    : {}
        });
    }

    console.error('Empty mapping config');

    return {};
};

const normalize = (json) => {
    if(typeof json === 'object' && json !== null) {
        const keys = Object.keys(json);

        for(const key of keys) {
            if(key === 'x-nullable') {
                delete json[key];

                if(json.enum && json.type === 'string') {
                    const item = { ...json };
                    const removeKeys = Object.keys(item);

                    removeKeys.forEach((removeKey) => {
                        delete json[removeKey];
                    });

                    json.oneOf = [{
                        type: "null"
                    }, item];
                } else {
                    json.nullable = true;
                    // TODO разобраться с nullable
                    // const item = { ...json };
                    //
                    // json.oneOf = [{
                    //     type: "null"
                    // }, item];
                }
            } else if(key === 'format') {
                if(json[key] === 'int32' || json[key] === 'float') {
                    delete json[key];
                }
            } else if(key === 'default') {
                delete json[key];
            }

            normalize(json[key]);
        }
    }

    return json;
};

const getDefinitions = (schema, allDefinitions, currentDefinitions) => {
    try {
        let definitions = currentDefinitions || {};
        const schemaKeys = Object.keys(schema);

        for(const schemaKey of schemaKeys) {
            if(schemaKey === '$ref') {
                const definitionKey = schema[schemaKey].split('/').pop();

                if(!definitions[definitionKey]) {
                    definitions[definitionKey] = allDefinitions[definitionKey];

                    definitions = getDefinitions(allDefinitions[definitionKey], allDefinitions, definitions);
                }
            }
        }

        if(schema.allOf) {
            for(const allOfRef of schema.allOf) {
                definitions = getDefinitions(allOfRef, allDefinitions, definitions);
            }
        }

        if(schema.type === 'object' && schema.properties) {
            const keys = Object.keys(schema.properties);

            for(const key of keys) {
                definitions = getDefinitions(schema.properties[key], allDefinitions, definitions);
            }
        }

        if(schema.type === 'array') {
            definitions = getDefinitions(schema.items, allDefinitions, definitions);
        }

        return definitions;
    } catch(error) {
        console.log(error, schema);
    }
};

const collectDefinitions = ({ methods, definitions }) => {
    console.log('Collecting definitions...');

    const keys = Object.keys(methods);

    return keys.reduce((accumulator, key) => {
        const ref = methods[key].$ref;

        if(ref) {
            const definitionKey = ref.split('/').pop();
            const schema = definitions[definitionKey];

            accumulator[key] = {
                definitions: {
                    [definitionKey]: schema,
                    ...getDefinitions(schema, definitions)
                },
                allOf: [{
                    $ref: ref
                }]
            };
        }

        return accumulator;
    }, {});
};

const validateSchemas = (collection) => {
    console.log('Validating schemas...');

    if(typeof collection === 'object') {
        const keys = Object.keys(collection);
        const ajv = new Ajv({
            nullable : true,
            allErrors: true
        });

        for(const key of keys) {
            if(!ajv.validateSchema(collection[key])) {
                console.log('Invalid schema %s', key);
            } else {
                console.log('Schema valid: %s', key);
            }
        }
    }

    return collection;
};

const saveSchemas = (collection) => {
    console.log('Saving schemas...');

    if(typeof collection === 'object') {
        const keys = Object.keys(collection);
        const path = join(process.cwd(), config['save-dir']);

        for(const key of keys) {
            const fileName = basename(key);
            const dirName = dirname(key);

            mkdirSync(join(path, dirName), { recursive: true });

            console.log('Write schema file: %s', fileName);

            writeFileSync(
                join(path, dirName, `${fileName}.json`),
                JSON.stringify(collection[key], null, 4)
            );
        }
    }
};

request(config)
    .then(writeMapping)
    .then(collectSchemas)
    .then(normalize)
    .then(collectDefinitions)
    .then(sortKeys)
    .then(validateSchemas)
    .then(saveSchemas)
    .catch(console.error);
