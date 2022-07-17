import { ClassNames } from "@emotion/react";
import { Box, Close, Flex, Heading, ThemeUIStyleObject } from 'theme-ui';
import { Dialog, DialogProps, DialogBackdrop } from "reakit/Dialog";
import { fancyTextStyle } from "./config";
import { useApplyTheme } from "./support/use-apply-theme";

const styles = {
  dialog: {
    top: 0,
    bottom: 0,
    right: 0,
    width: 'sidebar',
    backgroundColor: 'backgroundYellow',
    position: 'absolute',
    boxShadow: 'large',
    padding: '1.5rem',
  } as ThemeUIStyleObject,
}

export const InfoPopup = (props: Omit<DialogProps, 'className'>) => {
  const applyTheme = useApplyTheme()
  return (
    <ClassNames>{({ css }) => (
      <DialogBackdrop {...props}>
        <Dialog
          {...props}
          className={css(applyTheme(styles.dialog))}
        >
          <Close
            onClick={props.hide}
            sx={{ cursor: 'pointer', position: 'absolute', top: 0, right: 0, margin: '1rem' }}
          />
          <Box>
            <Content />
          </Box>
        </Dialog>
      </DialogBackdrop>
    )}</ClassNames>
  )
}

const Content = () => (<>
  <Heading>
    Skądinąd,<br />
    kolektywu Turnus<br />
    2021 - do teraz
  </Heading>
  <Flex sx={{ ...fancyTextStyle, justifyContent: 'end' }}>
    <Box>
      <a href="#">e-mail</a><br />
      <a href="#">instagram</a><br />
      <a href="#">facebook</a><br />
      <a href="#">turnus.com</a>
    </Box>
  </Flex>
</>)
