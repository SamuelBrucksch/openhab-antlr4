const { parse } = require('../src/index')
const { groupsWithFunctions } = require('../__resources__/resources')

describe('Tests for parsing groups from .items files', () => {
  test('Simple group', () => {
    // empty array means there are no errors
    expect(parse('Group g1')).toEqual([])
  })

  test('Simple group + NL', () => {
    // empty array means there are no errors
    expect(parse('Group\n\ns1\r\n')).toEqual([])
    expect(parse('Group s1\n')).toEqual([])
    expect(parse('Group s1\r\n')).toEqual([])
  })

  test('Simple group + multiple NL', () => {
    expect(parse('Group s1\n\n\n\n\n\n\n\n\n\n')).toEqual([])
  })

  test('multiple simple groups with NL inbetween and at end', () => {
    const res = parse(
      `Switch s1\nString s2\nDimmer s\n\n\n\n\n\n\n\n\n\n\nGroup abc\nRollershutter r\nContact c\nDateTime d\n\n\n\n\n\nColor c\nPlayer p\nLocation l\nCall c\nImage i\nNumber n\n\n\n\n\n\n\n\n`
    )
    expect(res).toEqual([])
  })

  test('simple group with label', () => {
    const res = parse('Group g1 "My Group"')
    expect(res).toEqual([])
  })

  test('simple group with parent group', () => {
    const res = parse('Group g1 (g2)')
    expect(res).toEqual([])
  })

  test('simple group with icon', () => {
    const res = parse('Group g1 <icon>')
    expect(res).toEqual([])
  })

  test('simple group with label and parent group', () => {
    const res = parse('Group g1 "G1" (g2)')
    expect(res).toEqual([])
  })

  test('more complex group', () => {
    const res = parse('Group g1 "My Group" <switch> (testGroup) ["LIGHTING"]')
    expect(res).toEqual([])
  })

  test('Groups with functions', () => {
    expect(parse(groupsWithFunctions)).toEqual([])
  })
})

describe('Error cases', () => {
  test('Group spelled wrong', () => {
    expect(parse('Gro1up s1')).toEqual([
      {
        column: 0,
        row: 0,
        text:
          "mismatched input 'Gro1up' expecting {'Group', 'Switch', 'Rollershutter', 'String', 'Dimmer', 'Contact', 'DateTime', 'Color', 'Player', 'Location', 'Call', 'Image', 'Number', NEWLINE}",
        type: 'error'
      }
    ])
  })

  test('Group without WHITESPACE + IDENTIFIER', () => {
    expect(parse('Group')).toEqual([
      {
        column: 5,
        row: 0,
        text: "mismatched input '<EOF>' expecting {NEWLINE, WHITESPACE}",
        type: 'error'
      }
    ])
  })

  test('Group without IDENTIFIER', () => {
    expect(parse('Group ')).toEqual([
      {
        column: 6,
        row: 0,
        text: "extraneous input '<EOF>' expecting {IDENTIFIER, NEWLINE, WHITESPACE}",
        type: 'error'
      }
    ])
  })

  test('label missing ""', () => {
    // TODO improve grammar to get a better error message here
    expect(parse('Group group1 group1')).toEqual([
      {
        column: 13,
        row: 0,
        text: "no viable alternative at input ' group1'",
        type: 'error'
      }
    ])
  })

  test('label mixing " and \'', () => {
    // TODO improve grammar to get a better error message here
    expect(parse('Group group1 "group1\'')).toEqual([
      {
        column: 13,
        row: 0,
        text: "no viable alternative at input ' \"'",
        type: 'error'
      }
    ])
  })

  test('label mixing \' and "', () => {
    // TODO improve grammar to get a better error message here
    expect(parse('Group group1 \'group1"')).toEqual([
      {
        column: 13,
        row: 0,
        text: "no viable alternative at input ' ''",
        type: 'error'
      }
    ])
  })

  test('with missing " behind label', () => {
    // TODO improve grammar to get a better error message here
    expect(parse('Group group1 "group1')).toEqual([
      {
        column: 13,
        row: 0,
        text: "no viable alternative at input ' \"'",
        type: 'error'
      }
    ])
  })

  test('with missing " before label', () => {
    // TODO improve grammar to get a better error message here
    expect(parse('Group group1 group1"')).toEqual([
      {
        column: 13,
        row: 0,
        text: "no viable alternative at input ' group1'",
        type: 'error'
      }
    ])
  })

  test('with label but no name', () => {
    expect(parse('Group "group1"')).toEqual([
      {
        column: 6,
        row: 0,
        text:
          'extraneous input \'"group1"\' expecting {IDENTIFIER, NEWLINE, WHITESPACE}',
        type: 'error'
      }
    ])
  })

  test('missing WHITESPACE before icon', () => {
    // TODO improve grammar to get a better error message here
    expect(parse('Group identifier "label"<icon>')).toEqual([
      {
        column: 24,
        row: 0,
        text:
          "mismatched input '<' expecting {<EOF>, 'Group', 'Switch', 'Rollershutter', 'String', 'Dimmer', 'Contact', 'DateTime', 'Color', 'Player', 'Location', 'Call', 'Image', 'Number', NEWLINE}",
        type: 'error'
      }
    ])
  })

  test('missing ">" at icon', () => {
    expect(parse('Group identifier "label" <icon')).toEqual([
      { column: 30, row: 0, text: "missing '>' at '<EOF>'", type: 'error' }
    ])
  })

  test('missing "<" at icon', () => {
    // TODO improve grammar to get a better error message here
    expect(parse('Group identifier "label" icon>')).toEqual([
      {
        column: 25,
        row: 0,
        text: "no viable alternative at input ' icon'",
        type: 'error'
      }
    ])
  })

  test('missing WHITESPACE before nested group', () => {
    // TODO improve grammar to get a better error message here
    expect(parse('Group identifier "label" <icon>(otherGroup)')).toEqual([
      {
        column: 31,
        row: 0,
        text:
          "mismatched input '(' expecting {<EOF>, 'Group', 'Switch', 'Rollershutter', 'String', 'Dimmer', 'Contact', 'DateTime', 'Color', 'Player', 'Location', 'Call', 'Image', 'Number', NEWLINE}",
        type: 'error'
      }
    ])
  })

  test('missing "(" before nested group', () => {
    // TODO improve grammar to get a better error message here
    expect(parse('Group identifier "label" <icon> otherGroup)')).toEqual([
      {
        column: 32,
        row: 0,
        text: "no viable alternative at input ' otherGroup'",
        type: 'error'
      }
    ])
  })

  test('missing ")" after nested group', () => {
    expect(parse('Group identifier "label" <icon> (otherGroup')).toEqual([
      {
        column: 43,
        row: 0,
        text: "mismatched input '<EOF>' expecting {',', ')'}",
        type: 'error'
      }
    ])
  })

  test('nested groups without ","', () => {
    expect(
      parse('Group identifier "label" <icon> (otherGroup otherGroup2)')
    ).toEqual([
      {
        column: 43,
        row: 0,
        text: "mismatched input ' ' expecting {',', ')'}",
        type: 'error'
      }
    ])
  })

  test('with wrong itemtype', () => {
    expect(parse('Group:Sw1tch')).toEqual([
      {
        column: 6,
        row: 0,
        text:
          "mismatched input 'Sw1tch' expecting {'Switch', 'Rollershutter', 'String', 'Dimmer', 'Contact', 'DateTime', 'Color', 'Player', 'Location', 'Call', 'Image', 'Number'}",
        type: 'error'
      }
    ])
  })

  test('with wrong function', () => {
    // TODO should WHITESPACE error pop up already if syntax before is already wrong?
    expect(parse('Group:Switch:Number')).toEqual([
      {
        column: 13,
        row: 0,
        text:
          "mismatched input 'Number' expecting {'EQUAL', 'AND', 'OR', 'NAND', 'NOR', 'AVG', 'SUM', 'MAX', 'MIN', 'COUNT', 'LATEST', 'EARLIEST'}",
        type: 'error'
      },
      {
        column: 19,
        row: 0,
        text: "mismatched input '<EOF>' expecting {NEWLINE, WHITESPACE}",
        type: 'error'
      }
    ])
  })

  test('with wrong itemtype + wrong function', () => {
    // TODO should WHITESPACE error pop up already if syntax before is already wrong?
    expect(parse('Group:Swi1tch:Number')).toEqual([
      {
        column: 6,
        row: 0,
        text:
          "mismatched input 'Swi1tch' expecting {'Switch', 'Rollershutter', 'String', 'Dimmer', 'Contact', 'DateTime', 'Color', 'Player', 'Location', 'Call', 'Image', 'Number'}",
        type: 'error'
      },
      {
        column: 14,
        row: 0,
        text:
          "mismatched input 'Number' expecting {'EQUAL', 'AND', 'OR', 'NAND', 'NOR', 'AVG', 'SUM', 'MAX', 'MIN', 'COUNT', 'LATEST', 'EARLIEST'}",
        type: 'error'
      },
      {
        column: 20,
        row: 0,
        text: "mismatched input '<EOF>' expecting {NEWLINE, WHITESPACE}",
        type: 'error'
      }
    ])
  })

  test('with itemtype + function + missing WHITESPACE', () => {
    expect(parse('Group:Switch:AVG')).toEqual([
      {
        column: 16,
        row: 0,
        text: "mismatched input '<EOF>' expecting {NEWLINE, WHITESPACE}",
        type: 'error'
      }
    ])
  })

  test('with itemtype + function + missing "("', () => {
    expect(parse('Group:Switch:AND')).toEqual([
      {
        column: 16,
        row: 0,
        text: "mismatched input '<EOF>' expecting '('",
        type: 'error'
      }
    ])
  })

  test('with itemtype + function + missing values in ()', () => {
    // TODO this was not in the original grammar, check if types are correct
    expect(parse('Group:Switch:AND()')).toEqual([
      {
        column: 17,
        row: 0,
        text:
          "mismatched input ')' expecting {IDENTIFIER, BOOLEAN, NUMBER, STRING}",
        type: 'error'
      }
    ])
  })

  test('with itemtype + function + only one value in ()', () => {
    // TODO this was not in the original grammar, check if types are correct
    expect(parse('Group:Switch:AND(value1)')).toEqual([
      {
        column: 23,
        row: 0,
        text: "mismatched input ')' expecting ','",
        type: 'error'
      }
    ])
  })

  test('with itemtype + function + missing "," bewtween values in ()', () => {
    // TODO this was not in the original grammar, check if types are correct
    // TODO adapt grammar to show better error?
    expect(parse('Group:Switch:AND(value1 value2)')).toEqual([
      {
        column: 23,
        row: 0,
        text: "mismatched input ' ' expecting ','",
        type: 'error'
      },
      {
        column: 30,
        row: 0,
        text:
          "extraneous input ')' expecting {<EOF>, 'Group', 'Switch', 'Rollershutter', 'String', 'Dimmer', 'Contact', 'DateTime', 'Color', 'Player', 'Location', 'Call', 'Image', 'Number', NEWLINE}",
        type: 'error'
      }
    ])
  })

  test('with itemtype + function + only one value in ()', () => {
    // TODO this was not in the original grammar, check if types are correct
    expect(parse('Group:Switch:AND(value1,value2)')).toEqual([
      {
        column: 31,
        row: 0,
        text: "mismatched input '<EOF>' expecting {NEWLINE, WHITESPACE}",
        type: 'error'
      }
    ])
  })
})
