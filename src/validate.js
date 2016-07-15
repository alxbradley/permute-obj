'use strict';
import { BOOLEAN_TYPE, LIST_TYPE, OBJECT_TYPE, VALUE_TYPE, INITIAL_INDEX, BOOLEAN_VALUES } from './constants';
import async from 'async';

function validType (type) {
    return [BOOLEAN_TYPE, LIST_TYPE, OBJECT_TYPE, VALUE_TYPE].indexOf(type) >= 0;
}

function validateSchema (schema, cb) {
    setImmediate(function validateSchemaFn() {
        var err = null;
        var type = schema.type;
        var isBooleanType = (type === BOOLEAN_TYPE);
        var isValueType = (type === VALUE_TYPE || isBooleanType);
        var tasks;

        if (!type || !validType(type)) {
            err = 'Invalid Type: ' + type;
        } else if (!isValueType) {
            if (schema.hasOwnProperty('schema')) {
                tasks = {};
                Object.keys(schema.schema).forEach(function schemaIterator(key) {
                    tasks[key] = function (callback) {
                        validateSchema(schema.schema[key], function schemaKey(err) {
                            if (err) {
                                err = [type, 'with key', key, '=>', err].join(' ');
                                callback(err);
                            } else {
                                callback(null);
                            }
                        });
                    };
                });
            } else {
                err = 'Property "schema" must be defined';
            }
            
        } else if (!schema.hasOwnProperty('values') && !isBooleanType) {
            err = 'Property "values" must be defined for type "value"';
        }

        if (tasks) {
            async.parallel(tasks, cb);
        } else {
            cb(err);
        }
    });
}

module.exports = function validate(schema) {
    return new Promise((fulfill, reject) => {
        validateSchema(schema, function (err) {
            if (err) {
                reject(err);
            } else {
                fulfill();
            }
        });
    });
};