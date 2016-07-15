'use strict';
import debug from 'debug';
let db = debug('createGenerator');
let count = 1;

// types
import { BOOLEAN_TYPE, LIST_TYPE, OBJECT_TYPE, VALUE_TYPE, INITIAL_INDEX, BOOLEAN_VALUES } from './constants';

class Generator {
    constructor (type, values) {
        this.debug = debug(type.charAt(0).toUpperCase() + type.slice(1) + 'Gen:' + count++);
        this.debug('constructor', type, values);

        if (!values || values.length === 0) {
            throw 'error: lists must have value nodes'
        }

        this.type = type;
        this.values = values;
        this.index = INITIAL_INDEX;
    }
    type () {
        return this.type;
    }
    hasNext () {
        var hasNext = (this.index < this.values.length - 1);
        this.debug('hasNext: ', hasNext);
        return hasNext;
    }
    next () {
        this.debug('next ', this.index + 1);
        this.index++;
    }
    update () {
        this.next();
    }

    reset () {
        this.debug('reset');
        this.index = INITIAL_INDEX;
    }
    get () {
        var val = this.values[this.index];
        this.debug('get: ', val);
        return val;
    }
}

class ValueGenerator extends Generator {
    constructor (schema) {
        super(
            'value', 
            schema.type === BOOLEAN_TYPE ? BOOLEAN_VALUES : schema.values
        )
    }
}

class ObjectGenerator extends Generator {
    constructor (data) {
        var schema = data.schema;
        var keys = Object.keys(schema);

        let values = keys.map(schm => {
            return GeneratorFactory(schema[schm]);
        });

        super(data.type, values);
        this.keys = keys;
    }

    hasNext () {
        var hasNext = false;
        var values = this.values;

        for (var i = 0, len = values.length; i < len; i++) {
            if (values[i].hasNext()) {
                hasNext = true;
                break;
            }
        }

        this.debug('@hasNext: ', hasNext);
        return hasNext;
    }

    get () {
        if (!this.values || this.values.length === 0) {
            throw 'error: objects must have value nodes'
        }
        var val = {};
        var keys = this.keys;
        
        this.values.forEach((itm, index) => {
            debug(itm);
            val[keys[index]] = itm.get();
        });

        this.debug('get', val);

        return val;
    }

    update (index) {
        index = index || 0;
        var itm = this.values[index];
        this.debug('update', itm);

        if (!itm) {
            return;
        }

        if (itm.hasNext()) {
            if (itm.type === VALUE_TYPE) {
                itm.next();
            } else {
                itm.update();
            } 
        } else {
            itm.reset();
            this.update(index + 1);
        }
    }

    reset () {
        this.values.forEach((itm) => {
            itm.reset();
        });
    }
}

class ListGenerator extends ObjectGenerator {
    constructor (data) {
        super(data);
        this.debug('constructor', data);
    }

    get () {
        var val = [];
        
        this.values.forEach(itm => {
            val.push(itm.get());
        });

        this.debug('get ', val);
        return val;
    }
}

function GeneratorFactory (data) {
    var type = data.type;
    db('Factory: type', type);
    if (type === BOOLEAN_TYPE || type === VALUE_TYPE) {
        return new ValueGenerator(data);
    } else if (type === LIST_TYPE) {
        return new ListGenerator(data);
    } else if (type === OBJECT_TYPE) {
        return new ObjectGenerator(data);
    } else {
        throw 'Invalid type: ' + type;
    }
}

module.exports = GeneratorFactory;