import { ClassNames } from "@emotion/react";
import { Dialog, DialogProps, DialogBackdrop } from "reakit/Dialog";
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
}

type Props = Omit<DialogProps, 'className'> & {
  sx?: ThemeUIStyleObject
}

export const ThemedDialog = ({ sx, ...props }: Props) => {
  const applyTheme = useApplyTheme()
  return (
    <ClassNames>{({ css }) => (
      <DialogBackdrop {...props}>
        <Dialog
          {...props}
          className={css(applyTheme({...styles.dialog, ...sx }))}
        >
          {props.children}
        </Dialog>
      </DialogBackdrop>
    )}</ClassNames>
  )
}