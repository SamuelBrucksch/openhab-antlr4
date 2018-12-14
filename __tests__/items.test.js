const { parse } = require('../src/index')
const { complexItems } = require('../__resources__/resources')

describe('Tests for parsing items from .items files', () => {
  test('Simple item', () => {
    // empty array means there are no errors
    expect(parse('Switch s1')).toEqual([])
  })

  test('Simple item with error', () => {
    expect(parse('Swi1tch s1')).toEqual([
      {
        column: 0,
        row: 0,
        text:
          "mismatched input 'Swi1tch' expecting {'Group', 'Switch', 'Rollershutter', 'String', 'Dimmer', 'Contact', 'DateTime', 'Color', 'Player', 'Location', 'Call', 'Image', 'Number', NEWLINE}",
        type: 'error'
      }
    ])
  })

  test('Simple item + NL', () => {
    // empty array means there are no errors
    expect(parse('Switch s1\r')).toEqual([])
    expect(parse('Switch s1\n')).toEqual([])
    expect(parse('Switch s1\r\n')).toEqual([])
    expect(parse('Switch s1\n\r')).toEqual([])
  })

  test('multiple Simple item', () => {
    const res = parse(
      `Switch s1\nString s2\nDimmer s\nGroup abc\nRollershutter r\nContact c\nDateTime d\nColor c\nPlayer p\nLocation l\nCall c\nImage i\nNumber n`
    )
    expect(res).toEqual([])
  })

  test('simple item with label', () => {
    const res = parse('Switch switch "My Switch"')
    expect(res).toEqual([])
  })

  test('more complex item', () => {
    const res = parse(
      'Switch switch "My Switch" <switch> (testGroup) ["LIGHTING"]'
    )
    expect(res).toEqual([])
  })

  test('various items from openhab docs', () => {
    expect(parse(complexItems)).toEqual([])
  })
})
