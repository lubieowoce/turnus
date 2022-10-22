import { theme } from "./theme";

export const HEADER_HEIGHT = '72px';

export const PADDING_BODY = {
  horizontal: '2em'
}

export const COLORS_ACCENT = {
  'brightGreen': 'rgb(0,255,10)',
  'orange': 'rgb(255,118,0)',
  'mint': 'rgb(0,255,157)',
  'lightBlue': 'rgb(0,196,255)',
  'pink': 'rgb(255,85,157)',
  // 'yellow': 'rgb(255,255,0)',
  'salmon': 'rgb(253,123,137)',
  'nightBlue': 'rgb(126,161,255)',
}

export const fancyTextStyle = {
  fontFamily: theme!.fonts!['heading'],
  fontSize: theme!.fontSizes![4-1],
}

export const IMAGE_FALLBACK_COLOR = '#e7e7e7';
