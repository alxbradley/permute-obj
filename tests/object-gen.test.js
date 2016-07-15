/* global require, beforeEach, before, describe, it */
/* jshint -W030, -W097 */

import createGenerator from '../src/createGenerator';
import {expect} from 'chai';

function failMsg (name, property, expected) {
    return name + '.' + property + ' should be ' + expected;
}

describe('ObjectGenerator', () => {
    var gen;
    var schema = {
        type: 'object', 
        schema: {
            coolStuff: {
                type: 'value',
                values: ['foo','bar']
            },
            moreStuff: {
                type: 'value',
                values: [1,2]
            },
            someList: {
                type: 'list',
                schema: {
                    first: {
                        type: 'boolean'
                    },
                    second: {
                        type: 'value',
                        values: ['a', 'b']
                    }
                }
            }
        }
    };
    beforeEach(() => {
        gen = createGenerator(schema);
    });

    describe('@constructor', () => {
        it('should initialize correctly', () => {
            var val;
            expect(gen.keys).to.deep.equal(['coolStuff', 'moreStuff', 'someList']);
            expect(gen.index).to.equal(0);
            expect(gen.type).to.equal('object');

            val = gen.values[0];
            expect(val.values).to.deep.equal(['foo','bar']);
            expect(val.index).to.equal(0);
            expect(val.type).to.equal('value');

            val = gen.values[1];
            expect(val.values).to.deep.equal([1,2]);
            expect(val.index).to.equal(0);
            expect(val.type).to.equal('value');

            val = gen.values[2];
            expect(val.index).to.equal(0);
            expect(val.keys).to.deep.equal(['first', 'second']);
            expect(val.type).to.equal('list')

            expect(val.values[0].index).to.equal(0);
            expect(val.values[0].values).to.deep.equal([true, false]);
            expect(val.values[0].type).to.equal('value');

            expect(val.values[1].index).to.equal(0);
            expect(val.values[1].values).to.deep.equal(['a', 'b']);
            expect(val.values[1].type).to.equal('value');
        });
    });
    describe('@hasNext', () => {
        it('should return true initially', () => {
            expect(gen.hasNext()).to.be.true;
        });
        it('should return true if a sublist has more values', () => {
            gen.index = 2;
            gen.values[0].index = 1;
            gen.values[1].index = 1;

            gen.values[2].values[0].index = 0;
            gen.values[2].values[1].index = 0;

            expect(gen.hasNext()).to.be.true;

            gen.values[2].values[0].index = 1;
            gen.values[2].values[1].index = 0;

            expect(gen.hasNext()).to.be.true;

            gen.values[2].values[0].index = 0;
            gen.values[2].values[1].index = 1;

            expect(gen.hasNext()).to.be.true;
        });
        it('should return false if all children return false', () => {
            gen.index = 2;
            gen.values[0].index = 1;
            gen.values[1].index = 1;
            gen.values[2].values[0].index = 1;
            gen.values[2].values[1].index = 1;

            expect(gen.hasNext()).to.be.false;
        });
    });

    describe('@update', () => {
        var a, b, c, c_a, c_b;

        beforeEach(() => {
            a = gen.values[0];
            b = gen.values[1];
            c = gen.values[2];
            c_a = c.values[0];
            c_b = c.values[1];
        });

        it('should update indices properly #1', () => {
            gen.update();

            expect(a.index).to.equal(1, failMsg('a', 'index', 1));
            expect(b.index).to.equal(0, failMsg('b', 'index', 0));
            expect(c_a.index).to.equal(0, failMsg('c_a', 'index', 0));
            expect(c_b.index).to.equal(0, failMsg('c_b', 'index', 0));
        });

        it('should update indices properly #2', () => {
            a.index = 1;
            b.index = 1;

            gen.update();

            expect(a.index).to.equal(0, failMsg('a', 'index', 0));
            expect(b.index).to.equal(0, failMsg('b', 'index', 0));
            expect(c_a.index).to.equal(1, failMsg('c_a', 'index', 1));
            expect(c_b.index).to.equal(0, failMsg('c_b', 'index', 0));
        });

        it('should update indices properly #3', () => {
            a.index = 1;
            b.index = 1;
            c_a.index = 1;

            gen.update();

            expect(a.index).to.equal(0, failMsg('a', 'index', 0));
            expect(b.index).to.equal(0, failMsg('b', 'index', 0));
            expect(c_a.index).to.equal(0, failMsg('c_a', 'index', 0));
            expect(c_b.index).to.equal(1, failMsg('c_b', 'index', 1));
        });

        it('should update indices properly #4', () => {
            a.index = 1;
            b.index = 1;
            c_a.index = 0;
            c_b.index = 1;

            gen.update();

            expect(a.index).to.equal(0, failMsg('a', 'index', 0));
            expect(b.index).to.equal(0, failMsg('b', 'index', 0));
            expect(c_a.index).to.equal(1, failMsg('c_a', 'index', 1));
            expect(c_b.index).to.equal(1, failMsg('c_b', 'index', 1));
        });
    });
    describe('@get', () => {
        var a, b, c, c_a, c_b;

        beforeEach(() => {
            a = gen.values[0];
            b = gen.values[1];
            c = gen.values[2];
            c_a = c.values[0];
            c_b = c.values[1];
        });

        it('should return correct values initially', () => {
            var data = gen.get();
            expect(data).to.deep.equal({
                coolStuff: 'foo',
                moreStuff: 1,
                someList: [true, 'a']
            });
        });
        it('should return correct values #1', () => {
            a.index = 1;
            var data = gen.get();
            expect(data).to.deep.equal({
                coolStuff: 'bar',
                moreStuff: 1,
                someList: [true, 'a']
            })
        });

        it('should return correct values #2', () => {
            a.index = 1;
            c_a.index = 1;
            var data = gen.get();
            expect(data).to.deep.equal({
                coolStuff: 'bar',
                moreStuff: 1,
                someList: [false, 'a']
            })
        });
    });
});