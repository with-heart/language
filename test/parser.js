import test from 'ava'
import Parser from 'parser'
import TokenStream from 'token-stream'
import InputStream from 'input-stream'

const ts = input => new TokenStream(new InputStream(input))
const token = input => new TokenStream(new InputStream(input)).next()

test('handles binary operations', t => {
  const expr = '123.5 + 5;'
  const left = token('123.5')
  const right = token('5')
  const parser = new Parser(ts(expr))

  const expected = {
    type: "prog",
    prog: [{
      type: "binary",
      operator: "+",
      left,
      right,
    }]
  }
  t.deepEqual(parser, expected)
})

test('handles complex binary operations', t => {
  const expr = 'x + y * z'
  const firstLeft = token('x')
  const secondLeft = token('y')
  const right = token('z')
  const parser = new Parser(ts(expr))

  const expected = {
    type: "prog",
    prog: [{
      type: "binary",
      operator: "+",
      left: firstLeft,
      right: {
        type: "binary",
        operator: "*",
        left: secondLeft,
        right,
      }
    }]
  }

  t.deepEqual(parser, expected)
})

test('handles lambdas', t => {
  const expr = 'lambda (x) 10'
  const body = token('10')
  const parser = new Parser(ts(expr))

  const expected = {
    type: "prog",
    prog: [{
      type: "lambda",
      vars: [ "x" ],
      body,
    }]
  }

  t.deepEqual(parser, expected)
})

test('handles function calls', t => {
  const expr = 'foo(a, 1)'
  const leftArg = token('a')
  const rightArg = token('1')
  const parser = new Parser(ts(expr))

  const expected = {
    type: "prog",
    prog: [{
      type: "call",
      func: { type: "var", value: "foo" },
      args: [
        leftArg,
        rightArg
      ]
    }]
  }

  t.deepEqual(parser, expected)
})

test('handles conditionals', t => {
  const expr = 'if foo then bar else baz'
  const cond = token('foo')
  const then = token('bar')
  const elseThen = token('baz')
  const parser = new Parser(ts(expr))

  const expected = {
    type: "prog",
    prog: [{
      type: "if",
      cond,
      then,
      else: elseThen,
    }]
  }

  t.deepEqual(parser, expected)
})

test('handles conditionals with no else branch', t => {
  const expr = 'if foo then bar'
  const cond = token('foo')
  const then = token('bar')
  const parser = new Parser(ts(expr))

  const expected = {
    type: "prog",
    prog: [{
      type: "if",
      cond,
      then,
    }]
  }

  t.deepEqual(parser, expected)
})

test('handles assignment', t => {
  const expr = 'a = 10'
  const left = token('a')
  const right = token('10')
  const parser = new Parser(ts(expr))

  const expected = {
    type: "prog",
    prog: [{
      type: "assign",
      operator: "=",
      left,
      right,
    }]
  }

  t.deepEqual(parser, expected)
})

test('handles sequences', t => {
  const expr = `{
    a = 5;
    b = a * 2;
    a + b
  }`
  const parser = new Parser(ts(expr))

  const expected = {
    type: "prog",
    prog: [{
      type: "prog",
      prog: [
        {
          type: "assign",
          operator: "=",
          left: token('a'),
          right: token('5'),
        },
        {
          type: "assign",
          operator: "=",
          left: token('b'),
          right: {
            type: "binary",
            operator: "*",
            left: token('a'),
            right: token('2'),
          }
        },
        {
          type: "binary",
          operator: "+",
          left: token('a'),
          right: token('b')
        }
      ]
    }
    ]
  }

  t.deepEqual(parser, expected)
})
