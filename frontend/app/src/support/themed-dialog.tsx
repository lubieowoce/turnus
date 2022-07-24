import { ClassNames } from "@emotion/react";
import { forwardRef } from "react";
import {
  Dialog,
  DialogProps as BaseDialogProps,
  DialogBackdrop,
  DialogBackdropProps as BaseDialogBackdropProps
} from "reakit/Dialog";
import { ThemeUIStyleObject } from "theme-ui";
import { useApplyTheme } from "./use-apply-theme"

const styles = {
  dialog: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
  } as ThemeUIStyleObject,
  backdrop: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
  } as ThemeUIStyleObject,
}

type DialogProps = Omit<BaseDialogProps, 'className'> & {
  sx?: ThemeUIStyleObject
}

export const ThemedDialog = forwardRef<any, DialogProps>(({ sx, children, ...props }, ref) => {
  const applyTheme = useApplyTheme()
  return (
    <ClassNames>{({ css }) => (
      <Dialog
        ref={ref}
        {...props}
        className={css(applyTheme({...styles.dialog, ...sx }))}
      >
        {children}
      </Dialog>
    )}</ClassNames>
  )
})

type DialogBackdropProps = Omit<BaseDialogBackdropProps, 'className'> & {
  sx?: ThemeUIStyleObject
}

export const ThemedDialogBackdrop = forwardRef<any, DialogBackdropProps>(({ sx, children, ...props }, ref) => {
  const applyTheme = useApplyTheme()
  return (
    <ClassNames>{({ css }) => (
      <DialogBackdrop
        ref={ref}
        {...props}
        className={css(applyTheme({ ...styles.backdrop, ...sx })) + ' my-backdrop'}
      >
        {children}
      </DialogBackdrop>
    )}</ClassNames>
  )
});
