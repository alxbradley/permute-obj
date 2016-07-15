/* global require, before, describe, it */
/* jshint -W030, -W097 */

import createGenerator from '../src/createGenerator';
import {expect} from 'chai';


function valueIterTest(gen) {
    var len = gen.values.length;
    for (var i = 0; i < len; i++) {
        expect(gen.get()).to.equal(gen.values[i]);
        expect(gen.index).to.equal(i);
        expect(gen.hasNext()).to.equal(i < len - 1);
        gen.next();
    }
    gen.reset();
    expect(gen.index).to.equal(0);
}

function objectIterTest(gen, expected) {
    var i = 0;
    var value;
    var list = [];
    var last = false;
    while (true) {
        if (!gen.hasNext()) {
            last = true;
        }
        value = gen.get();
        list.push(value);
        expect(value).to.deep.equal(expected[i++], JSON.stringify(list, null, 2));
        gen.update();
        if (last) {
            break;
        }
    }
}

describe('createGenerator', () => {
    describe('ValueGenerator (boolean)', () => {
        var gen;
        var values = [true,false];
        before(() => {
            gen = createGenerator({type: 'boolean'});
        });

        it('should initialize correctly', () => {
            expect(gen.values).to.deep.equal(values);
            expect(gen.type).to.equal('value');
            expect(gen.index).to.equal(0);
        });

        it('should return the correct values', () => {
            valueIterTest(gen);
        });
    });
    describe('ValueGenerator (generic type)', () => {
        var gen;
        var values = ['foo','bar','baz'];
        before(() => {
            gen = createGenerator({type: 'value', values: values});
        });

        it('should initialize correctly', () => {
            expect(gen.values).to.deep.equal(values);
            expect(gen.type).to.equal('value');
            expect(gen.index).to.equal(0);
        });

        it('should return the correct values', () => {
            valueIterTest(gen);
        });
    });
    describe('ListGenerator (basic list)', () => {
        var gen;
        var schema = {
            type: 'list', 
            schema: {
                coolStuff: {
                    type: 'value',
                    values: ['foo','bar','baz']
                }
            }
        };
        before(() => {
            gen = createGenerator(schema);
        });

        it('should initialize correctly', () => {
            expect(gen.keys).to.deep.equal(['coolStuff']);
            expect(gen.type).to.equal('list');
            expect(gen.index).to.equal(0);
        });

        it('should return the correct values', () => {
            var expected = [
                ['foo'],
                ['bar'],
                ['baz']
            ];
            objectIterTest(gen, expected);
        });
    });

    describe('ListGenerator (basic list - multiple keys #1)', () => {
        var gen;
        var schema = {
            type: 'list', 
            schema: {
                coolStuff: {
                    type: 'value',
                    values: ['foo','bar','baz']
                },
                funStuff: {
                    type: 'boolean'
                }
            }
        };
        before(() => {
            gen = createGenerator(schema);
        });

        it('should initialize correctly', () => {
            expect(gen.keys).to.deep.equal(['coolStuff', 'funStuff']);
            expect(gen.type).to.equal('list');
            expect(gen.index).to.equal(0);
        });
        it('should return the correct values', () => {
            var expected = [
                ['foo', true],
                ['bar', true],
                ['baz', true],
                ['foo', false],
                ['bar', false],
                ['baz', false]
            ];
            objectIterTest(gen, expected);
        });
    });

    describe('ListGenerator (basic list - multiple keys #2)', () => {
        var gen;
        var schema = {
            type: 'list', 
            schema: {
                coolStuff: {
                    type: 'value',
                    values: ['foo','bar','baz']
                },
                funStuff: {
                    type: 'value',
                    values: [1,2,3]
                }
            }
        };
        before(() => {
            gen = createGenerator(schema);
        });

        it('should initialize correctly', () => {
            expect(gen.keys).to.deep.equal(['coolStuff', 'funStuff']);
            expect(gen.type).to.equal('list');
            expect(gen.index).to.equal(0);
        });
        it('should return the correct values', () => {
            var expected = [
                ['foo', 1],
                ['bar', 1],
                ['baz', 1],
                ['foo', 2],
                ['bar', 2],
                ['baz', 2],
                ['foo', 3],
                ['bar', 3],
                ['baz', 3]
            ];
            objectIterTest(gen, expected);
        });
    });

    describe('ListGenerator (basic list - multiple keys #3)', () => {
        var gen;
        var schema = {
            type: 'list', 
            schema: {
                coolStuff: {
                    type: 'boolean'
                },
                funStuff: {
                    type: 'boolean'
                },
                otherStuff: {
                    type: 'boolean'
                }
            }
        };
        before(() => {
            gen = createGenerator(schema);
        });

        it('should initialize correctly', () => {
            expect(gen.keys).to.deep.equal(['coolStuff', 'funStuff', 'otherStuff']);
            expect(gen.type).to.equal('list');
            expect(gen.index).to.equal(0);
        });
        it('should return the correct values', () => {
            var expected = [
                [true, true, true],
                [false, true, true],
                [true, false, true],
                [false, false, true],
                [true, true, false],
                [false, true, false],
                [true, false, false],
                [false, false, false]
            ];
            objectIterTest(gen, expected);
        });
    });

    describe('ListGenerator (complex list)', () => {
        var gen;
        var schema = {
            type: 'list', 
            schema: {
                coolStuff: {
                    type: 'list',
                    schema: {
                        innerCoolStuff: {
                            type: 'boolean'
                        }
                    }
                }
            }
        };
        before(() => {
            gen = createGenerator(schema);
        });

        it('should initialize correctly', () => {
            expect(gen.keys).to.deep.equal(['coolStuff']);
            expect(gen.type).to.equal('list');
            expect(gen.index).to.equal(0);

            var inner = gen.values[0];
            expect(inner.keys).to.deep.equal(['innerCoolStuff']);
            expect(inner.type).to.equal('list');
            expect(inner.index).to.equal(0);

        });
        it('should return the correct values', () => {
            var expected = [
                [[true]],
                [[false]]
            ];
            objectIterTest(gen, expected);
        });

    });

    describe('ObjectGenerator (basic object)', () => {
        var gen;
        var schema = {
            type: 'object', 
            schema: {
                coolStuff: {
                    type: 'value',
                    values: ['foo','bar','baz']
                }
            }
        };
        before(() => {
            gen = createGenerator(schema);
        });

        it('should initialize correctly', () => {
            expect(gen.keys).to.deep.equal(['coolStuff']);
            expect(gen.type).to.equal('object');
            expect(gen.index).to.equal(0);
        });
        it('should return the correct values', () => {
            var expected = [
                {coolStuff:'foo'},
                {coolStuff:'bar'},
                {coolStuff:'baz'}
            ];
            objectIterTest(gen, expected);
        });

    });

    describe('ObjectGenerator (basic object - multiple keys)', () => {
        var gen;
        var schema = {
            type: 'object', 
            schema: {
                coolStuff: {
                    type: 'value',
                    values: ['foo','bar','baz']
                },
                count: {
                    type: 'value',
                    values: [1,2]
                }
            }
        };
        before(() => {
            gen = createGenerator(schema);
        });

        it('should initialize correctly', () => {
            expect(gen.keys).to.deep.equal(['coolStuff', 'count']);
            expect(gen.type).to.equal('object');
            expect(gen.index).to.equal(0);
        });

        it('should return the correct values', () => {
            var expected = [
                {coolStuff:'foo', count: 1},
                {coolStuff:'bar', count: 1},
                {coolStuff:'baz', count: 1},
                {coolStuff:'foo', count: 2},
                {coolStuff:'bar', count: 2},
                {coolStuff:'baz', count: 2}
            ];
            objectIterTest(gen, expected);
        });
    });

    describe('ObjectGenerator (complex object)', () => {
        var gen;
        var schema = {
            type: 'object', 
            schema: {
                coolStuff: {
                    type: 'object',
                    schema: {
                        innerCoolStuff: {
                            type: 'value',
                            values: ['foo','bar','baz']
                        }
                    }
                }
            }
        };
        before(() => {
            gen = createGenerator(schema);
        });

        it('should initialize correctly', () => {
            expect(gen.keys).to.deep.equal(['coolStuff']);
            expect(gen.type).to.equal('object');
            expect(gen.index).to.equal(0);

            var inner = gen.values[0];
            expect(inner.keys).to.deep.equal(['innerCoolStuff']);
            expect(inner.type).to.equal('object');
            expect(inner.index).to.equal(0);
        });

        it('should return the correct values', () => {
            var expected = [
                {
                    coolStuff:{
                        innerCoolStuff: 'foo'
                    }
                },
                {
                    coolStuff:{
                        innerCoolStuff: 'bar'
                    }
                },
                {
                    coolStuff:{
                        innerCoolStuff: 'baz'
                    }
                }
            ];
            objectIterTest(gen, expected);
        });
    });

    describe('Mixed schema (object with list)', () => {
        var gen;
        var schema = {
            type: 'object', 
            schema: {
                coolStuff: {
                    type: 'list',
                    schema: {
                        innerCoolStuff: {
                            type: 'value',
                            values: ['foo','bar','baz']
                        }
                    }
                },
                isFixed: {
                    type: 'boolean'
                }
            }
        };
        before(() => {
            gen = createGenerator(schema);
        });

        it('should initialize correctly', () => {
            expect(gen.keys).to.deep.equal(['coolStuff', 'isFixed']);
            expect(gen.type).to.equal('object');
            expect(gen.index).to.equal(0);

            var inner = gen.values[0];
            expect(inner.keys).to.deep.equal(['innerCoolStuff']);
            expect(inner.type).to.equal('list');
            expect(inner.index).to.equal(0);
        });

        it('should return the correct values', () => {
            var expected = [
                {
                    coolStuff: ['foo'],
                    isFixed: true
                },
                {
                    coolStuff: ['bar'],
                    isFixed: true
                },
                {
                    coolStuff: ['baz'],
                    isFixed: true
                },
                {
                    coolStuff: ['foo'],
                    isFixed: false
                },
                {
                    coolStuff: ['bar'],
                    isFixed: false
                },
                {
                    coolStuff: ['baz'],
                    isFixed: false
                }
            ];
            objectIterTest(gen, expected);
        });
    });

    describe('Mixed schema (list with objects)', () => {
        var gen;
        var schema = {
            type: 'list', 
            schema: {
                coolStuff: {
                    type: 'object',
                    schema: {
                        innerCoolStuff: {
                            type: 'value',
                            values: ['foo','bar','baz']
                        }
                    }
                },
                isFixed: {
                    type: 'boolean'
                }
            }
        };
        before(() => {
            gen = createGenerator(schema);
        });

        it('should initialize correctly', () => {
            expect(gen.keys).to.deep.equal(['coolStuff', 'isFixed']);
            expect(gen.type).to.equal('list');
            expect(gen.index).to.equal(0);

            var inner = gen.values[0];
            expect(inner.keys).to.deep.equal(['innerCoolStuff']);
            expect(inner.type).to.equal('object');
            expect(inner.index).to.equal(0);
        });

        it('should return the correct values', () => {
            var expected = [
                [{ innerCoolStuff: 'foo' }, true ],
                [{ innerCoolStuff: 'bar' }, true ],
                [{ innerCoolStuff: 'baz' }, true ],
                [{ innerCoolStuff: 'foo' }, false ],
                [{ innerCoolStuff: 'bar' }, false ],
                [{ innerCoolStuff: 'baz' }, false ]
            ];
            objectIterTest(gen, expected);
        });
    });
});

