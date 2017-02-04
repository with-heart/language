import Environment from './src/environment'
import TokenStream from './src/token-stream'
import InputStream from './src/input-stream'
import parse from './src/parser'
import evaluate from './src/evaluate'

const globalEnv = new Environment()

globalEnv.def("time", func => {
  try {
    console.time('time')
    return func()
  } finally {
    console.endTime('time')
  }
})

if (typeof process != "undefined") (function() {
  globalEnv.def("println", val => console.log(val))

  globalEnv.def("print", val => process.stdout.write(`${val}`))

  let code = ""
  process.stdin.setEncoding("utf8")
  process.stdin.on("readable", function() {
    const chunk = process.stdin.read()
    if (chunk) code += chunk
  })
  process.stdin.on("end", function() {
    const ast = parse(TokenStream(InputStream(code)))
    evaluate(ast, globalEnv)
  })
})()
