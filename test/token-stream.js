import test from 'ava'
import TokenStream from 'token-stream'
import InputStream from 'input-stream'

test('next skips whitespace', t => {
  const ts = new TokenStream(new InputStream('  l'))
  const expected = { type: "var", value: "l" }
  t.deepEqual(ts.next(), expected)
})

test('next detects end of file', t => {
  const ts = new TokenStream(new InputStream(''))
  t.is(ts.next(), null)
})

test('next skips comments', t => {
  const ts = new TokenStream(new InputStream('#comment\nl'))
  const expected = { type: "var", value: "l" }
  t.deepEqual(ts.next(), expected)
})

test('next reads quote strings', t => {
  const ts = new TokenStream(new InputStream('"hello"'))
  const expected = { type: "str", value: "hello" }
  t.deepEqual(ts.next(), expected)
})

test('next reads digits', t => {
  const ts = new TokenStream(new InputStream("23"))
  const expected = { type: "num", value: 23 }
  t.deepEqual(ts.next(), expected)
})

test('next reads a letter as identifier or keyword', t => {
  const ts = new TokenStream(new InputStream("a"))
  const expected = { type: "var", value: "a" }
  t.deepEqual(ts.next(), expected)
})

test('next reads punctuation characters', t => {
  const ts = new TokenStream(new InputStream("("))
  const expected = { type: "punc", value: "(" }
  t.deepEqual(ts.next(), expected)
})

test('next reads punctuation characters', t => {
  const ts = new TokenStream(new InputStream("!="))
  const expected = { type: "op", value: "!=" }
  t.deepEqual(ts.next(), expected)
})

test('next throws error on invalid characters', t => {
  const ts = new TokenStream(new InputStream("^"))
  const error = t.throws(() => {
    ts.next()
  }, Error)
  t.is(error.message, "Can't handle character: ^ (1:0)")
})

test('peek returns the next token without changing cursor position', t => {
  const ts = new TokenStream(new InputStream("ts"))
  const expected = { type: "var", value: "ts" }

  t.deepEqual(ts.peek(), expected)
  t.deepEqual(ts.next(), expected)
})

test('eof detects end of file', t => {
  const ts = new TokenStream(new InputStream(""))
  t.is(ts.next(), null)
})
