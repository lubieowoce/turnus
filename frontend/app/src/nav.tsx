import { useDialogState } from "reakit/Dialog";
import { Box, Flex, Close, Image } from "theme-ui";
import { fancyTextStyle, PADDING_BODY, HEADER_HEIGHT } from "./config";
import { ResponsiveSwitch } from "./support/responsive";
import { ThemedDialog, ThemedDialogBackdrop } from "./support/themed-dialog";
import { Link } from "./support/themed-link";

type LinkDef = { to: string, label: string, color: string, illustration: string }

export const MainNav = ({ links }: { links: LinkDef[] }) => {
  return (
    <Flex
      py='1em' px={PADDING_BODY.horizontal}
      sx={{ gap: '7ch' }}
    >
      <ResponsiveSwitch
        small={<PopupNav links={links} />}
        big={links.map((link) =>
          <Box key={link.to}>
            <Link sx={{ ...fancyTextStyle, textDecorationColor: `${link.color} !important` }} to={link.to}>{link.label}</Link>
          </Box>
        )}
      />
    </Flex>
  )
}

const PopupNav = ({ links }: { links: LinkDef[] }) => {
  const navPopup = useDialogState();

  return (
    <>
      <Link
        variant='default'
        style={{ ...fancyTextStyle, cursor: 'pointer' }}
        onClick={(e) => { e.preventDefault(); navPopup.toggle() }}
      >
        menu
      </Link>
      <ThemedDialogBackdrop {...navPopup} sx={{ backgroundColor: 'background'}}>
        <ThemedDialog {...navPopup} sx={{ top: HEADER_HEIGHT }}>
          <Flex sx={{
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'stretch',
            alignItems: 'center',
          }}>
            <Close
              onClick={navPopup.hide}
              sx={{ cursor: 'pointer', position: 'fixed', top: 0, right: 0, margin: '1rem', backgroundColor: 'background' }}
            />
            {links.map(({ to, illustration, label }) =>
              <Box key={to} sx={{ flex: '1 auto', maxWidth: '80vw' }}>
                <Link key={to} variant='reset' to={to} onClick={navPopup.hide}>
                  <Image src={illustration} alt={label} />
                </Link>
              </Box>
            )}
          </Flex>
        </ThemedDialog>
      </ThemedDialogBackdrop>
    </>
  )
}
