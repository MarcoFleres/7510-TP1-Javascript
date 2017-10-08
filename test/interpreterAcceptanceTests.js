var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');

var Interpreter = require('../src/interpreter');


describe("Interpreter", function () {

    var db = [
        "varon(juan).",
        "varon(pepe).",
        "varon(hector).",
        "varon(roberto).",
        "varon(alejandro).",
        "mujer(maria).",
        "mujer(cecilia).",
        "padre(juan, pepe).",
        "padre(juan, pepa).",
        "padre(hector, maria).",
        "padre(roberto, alejandro).",
        "padre(roberto, cecilia).",
        "hijo(X, Y) :- varon(X), padre(Y, X).",
        "hija(X, Y) :- mujer(X), padre(Y, X)."
    ];

    var interpreter = null;

    before(function () {
        // runs before all tests in this block
    });

    after(function () {
        // runs after all tests in this block
    });

    beforeEach(function () {
        // runs before each test in this block
        interpreter = new Interpreter();
        interpreter.parseDB(db);
    });

    afterEach(function () {
        // runs after each test in this block
    });


    describe('Interpreter Facts', function () {

        it('varon(juan) should be true', function () {
            assert(interpreter.checkQuery('varon(juan)'));
        });

        it('varon(maria) should be false', function () {
            assert(interpreter.checkQuery('varon(maria)') === false);
        });

        it('mujer(cecilia) should be true', function () {
            assert(interpreter.checkQuery('mujer(cecilia)'));
        });

        it('padre(juan, pepe) should be true', function () {
            assert(interpreter.checkQuery('padre(juan, pepe)') === true);
        });

        it('padre(mario, pepe) should be false', function () {
            assert(interpreter.checkQuery('padre(mario, pepe)') === false);
        });

        it('mujer(juan) should be false', function () {
            assert(interpreter.checkQuery('mujer(juan)') === false);
        });

        it('padre(pepe, juan) should be false', function () {
            assert(interpreter.checkQuery('padre(pepe, juan)') === false);
        });

    });

    describe('Interpreter Rules', function () {

        it('hijo(pepe, juan) should be true', function () {
            assert(interpreter.checkQuery('hijo(pepe, juan)') === true);
        });
        it('hija(maria, roberto) should be false', function () {
            assert(interpreter.checkQuery('hija(maria, roberto)') === false);
        });
        it('hijo(pepe, juan) should be true', function () {
            assert(interpreter.checkQuery('hijo(pepe, juan)'));
        });

        // TODO: Add more tests

    });

    describe('Wrong Queries', function() {

        it('Empty Parameter', function () {
            assert.throws(() => {
                interpreter.checkQuery('hijo(pepe, )');
            });
        });
        it('No Parameter', function () {
            assert.throws(() => {
                interpreter.checkQuery('hijo()');
            });
        });

    });


});

describe('Number Database', function() {


    var db = [
        "add(zero, zero, zero).",
        "add(zero, one, one).",
        "add(zero, two, two).",
        "add(one, zero, one).",
        "add(one, one, two).",
        "add(one, two, zero).",
        "add(two, zero, two).",
        "add(two, one, zero).",
        "add(two, two, one).",
        "subtract(X, Y, Z) :- add(Y, Z, X)."
    ];

    var interpreter = null;

    beforeEach(function () {
        // runs before each test in this block
        interpreter = new Interpreter();
        interpreter.parseDB(db);
    });

    describe('Interpreter Facts', function() {

        it("add(one, one, two) should be true", function() {
            assert(interpreter.checkQuery('add(one, one, two)') === true);
        });

        it("add(two, one, one) should be false", function() {
            assert(interpreter.checkQuery('add(two, one, one)') === false);
        });

        it("subtract(one, one, two) should be false", function() {
            assert(interpreter.checkQuery('subtract(one, one, two)') === false);
        });

        it("subtract(two, one, one) should be true", function() {
            assert(interpreter.checkQuery('subtract(two, one, one)') === true);
        });

    });


});

describe('Empty Database', function() {

    var interpreter = new Interpreter();

    it('Parsing without initialization', function () {
        assert.throws(() => {
            interpreter.checkQuery('hijo(pepe, juan)');
        }, "DB not initialized");
    });

    it('Wrong query without initializing db', function () {
        assert.throws(() => {
            interpreter.checkQuery('hijo(pepe, )');
        }, "DB not initialized");
    });

});
