/* global require, before, describe, it */
/* jshint -W030, -W097 

import permuteObj from '../src/permute-obj';
import {expect} from 'chai';

describe('permute-obj', () => {
    describe('value type', () => {
        it('should generate boolean values', () => {
            var po = permuteObj.init({type: 'boolean'});
            expect(po.get()).to.be.true;
            expect(po.get()).to.be.false;
            expect(po.get()).to.be.undefined;
        });

        it('should generate values', () => {
            var po = permuteObj.init({
                type: 'value',
                values: ['a', 'b', 'c']
            });

            expect(po.get()).to.equal('a');
            expect(po.get()).to.equal('b');
            expect(po.get()).to.equal('c');
            expect(po.get()).to.be.undefined;
        });
    });

    describe('list type', () => {
        it('should generate a list of values', () => {
            var po = permuteObj.init({
                type: 'list',
                schema: {
                    foo: {
                        type: 'value',
                        values: ['a', 'b']
                    }
                }
            });

            expect(po.get()).to.deep.equal(['a']);
            expect(po.get()).to.deep.equal(['b']);
        });

        it('should generate a list of values (multiple)', () => {
            var po = permuteObj.init({
                type: 'list',
                schema: {
                    foo: {
                        type: 'value',
                        values: ['a', 'b']
                    },
                    bar: {
                        type: 'value',
                        values: [1, 2]
                    }
                }
            });

            expect(po.get()).to.deep.equal(['a', 1]);
            expect(po.get()).to.deep.equal(['b', 1]);
            expect(po.get()).to.deep.equal(['a', 2]);
            expect(po.get()).to.deep.equal(['b', 2]);
            expect(po.get()).to.be.undefined;
        });

        it('should generate an object with values', () => {
            var po = permuteObj.init({
                type: 'object',
                schema: {
                    foo: {
                        type: 'value',
                        values: ['a', 'b']
                    }
                }
            });

            expect(po.get()).to.deep.equal({foo: 'a'});
            expect(po.get()).to.deep.equal({foo: 'b'});
        });

    });
});
*/