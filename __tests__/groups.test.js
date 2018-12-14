const { parse } = require('../src/index')

describe('Tests for parsing groups from .items files', () => {
  test('Simple group', () => {
    // empty array means there are no errors
    expect(parse('Group g1')).toEqual([])
  })

  
  test('Simple group with error', () => {
    // empty array means there are no errors
    expect(parse('Gro1up s1')).toEqual([
      {
        column: 0,
        row: 0,
        text:
          "mismatched input 'Gro1up' expecting {'Group', 'Switch', 'Rollershutter', 'String', 'Dimmer', 'Contact', 'DateTime', 'Color', 'Player', 'Location', 'Call', 'Image', 'Number'}",
        type: 'error'
      }
    ])
  })

  test('Simple group + NL', () => {
    // empty array means there are no errors
    expect(parse('Group s1\r')).toEqual([])
    expect(parse('Group s1\n')).toEqual([])
    expect(parse('Group s1\r\n')).toEqual([])
    expect(parse('Group s1\n\r')).toEqual([])
  })

  test('multiple simple groups', () => {
    const res = parse(
      `Switch s1\nString s2\nDimmer s\nGroup abc\nRollershutter r\nContact c\nDateTime d\nColor c\nPlayer p\nLocation l\nCall c\nImage i\nNumber n`
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

  test('simple group with label and parent group', () => {
    const res = parse('Group g1 "G1" (g2)')
    expect(res).toEqual([])
  })

  test('more complex group', () => {
      const res = parse('Group g1 "My Group" <switch> (testGroup) ["LIGHTING"]')
      expect(res).toEqual([])
  })
})
