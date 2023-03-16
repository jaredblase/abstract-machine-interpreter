import { EditorView } from 'codemirror'
import { tags as t } from '@lezer/highlight'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'

export const theme = EditorView.theme(
  {
    '&': {
      color: '#fff',
      backgroundColor: '#1e1e1e',
    },
    '.cm-gutters': {
      backgroundColor: '#1e1e1e',
      color: '#8c8c8c',
    },
    '.cm-cursor': {
      borderColor: '#fff',
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: '#007accAA',
    },
    '.cm-line': {
      borderBlock: '1px solid transparent',
    },
    '.cm-activeLine': {
      backgroundColor: 'unset',
      borderBlock: '1px solid rgb(255 255 255 / 0.1)',
    },
		'.cm-selectionMatch': {
			backgroundColor: '#3a3d41'
		},
    settings: {
      lineHighlight: '#8a91991a',
    },
  },
  { dark: true }
)

export const highlights = syntaxHighlighting(
  HighlightStyle.define([
    { tag: t.comment, color: '#6a9955' },
    { tag: t.variableName, color: '#4fc1ff' },
    { tag: t.string, color: '#ce9178', fontStyle: 'italic' },
    { tag: t.number, color: '#b5cea8' },
    { tag: [t.bool, t.null, t.keyword], color: '#569cd6' },
    { tag: t.operator, color: '#d4d4d4' },
    {
      tag: [t.className, t.definition(t.typeName), t.typeName],
      color: '#4ec9b0',
    },
    { tag: [t.paren], color: 'yellow' },
  ])
)
