import { Link as BaseLink, LinkProps } from '@tanstack/react-location';
import { ClassNames } from "./classnames";
import { ThemeUIStyleObject } from 'theme-ui';

const base = {
  color: 'text',
  textDecoration: 'none',
} as ThemeUIStyleObject

const active = {
  textDecorationLine: 'underline',
  textDecorationThickness: '2px',
} as ThemeUIStyleObject

const mergedActive = {
  ...base,
  ...active,
}

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
  return (
    <ClassNames>{(cls) => {
      const activeCls = cls(mergedActive);
      const dynamicCls = cls({ ...styles[variant], ...sx });
      return (
        <BaseLink
          {...props}
          getActiveProps={() => ({ className: activeCls  })}
          className={dynamicCls}
        />
      )
    }
    }</ClassNames>
  )
}
