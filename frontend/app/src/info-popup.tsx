import { Box, Close, Flex, Heading, ThemeUIStyleObject } from 'theme-ui';
import { DialogProps } from "reakit/Dialog";
import { fancyTextStyle } from "./config";
import { ThemedDialog, ThemedDialogBackdrop } from "./support/themed-dialog";

const styles = {
  dialog: {
    top: 0,
    bottom: 0,
    right: 0,
    left: 'unset',
    width: 'sidebar',
    backgroundColor: 'backgroundYellow',
    boxShadow: 'large',
    padding: '1.5rem',
  } as ThemeUIStyleObject,
}

export const InfoPopup = (props: Omit<DialogProps, 'className'>) => {
  return (
    <ThemedDialogBackdrop {...props}>
      <ThemedDialog
        {...props}
        sx={styles.dialog}
      >
        <Close
          onClick={props.hide}
          sx={{ cursor: 'pointer', position: 'absolute', top: 0, right: 0, margin: '1rem' }}
        />
        <Box>
          <Content />
        </Box>
      </ThemedDialog>
    </ThemedDialogBackdrop>
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
