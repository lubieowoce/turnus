import {
  merge,
  Theme,
} from 'theme-ui';

import baseTheme from 'theme-ui-preset-geist';

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
  }
})