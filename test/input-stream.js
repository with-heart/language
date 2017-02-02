import test from 'ava'
import InputStream from 'input-stream'

test('next returns and then discards the next value', t => {
  const stream = InputStream('Test')

  t.is(stream.next(), 'T')
  t.not(stream.next(), 'T')
})

test('peek returns and does not discard the next value', t => {
  const stream = InputStream('Test')

  t.is(stream.peek(), 'T')
})

test('eof returns stream completion status', t => {
  const stream = InputStream('')

  t.true(stream.eof())
})

test('croak', t => {
  const stream = InputStream('')

  const error = t.throws(() => {
    stream.croak('Test')
  }, Error)

  t.is(error.message, 'Test (1:0)')
})
