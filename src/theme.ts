import {
  merge,
  Theme,
} from 'theme-ui';

import baseTheme from 'theme-ui-preset-geist';

export const theme: Theme = merge(baseTheme as Theme, {
  styles: {
    root: {
      height: '100%',
    },
  },
  fonts: {
    body: 'serif',
    heading: 'Junicode Condensed'
  }
})