
var cobs = require('../'),
    assert = require('assert');
    
var TokenType = cobs.TokenType;

function assertToken(lexer, value, type)
{
    var token = lexer.nextToken();
    assert.ok(token);
    assert.equal(token.value, value);
    assert.equal(token.type, type);
}
    
// Lexer defined

assert.ok(cobs.Lexer);

// Null token if null text

var lexer = new cobs.Lexer(null);

assert.equal(lexer.nextToken(), null);

// Null token if empty text

var lexer = new cobs.Lexer('');

assert.equal(lexer.nextToken(), null);

// Get simple name

var lexer = new cobs.Lexer('DIVISION');

assertToken(lexer, 'DIVISION', TokenType.Name);

assert.equal(lexer.nextToken(), null);

// Get simple name with spaces

var lexer = new cobs.Lexer('  DIVISION  ');

assertToken(lexer, 'DIVISION', TokenType.Name);

assert.equal(null, lexer.nextToken());

// Get simple name with digits

var lexer = new cobs.Lexer('ITEM01');

assertToken(lexer, 'ITEM01', TokenType.Name);

assert.equal(lexer.nextToken(), null);

// Get two simple names

var lexer = new cobs.Lexer('IDENTIFICATION DIVISION');

assertToken(lexer, 'IDENTIFICATION', TokenType.Name);
assertToken(lexer, 'DIVISION', TokenType.Name);

assert.equal(lexer.nextToken(), null);

// Get name with minus sign

var lexer = new cobs.Lexer('WORKING-STORAGE');

assertToken(lexer, 'WORKING-STORAGE', TokenType.Name);

assert.equal(null, lexer.nextToken());

// Get integer number

var lexer = new cobs.Lexer('123');

assertToken(lexer, '123', TokenType.Integer);

assert.equal(null, lexer.nextToken());

// Get integer number with leading zeroes

var lexer = new cobs.Lexer('003');

assertToken(lexer, '003', TokenType.Integer);

assert.equal(lexer.nextToken(), null);

// Get simple string

var lexer = new cobs.Lexer('"ADAM"');

assertToken(lexer, 'ADAM', TokenType.String);

assert.equal(lexer.nextToken(), null);

// Raise if unclosed string

var lexer = new cobs.Lexer('"ADAM');

assert.throws(
    function() {
        assertToken(lexer, 'ADAM', TokenType.String);
    },
    function(ex) {
        return ex == "unclosed string";
    });

// Raise if unexpected character

var lexer = new cobs.Lexer('!');

assert.throws(
    function() {
        assertToken(lexer, '!', TokenType.String);
    },
    function(ex) {
        return ex == "unexpected '!'";
    });

// Get point as Punctuation

var lexer = new cobs.Lexer('.');

assertToken(lexer, '.', TokenType.Punctuation);

assert.equal(lexer.nextToken(), null);

// Skip line comment

var lexer = new cobs.Lexer('* This is a line comment \r\nDIVISION');

assertToken(lexer, 'DIVISION', TokenType.Name);

assert.equal(lexer.nextToken(), null);

// Skip two line comments

var lexer = new cobs.Lexer('* This is a line comment \r\n* This is another line comment \r\nDIVISION');

assertToken(lexer, 'DIVISION', TokenType.Name);

assert.equal(lexer.nextToken(), null);

// Get Phrase

var lexer = new cobs.Lexer("HELLO.");

assert.equal(lexer.nextPhrase(), "HELLO");

// Get Phrase with initial spaces and end of line

var lexer = new cobs.Lexer("   HELLO.\r\n");

assert.equal(lexer.nextPhrase(), "HELLO");
