/* global require, before, describe, it */
/* jshint -W030, -W097 */

import validate from '../src/validate';
import {expect} from 'chai';

describe('validate.js', function () {
    describe('valid schema', function () {
        it('should validate boolean type', function () {
            return validate({
                type: 'boolean'
            });
        });
        it('should validate value type', function () {
            return validate({
                type: 'value',
                values: [1,2,3]
            });
        });
        it('should validate object type', function () {
            return validate({
                type: 'object',
                schema: {
                    foo: {
                        type: 'value',
                        values: ['foo', 'bar']
                    }
                }
            });
        });
        it('should validate list type', function () {
            return validate({
                type: 'list',
                schema: {
                    foo: {
                        type: 'value',
                        values: ['foo', 'bar']
                    }
                }
            });
        });
    });

    describe('bad schema', function () {
        it('should handle bad types', function () {
            return validate({
                type: 'blah'
            }).then(undefined, (err) => {
                expect(err).to.equal('Invalid Type: blah');
            });
        });
        it('should handle empty values', function () {
            return validate({
                type: 'value'
            }).then(undefined, (err) => {
                expect(err).to.equal('Property "values" must be defined for type "value"');
            });
        });

        describe('@object type', function () {
            it('should handle missing schema', function () {
                return validate({
                    type: 'object'
                    // schema: {}
                }).then(undefined, (err) => {
                    expect(err).to.equal('Property "schema" must be defined');
                });
            });
            it('should handle bad child schema #1', function () {
                return validate({
                    type: 'object',
                    schema: {
                        foo: {
                            type: 'value'
                        }
                    }
                }).then(undefined, (err) => {
                    expect(err).to.equal('object with key foo => Property "values" must be defined for type "value"');
                });
            });
            it('should handle bad child schema #2', function () {
                return validate({
                    type: 'object',
                    schema: {
                        foo: {
                            type: 'value',
                            values: [1,2,3]
                        },
                        bar: {
                            type: 'mytype'
                        }
                    }
                }).then(undefined, (err) => {
                    expect(err).to.equal('object with key bar => Invalid Type: mytype');
                });
            });

            it('should handle bad child schema #3', function () {
                return validate({
                    type: 'object',
                    schema: {
                        foo: {
                            type: 'object',
                            schema: {
                                bar: {
                                    type: 'value'
                                }
                            }
                        }
                    }
                }).then(undefined, (err) => {
                    expect(err).to.equal('object with key foo => ' + 
                        'object with key bar => Property "values" must be defined for type "value"');
                });
            });
        });
        describe('@list type', function () {
            it('should handle missing schema', function () {
                return validate({
                    type: 'list'
                    // schema: {
                    //     foo: {
                    //         type: 'value',
                    //         values: ['foo', 'bar']
                    //     }
                    // }
                }).then(undefined, (err) => {
                    expect(err).to.equal('Property "schema" must be defined');
                });
            });
            it('should handle bad child schema', function () {
                return validate({
                    type: 'list',
                    schema: {
                        foo: {
                            type: 'value'
                        }
                    }
                }).then(undefined, (err) => {
                    expect(err).to.equal('list with key foo => Property "values" must be defined for type "value"');
                });
            });
        })
    });

});