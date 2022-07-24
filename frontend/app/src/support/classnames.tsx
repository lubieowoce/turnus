import { ClassNames as BaseClassNames } from "@emotion/react";
import { ReactNode } from "react";
import { ThemeUIStyleObject } from "theme-ui";
import { useApplyTheme } from "./use-apply-theme";

type GetClassNamesFn = (sx: ThemeUIStyleObject) => string;

type ClassNamesProps =
  | { children: (cls: GetClassNamesFn) => ReactNode }
  | { render: (cls: GetClassNamesFn) => ReactNode }

export const ClassNames = (props: ClassNamesProps) => {
  const applyTheme = useApplyTheme();
  const render = ({ css }) => {
    const cls: GetClassNamesFn = (sx) => css(applyTheme(sx));
    return ('render' in props ? props.render : props.children)(cls);
  };
  return (
    <BaseClassNames>{render}</BaseClassNames>
  );
}
