import { forwardRef } from "react";
import {
  Dialog,
  DialogProps as BaseDialogProps,
  DialogBackdrop,
  DialogBackdropProps as BaseDialogBackdropProps
} from "reakit/Dialog";
import { ThemeUIStyleObject } from "theme-ui";
import { ClassNames } from "./classnames";

const styles = {
  dialog: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'fixed',
  } as ThemeUIStyleObject,
  backdrop: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'fixed',
  } as ThemeUIStyleObject,
}

type DialogProps = Omit<BaseDialogProps, 'className'> & {
  sx?: ThemeUIStyleObject
}

export const ThemedDialog = forwardRef<any, DialogProps>(({ sx, children, ...props }, ref) => {
  return (
    <ClassNames>{(cls) => (
      <Dialog
        ref={ref}
        {...props}
        className={cls({...styles.dialog, ...sx })}
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
  return (
    <ClassNames>{(cls) => (
      <DialogBackdrop
        ref={ref}
        {...props}
        className={cls({ ...styles.backdrop, ...sx })}
      >
        {children}
      </DialogBackdrop>
    )}</ClassNames>
  )
});
