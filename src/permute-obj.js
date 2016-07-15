'use strict';
let debug = require('debug')('permute-obj');

import createGenerator from './createGenerator';
import validate from './validate';

function init (schema) {
    
    var generator = createGenerator(schema);
    debug('init: ', generator);

    var get = function () {
        var val;
        if (generator.hasNext()) {
            debug('init: next');
            val = generator.get();
            generator.update();
        } else {
            debug('init: nothing found');
        }
        return val;
    };

    return {
        get: get
    };
}

module.exports = {
    init: init
};