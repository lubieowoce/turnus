import {
  merge,
  Theme,
} from 'theme-ui';
import { omit } from 'lodash';

import rawBaseTheme from 'theme-ui-preset-geist';

// disable dark mode for now
const baseTheme = {
  ...rawBaseTheme,
  colors: omit(rawBaseTheme.colors, 'modes'),
}

console.log(baseTheme)

export const theme = merge(baseTheme as Theme, {
  styles: {
    root: {
      height: '100%',
    },
  },
  fonts: {
    body: 'Arial',
    heading: 'Junicode Condensed'
  },
  colors: {
    background: '#f3f2ef',
    backgroundYellow: 'rgb(255,253,112)',
  },
  sizes: {
    'sidebar': 350,
  },
})