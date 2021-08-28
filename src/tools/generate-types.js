const { writeFileSync, mkdirSync, readdirSync, existsSync, statSync } = require('fs');
const { basename, dirname, join } = require('path');
const { compile } = require('json-schema-to-typescript');

const PATH_SOURCE = '/src/adapters/schemas';
const PATH_OUT = '/src/adapters/types';

const collectFiles = (path, result = []) => {
    const currentPath = join(process.cwd(), path);

    if(existsSync(currentPath)) {
        const dirs = readdirSync(currentPath);

        if(dirs) {
            for(const dir of dirs) {
                const stat = statSync(join(currentPath, dir));

                if(stat.isDirectory()) {
                    collectFiles(join(path, dir), result);
                } else if(stat.isFile()) {
                    console.log('Collect file: %s', join(path, dir));
                    result.push(join(path, dir));
                }
            }
        }
    }

    return result;
};

const additionalProperties = (json) => {
    if(typeof json === 'object' && !Array.isArray(json)) {
        if(json.type === 'object') {
            json.additionalProperties = false;
        }

        const keys = Object.keys(json);

        for(const key of keys) {
            additionalProperties(json[key]);
        }
    }
};

const files = collectFiles(PATH_SOURCE);

if(files) {
    for(const file of files) {
        console.log('Compile schema to types file: %s', file);

        try {
            const json = require(join(process.cwd(), file));

            additionalProperties(json);

            compile(json, basename(file, '.json'), {
                style: {
                    printWidth : 600,
                    singleQuote: true,
                    tabWidth   : 4
                }
            })
                .then((ts) => {
                    const dirName = dirname(join(process.cwd(), PATH_OUT, file.replace(PATH_SOURCE, '')));
                    const fileName = basename(file, '.json');

                    mkdirSync(dirName, { recursive: true });
                    console.log('Write file `%s`', join(dirName, `${fileName}.ts`));
                    writeFileSync(
                        join(dirName, `${fileName}.ts`),
                        ts
                    );
                })
                .catch((error) => {
                    console.log('FileName: ', file);
                    console.error(error);
                });
        } catch(e) {
            console.log(e);
        }
    }
}
