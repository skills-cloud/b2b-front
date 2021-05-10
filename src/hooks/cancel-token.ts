import { useMemo } from 'react';
import axios, { CancelToken, CancelTokenSource } from 'axios';
import { v4 as uuid } from 'uuid';

export interface IReturnInterface {
    remove(): boolean,
    ['new'](): CancelToken,
    get(): CancelTokenSource | void
}

class RequestCancelToken {

    private tokens: Map<string, CancelTokenSource> = new Map();

    create = (key?: string) => {
        let uid = key;

        if(!uid) {
            uid = uuid();
        }

        if(this.tokens.has(uid)) {
            console.warn('Cancel token is `%s` duplicate!', uid);
        }

        this.tokens.set(uid, axios.CancelToken.source());

        return {
            remove: this.remove.bind(this, uid),
            new   : this.new.bind(this, uid),
            get   : this.get.bind(this, uid)
        };
    };

    private remove(key: string): boolean {
        const token = this.tokens.get(key);

        if(token) {
            token.cancel(`Token '${key}' canceled`);

            this.tokens.delete(key);
        }

        return true;
    }

    private new(key: string): CancelToken {
        const token = this.tokens.get(key);
        const result = axios.CancelToken.source();

        if(token) {
            this.remove(key);
        }

        this.tokens.set(key, result);

        return result.token;
    }

    private get(key: string): CancelTokenSource | void {
        return this.tokens.get(key);
    }
}

const requestCancelToken = new RequestCancelToken();

export const useCancelToken = () => useMemo(requestCancelToken.create, []);

export const useCancelTokens = (count = 1) => useMemo(() => {
    const result = [];

    for(let i = 0; i < count; i++) {
        result.push(requestCancelToken.create());
    }

    return result;
}, []);

export default requestCancelToken;
