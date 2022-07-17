import { useCallback } from 'react';
import { css as transformStyleObject, ThemeUIStyleObject, useThemeUI } from 'theme-ui';


export const useApplyTheme = () => {
  const theme = useThemeUI();
  return useCallback((styles: ThemeUIStyleObject) => transformStyleObject(styles)(theme), [theme])
}