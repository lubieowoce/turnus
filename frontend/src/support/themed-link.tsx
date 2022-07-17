import { Link as BaseLink, LinkProps } from '@tanstack/react-location';
import { ClassNames } from "@emotion/react";
import { useApplyTheme } from './use-apply-theme';
import { ThemeUIStyleObject } from 'theme-ui';

const base = {
  color: 'text',
  textDecoration: 'none',
} as ThemeUIStyleObject

const active = {
  textDecorationLine: 'underline',
  textDecorationThickness: '2px',
} as ThemeUIStyleObject

const _default = {
  ...base,
  '&:visited': base,
  '&:hover': active,
  '&:active': active,
} as ThemeUIStyleObject

const reset = {
  'all': 'unset',
  'cursor': 'pointer',
} as ThemeUIStyleObject

const styles = {
  default: _default,
  reset: reset,
}

type Props = {
  sx?: ThemeUIStyleObject,
  variant?: keyof typeof styles
} & LinkProps;

export const Link = ({ variant = 'default', sx, ...props }: Props) => {
  const applyTheme = useApplyTheme()
  return (
    <ClassNames>
      {({ css }) => {
        const linkClass = css(applyTheme({ ...styles[variant], ...sx }));
        return <BaseLink {...props} className={linkClass} />
      }}
    </ClassNames>
  )
}
