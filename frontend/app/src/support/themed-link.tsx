import { Link as BaseLink, LinkProps as BaseLinkProps } from '@tanstack/react-location';
import { ClassNames } from "./classnames";
import { ThemeUIStyleObject } from 'theme-ui';
import { forwardRef } from 'react';

const base = {
  color: 'text',
  textDecoration: 'none',
} as ThemeUIStyleObject

const active = {
  textDecorationLine: 'underline !important',
  textDecorationThickness: '2px !important',
} as ThemeUIStyleObject

const makeStyle = ({ base, active }) => ({
  base: {
    ...base,
    '&:visited': base,
    '&:hover': active,
    '&:active': active,
  } as ThemeUIStyleObject,
  active: active as ThemeUIStyleObject,
})

const _default = makeStyle({ base, active });

const underlined = makeStyle({
  base: { ...base, textDecoration: 'underline', textDecorationThickness: '1px' },
  active,
})

const reset = makeStyle({
  base: {
    'all': 'unset',
    'cursor': 'pointer',
  } as ThemeUIStyleObject,
  active: {}
})

const styles = {
  default: _default,
  reset: reset,
  underlined: underlined,
}

type BaseProps = {
  sx?: ThemeUIStyleObject,
  variant?: keyof typeof styles
};

export type LinkProps = BaseProps & { noActive?: boolean } & BaseLinkProps;

export const Link = ({ variant = 'default', noActive = false, sx, ...props }: LinkProps) => {
  return (
    <ClassNames>{(cls) => {
      const activeCls = cls(styles[variant].active);
      const dynamicCls = cls({ ...styles[variant].base, ...sx });
      return (
        <BaseLink
          {...props}
          getActiveProps={noActive ? undefined : () => ({ className: `${activeCls} ${dynamicCls}`  })}
          className={dynamicCls}
        />
      )
    }}</ClassNames>
  )
}

export type AnchorProps = Omit<React.HTMLProps<HTMLAnchorElement>, 'className'> & BaseProps;

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(({ variant = 'default', sx, ...props }, ref) => {
  return (
    <ClassNames>{(cls) => {
      const dynamicCls = cls({ ...styles[variant].base, ...sx });
      return (
        <a
          ref={ref}
          className={dynamicCls}
          {...props}
        />
      )
    }}</ClassNames>
  )
})
