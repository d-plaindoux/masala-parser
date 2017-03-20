import X from '../../../lib/standard/extractor/extractor-bundle';
import {F, C} from '../../../lib/parsec/index';
import stream from '../../../lib/stream/index';


export default {
    setUp: function (done) {
        done();
    },

    'test spaces': function (test) {

        const line = stream.ofString('    this starts with 4 spaces');

        const x = new X();
        const combinator = x.spaces().thenLeft(F.any.rep());
        const value = combinator.parse(line).value;
        test.equals(value.length, 4);
        test.done();
    },
    'test spaces and line feed': function (test) {

        const line = stream.ofString('    this \n contains line feed');

        const x = new X();
        const combinator = x.spaces()
            .then(x.word())
            .thenRight(x.spaces())
            .thenLeft(F.any);
        const value = combinator.parse(line).value;
        test.equals(value.length, 3);
        test.done();
    },
    'test numbers': function (test) {

        const line = stream.ofString('98');

        const x = new X();
        const combinator = x.number();
        const value = combinator.parse(line).value;
        test.ok(value === 98);
        test.done();
    },
    'test digits': function (test) {

        const line = stream.ofString('98');

        const x = new X();
        const combinator = x.digits();
        const value = combinator.parse(line).value;
        test.ok(value === '98');
        test.done();
    },
    'test single word': function (test) {

        let line = stream.ofString('Parsec-');

        const x = new X();
        const combinator = x.word().thenLeft(C.char('-'));
        const value = combinator.parse(line).value[0];
        test.ok(value === 'Parsec');
        test.done();
    },

    'test single word': function (test) {

        let line = stream.ofString('10FF-hexadecimal');
        const hexadecimal=C.charIn('0123456789ABCDEF')
            .rep().map(values=>values.join(''))
            .map(x => parseInt(x, 16));

        const x = new X({letters:hexadecimal});
        const combinator = x.word()
            .thenLeft(C.char('-'))
            .thenLeft(C.string('hexadecimal'));
        const value = combinator.parse(line).value[0];
        test.equals(value, 4351);
        test.done();
    }


    /*,
     'test wordsUntil': function (test) {

     const line = stream.ofString('I write until James appears');

     const x = new X();
     const combinator = x.spaces().thenLeft(F.any);
     const value = combinator.parse(line).value;
     console.log('value spaces', value);
     test.equals(value.length,4 );
     test.done();
     }

     */

}


