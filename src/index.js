const antlr4 = require('antlr4')
const ItemsLexer = require('./antlr/generated-parser/ItemsLexer')
const ItemsParser = require('./antlr/generated-parser/ItemsParser')

const getTextOfParsedElements = (tree, ruleNames) => {
  const res = []
  if (Array.isArray(ruleNames)) {
    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i]
      if (Array.isArray(child.children)) {
        child.children.forEach(element => {
          res.push(element.getText())
        })
      }
    }
  }
  return res
}

const AnnotatingErrorListener = function (annotations) {
  antlr4.error.ErrorListener.call(this)
  this.annotations = annotations
  return this
}

AnnotatingErrorListener.prototype = Object.create(antlr4.error.ErrorListener.prototype)
AnnotatingErrorListener.prototype.constructor = AnnotatingErrorListener

AnnotatingErrorListener.prototype.syntaxError = function (recognizer, offendingSymbol, line, column, msg, e) {
  this.annotations.push({
    row: line - 1,
    column: column,
    text: msg,
    type: 'error'
  })
}

const parse = text => {
  const chars = new antlr4.InputStream(text)
  const lexer = new ItemsLexer.ItemsLexer(chars)
  const tokens = new antlr4.CommonTokenStream(lexer)
  const parser = new ItemsParser.ItemsParser(tokens)

  var annotations = []
  var listener = new AnnotatingErrorListener(annotations)

  parser.removeErrorListeners()
  parser.addErrorListener(listener)
  parser.buildParseTrees = true
  parser.itemmodel()

  return annotations
}

module.exports = {
  parse
}
