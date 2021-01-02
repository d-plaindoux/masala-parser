import stream from '../../lib/stream/index';
import {F, C, N} from '../../lib/parsec/index';


export default {
    setUp: function (done) {
        done();
    },

    'expect val to be a nice shortcut':function(test){

        const parser = C.string('xyz');
        const val = parser.val('xyz');
        test.equal(val, 'xyz');
        test.done();

    },
    'expect (map) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .map(function (a) {
                    return a + 'b';
                })
                .parse(stream.ofString('a'), 0)
                .isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (map) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .map(function (a) {
                    return a + 'b';
                })
                .parse(stream.ofString('b'), 0)
                .isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (map) to be return ab': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .map(function (a) {
                    return a + 'b';
                })
                .parse(stream.ofString('a'), 0).value,
            'ab',
            'should be accepted.'
        );
        test.done();
    },

    'expect (map) to be return 5x8': function (test) {
        test.expect(1);

        try {
            const st = stream.ofString('5x8');
            const combinator = N.integer()
                .then(C.char('x').drop())
                .then(N.integer())
                .array()
                .map(values => values[0] * values[1]);

            test.equal(combinator.parse(st).value, 40, 'should be accepted.');
        } catch (e) {
            console.log(e);
        }

        test.done();
    },

    'expect (flatMap) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .flatMap(function () {
                    return F.returns('b');
                })
                .parse(stream.ofString('a'), 0)
                .isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (flatMap) to be rejected ': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .flatMap(function () {
                    return F.returns('b');
                })
                .parse(stream.ofString('b'), 0)
                .isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (flatMap) to be return ab': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .flatMap(function () {
                    return C.char('b');
                })
                .parse(stream.ofString('ab'), 0).value,
            'b',
            'should be accepted.'
        );
        test.done();
    },

    'expect (filter) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .filter(function (a) {
                    return a === 'a';
                })
                .parse(stream.ofString('a'), 0)
                .isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (filter) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .filter(function (a) {
                    return a === 'b';
                })
                .parse(stream.ofString('a'), 0)
                .isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (match) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a').match('a').parse(stream.ofString('a'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (match) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a').match('b').parse(stream.ofString('a'), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (then) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .then(C.char('b'))
                .parse(stream.ofString('ab'), 0)
                .isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (then) left to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .then(C.char('b'))
                .parse(stream.ofString('cb'), 0)
                .isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (then) right to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .then(C.char('b'))
                .parse(stream.ofString('ac'), 0)
                .isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (then) to return [a,b]': function (test) {
        test.expect(1);
        // tests here
        // const stream = stream.ofString("ab");
        test.deepEqual(
            C.char('a').then(C.char('b')).array().parse(stream.ofString('ab'), 0).value,
            ['a', 'b'],
            'should be accepted.'
        );
        test.done();
    },

    'expect (then) to return [a,b,d]': function (test) {
        test.expect(1);
        // tests here
        // const stream = stream.ofString("ab");
        test.deepEqual(
            C.char('a')
                .then(C.char('b').then(C.char('c').drop()).then(C.char('d')))
                .array()
                .parse(stream.ofString('abcd'), 0).value,
            ['a', 'b', 'd'],
            'should be accepted.'
        );
        test.done();
    },


    'expect (then) to be empty with two drops ': function (test) {

        const parser = C.char('a').drop()
            .then(C.char('b').drop());

        const value = parser.parse(stream.ofString('ab')).value.value;

        test.ok(Array.isArray(value));
        test.equal(value.length, 0);

        test.done();
    },

    'expect (then) to be associative ': function (test) {
        test.expect(1);

        const first = C.char('a')
            .then(C.char('b'))
            .then(C.char('c').drop())
            .then(C.char('d'))
            .array();

        const second = C.char('a')
            .then(C.char('b'))
            .then(C.char('c').drop().then(C.char('d')))
            .array();


        test.deepEqual(
            first.parse(stream.ofString('abcd')).value,
            second.parse(stream.ofString('abcd')).value
        );
        test.done();
    },

    'expect (then) to be replaced by concat ': function (test) {
        test.expect(1);
        // tests here
        // const stream = stream.ofString("ab");
        test.deepEqual(
            C.char('a')
                .concat(C.char('b'))
                .then(C.char('c').drop())
                .concat(C.char('d'))
                .array()
                .parse(stream.ofString('abcd'), 0).value,
            ['a', 'b', 'd'],
            'should be accepted.'
        );
        test.done();
    },

    'expect (thenLeft) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .thenLeft(C.char('b'))
                .parse(stream.ofString('ab'), 0)
                .isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (thenLeft) to return a': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a').thenLeft(C.char('b')).single().parse(stream.ofString('ab'), 0)
                .value,
            'a',
            'should be accepted.'
        );
        test.done();
    },

    'expect (thenLeft) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .thenLeft(C.char('b'))
                .parse(stream.ofString('b'), 0)
                .isAccepted(),
            false,
            'should be accepted.'
        );
        test.done();
    },

    'expect (thenRight) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .thenRight(C.char('b'))
                .parse(stream.ofString('ab'), 0)
                .isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (thenRight) to return a': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a').thenRight(C.char('b')).single().parse(stream.ofString('ab'), 0)
                .value,
            'b',
            'should be accepted.'
        );
        test.done();
    },

    'expect (thenRight) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .thenRight(C.char('b'))
                .parse(stream.ofString('b'), 0)
                .isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (drop/then) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .drop()
                .then(C.char('b'))
                .parse(stream.ofString('ab'), 0)
                .isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (drop/then) to be return b': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a').drop().then(C.char('b')).single().parse(stream.ofString('ab'), 0)
                .value,
            'b',
            'should be accepted.'
        );
        test.done();
    },

    'expect (then/drop) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .then(C.char('b').drop())
                .parse(stream.ofString('ab'), 0)
                .isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (drop/then) to be return a': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a').then(C.char('b').drop()).single().parse(stream.ofString('ab'), 0)
                .value,
            'a',
            'should be accepted.'
        );
        test.done();
    },

    'expect (eos) to be accepted at the end': function (test) {


        const parser = C.string('abc').eos();

        const response =  parser.parse(stream.ofString('abc'));

        test.ok(response.isAccepted(), 'should be accepted.');
        test.ok(response.isEos());
        test.equal(response.value, 'abc'); // not tuple([a]) !
        test.done();
    },

    'expect (eos) to be rejected without eating char': function (test) {


        const parser = C.char('a').eos();

        const response =  parser.parse(stream.ofString('ab'));

        test.ok(!response.isAccepted(), 'should not be accepted.');
        test.ok(!response.isEos());
        test.equal(response.offset, 1);
        test.equal(response.value, undefined); // not tuple([a]) !
        test.done();
    },

    'expect (eos) to be rejected without eating char after fail': function (test) {


        const parser = F.try(C.char('b').eos()).or(C.char('a'));

        const response =  parser.parse(stream.ofString('ab'));

        test.ok(response.isAccepted(), 'should  be accepted.');
        test.equal(response.offset, 1);
        test.equal(response.value, "a"); // not tuple([a]) !
        test.done();
    },

    'expect (thenEos) to be accepted at the end': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .thenEos()
                .parse(stream.ofString('a'))
                .isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    }, 'expect (thenEos) to be rejected if not the end': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .thenEos()
                .parse(stream.ofString('abc'))
                .isAccepted(),
            false,
            'should be rejected'
        );
        test.done();
    },

    'expect (returns) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .returns('b')
                .parse(stream.ofString('ab'), 0)
                .isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (returns) to return b': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a').returns('b').parse(stream.ofString('ab'), 0).value,
            'b',
            'should be accepted.'
        );
        test.done();
    },

    'expect (returns) not to eat char': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a')
                .returns('X')
                .then(C.char('b'))
                .array()
                .parse(stream.ofString('ab'), 0).value,
            ['X', 'b'],
            'should be accepted.'
        );
        test.done();
    },

    'expect (returns) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .returns('b')
                .parse(stream.ofString('b'), 0)
                .isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (or) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .or(C.char('b'))
                .parse(stream.ofString('a'), 0)
                .isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (or) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .or(C.char('b'))
                .parse(stream.ofString('c'), 0)
                .isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (or) LL(1) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .then(C.char('b'))
                .or(C.char('a'))
                .parse(stream.ofString('ac'), 0)
                .isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (or) to return a': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a').or(C.char('b')).parse(stream.ofString('a'), 0).value,
            'a',
            'should be accepted.'
        );
        test.done();
    },

    'expect (or) to return b': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a').or(C.char('b')).parse(stream.ofString('b'), 0).value,
            'b',
            'should be accepted.'
        );
        test.done();
    },

    'expect (then.or) left to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .then(C.char('b').or(C.char('c')))
                .parse(stream.ofString('ad'), 0)
                .isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (then.or) left to be consumed': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a')
                .then(C.char('b').or(C.char('c')))
                .parse(stream.ofString('ad'), 0).consumed,
            true,
            'should be consumed.'
        );
        test.done();
    },

    'expect (opt) some to accepted': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a').opt().parse(stream.ofString('a'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (opt) some to return some a': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a').opt().parse(stream.ofString('a'), 0).value.get(),
            'a',
            'should be a.'
        );
        test.done();
    },

    'expect (opt) none to accepted': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a').opt().parse(stream.ofString('b'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (opt) none to return none': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a').opt().parse(stream.ofString('b'), 0).value.isPresent(),
            false,
            'should be accepted but none.'
        );
        test.done();
    },

    'expect (rep) to accepted': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a').rep().parse(stream.ofString('a'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (rep) to rejected': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a').rep().parse(stream.ofString('b'), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (rep) mutiple to accepted': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a').rep().parse(stream.ofString('aaaabbb'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (rep) mutiple to return [a,a,a,a]': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a')
                .rep()
                .parse(stream.ofString('aaaabbb'), 0)
                .value.array(),
            ['a', 'a', 'a', 'a'],
            'should be accepted.'
        );
        test.done();
    },

    'expect (optrep) to accepted': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a').optrep().parse(stream.ofString('a'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (optrep) none to accepted': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a').optrep().parse(stream.ofString('b'), 0).isAccepted(),
            true,
            'should be rejected.'
        );
        test.done();
    },

    'expect (optrep) mutiple to accepted': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a')
                .optrep()
                .parse(stream.ofString('aaaabbb'), 0)
                .isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (optrep) mutiple to return some [a,a,a,a]': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a')
                .optrep()
                .parse(stream.ofString('aaaabbb'), 0)
                .value.array(),
            ['a', 'a', 'a', 'a'],
            'should be accepted.'
        );
        test.done();
    },

    'expect (optrep) to return none': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('a').optrep().parse(stream.ofString('bbb'), 0).value.array(),
            [],
            'should be accepted.'
        );
        test.done();
    },

    'expect (optrep) to return [b,b,b]': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.notChar('a')
                .optrep()
                .parse(stream.ofString('bbba'), 0)
                .value.array(),
            ['b', 'b', 'b'],
            'should be accepted.'
        );
        test.done();
    },

    'expect two (optrep) to be merged as [b,b,b,a]]': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('b')
                .optrep()
                .then(C.char('a').optrep())
                .array()
                .parse(stream.ofString('bbba'), 0).value,
            ['b', 'b', 'b', 'a'],
            'should be accepted.'
        );
        test.done();
    },
    'expect two (optrep) to return [[b,b,b],[a]] using array()': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            C.char('b')
                .optrep().array()
                .then(C.char('a').optrep())
                .array()
                .parse(stream.ofString('bbba'), 0).value,
            [['b', 'b', 'b'], ['a']],
            'should be accepted.'
        );
        test.done();
    },


    'expect debug() to make side effect': function (test) {
        test.expect(1);
        // tests here
        const original = console.log;
        let sideEffect = false;

        console.log = function () {
            sideEffect = true;
        };

        // side effect action
        C.char('a').debug('found').optrep().parse(stream.ofString('aaa'), 0);

        console.log = original;
        test.deepEqual(sideEffect, true, 'should make side effect.');
        test.done();
    },

    'expect debug(param, false) to make side effect': function (test) {
        test.expect(1);
        // tests here
        const original = console.log;
        let sideEffect = false;

        console.log = function () {
            sideEffect = true;
        };

        // side effect action : will hide the details
        C.char('a')
            .debug('found', false)
            .optrep()
            .parse(stream.ofString('aaa'), 0);

        console.log = original;
        test.deepEqual(sideEffect, true, 'should make side effect.');
        test.done();
    },

    'expect (debug) to not make side effect': function (test) {
        test.expect(1);
        // tests here
        const original = console.log;
        let sideEffect = false;

        console.log = function () {
            sideEffect = true;
        };

        // side effect action
        C.char('a').debug('found').optrep().parse(stream.ofString('xxxx'), 0);

        console.log = original;
        test.deepEqual(sideEffect, false, 'should make side effect.');
        test.done();
    },

};
