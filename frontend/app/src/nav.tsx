import { PropsWithChildren } from "react";
import { useDialogState } from "reakit/Dialog";
import { Box, Flex, ThemeUIStyleObject, Close, Text } from "theme-ui";
import { fancyTextStyle, PADDING_BODY, HEADER_HEIGHT } from "./config";
import { ResponsiveSwitch } from "./support/responsive";
import { ThemedDialog } from "./support/themed-dialog";
import { Link } from "./support/themed-link";

type LinkDef = { to: string, label: string }

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
            <Link sx={fancyTextStyle} to={link.to}>{link.label}</Link>
          </Box>
        )}
      />
    </Flex>
  )
}

const popupNavColors = [
  'rgba(28, 186, 78)',
  'rgba(221, 221, 221)',
  'rgba(74, 192, 244)',
]

const PopupNav = ({ links }: { links: LinkDef[] }) => {
  const navPopup = useDialogState();

  const item = ({ to, color, label }) => (
    <Link key={to} variant='reset' to={to} sx={{ flex: '1 auto' }} onClick={navPopup.hide}>
      <Round color={color} sx={{ height: '100%' }}>
        <Text style={fancyTextStyle}>
          {label}
        </Text>
      </Round>
    </Link>
  );

  return (
    <>
      <Link
        variant='default'
        style={{ ...fancyTextStyle, cursor: 'pointer' }}
        onClick={(e) => { e.preventDefault(); navPopup.toggle() }}
      >
        Menu
      </Link>
      <ThemedDialog {...navPopup} sx={{ top: HEADER_HEIGHT }}>
        <Flex sx={{
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'stretch',
          alignItems: 'stretch',
        }}>
          <Close
            onClick={navPopup.hide}
            sx={{ cursor: 'pointer', position: 'fixed', top: 0, right: 0, margin: '1rem', backgroundColor: 'background' }}
          />
          {links.map(({ to, label }, i) =>
            item({ to, label, color: popupNavColors[i % popupNavColors.length] })
          )}
        </Flex>
      </ThemedDialog>
    </>
  )
}

type RoundProps = PropsWithChildren<{ color: string, sx?: ThemeUIStyleObject }>

const Round = ({ color, sx, children }: RoundProps) => (
  <Flex sx={{
    borderRadius: '100%',
    border: '3px solid black',
    backgroundColor: color,
    justifyContent: 'center',
    alignItems: 'center',
    ...sx,
  }}>
    {children}
  </Flex>
);
