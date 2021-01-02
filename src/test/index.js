/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */


import dataTests from './data/data-package-test';
import streamTests from './stream/stream-package-test';
import parserTests from './parsec/parser-package-test'

import genlexTests from './genlex/genlex-package-test';
import jsonParseTest from './standard/json/jsonparser_test';
import jsonSampleTest from './standard/json/jsonsample_test';


export {
    parserTests,
    dataTests,
    streamTests,
    genlexTests,
    jsonParseTest,
    jsonSampleTest
};
