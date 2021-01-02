/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */
import Stream from './stream';

/**
 * Buffered stream class
 */
class BufferedStream extends Stream {
    constructor(source) {
        super();
        this.source = source;
        this.cache = {};
    }

    location(index) {
        return this.source.location(index);
    }

    // BufferedStream 'a => unit -> boolean
    endOfStream(index) {
        return this.source.endOfStream(index);
    }

    // override, BufferedStream 'a => number -> Try 'a
    get(index) {
        var self = this;

        if (!self.cache[index]) {
            self.cache[index] = self.source.get(index);
        }

        return self.cache[index];
    }

    lineAt(offset) {
        return this.source.lineAt(offset)
    }

}

function factory(source) {
    return new BufferedStream(source);
}

export default factory;
