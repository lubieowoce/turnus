import { ClassNames as BaseClassNames, ClassNamesContent } from "@emotion/react";
import { ReactNode } from "react";
import { ThemeUIStyleObject } from "theme-ui";
import { useApplyTheme } from "./use-apply-theme";

type GetClassNamesFn = (sx: ThemeUIStyleObject) => string;
type Consumer = (cls: GetClassNamesFn, original: ClassNamesContent) => ReactNode

type ClassNamesProps =
  | { children: Consumer }
  | { render: Consumer }

export const ClassNames = (props: ClassNamesProps) => {
  const applyTheme = useApplyTheme();
  const render = (original: ClassNamesContent) => {
    const cls: GetClassNamesFn = (sx) => original.css(applyTheme(sx));
    return ('render' in props ? props.render : props.children)(cls, original);
  };
  return (
    <BaseClassNames>{render}</BaseClassNames>
  );
}
