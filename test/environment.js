import test from 'ava'
import Environment from 'environment'

test('creates a new environment', t => {
  const env = new Environment({ vars: { test: true } })

  t.true(env.vars.test)
})

test('extend copies the parent environment', t => {
  const parent = new Environment({ vars: { test: true } })
  const env = parent.extend()

  t.true(env.vars.test)
})

test('lookup finds vars in parent', t => {
  const parent = new Environment({ vars: { test: true } })
  const env = new Environment(parent)

  t.true(env.lookup('test').vars.test)
})

test('get returns an environment var', t => {
  const env = new Environment({ vars: { test: true } })

  t.true(env.get('test'))
})

test('get throws error if given unknown name', t => {
  const env = new Environment({ vars: {} })

  const error = t.throws(() => {
    env.get('test')
  })
  t.is(error.message, "Undefined variable test")
})

test('set sets an environment var', t => {
  const env = new Environment({ vars: { test: true } })
  env.set('test', false)

  t.false(env.get('test'))
})

test('set throws error if given unknown name', t => {
  const env = new Environment({ vars: {} })

  const error = t.throws(() => {
    env.set('test', true)
  })
  t.is(error.message, "Undefined variable test")
})

test('def defines a new environment var', t => {
  const env = new Environment({ vars: {} })
  env.def('test', true)

  t.true(env.get('test'))
})
