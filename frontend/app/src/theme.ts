import {
  merge,
  Theme,
} from 'theme-ui';
import { omit } from 'lodash';

import rawBaseTheme from 'theme-ui-preset-geist';


const baseTheme = omit(rawBaseTheme, [
  'colors.modes', // disable dark mode for now
  'styles.root', // disable height: 100% what messes up body-scroll locks in modals
]);

export const theme = merge(baseTheme as Theme, {
  fonts: {
    body: 'Karrik, Arial, sans-serif',
    heading: '"Junicode Condensed", Georgia, serif'
  },
  colors: {
    background: '#f3f2ef',
    backgroundYellow: 'rgb(255,253,112)',
  },
  sizes: {
    'sidebar': '350px',
  },
})