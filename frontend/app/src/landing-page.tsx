import { Box, Image, Paragraph } from 'theme-ui';


export const Landing = () => {
  const logo = `${process.env.PUBLIC_URL}/assets/landing-logo.svg`;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Image sx={{ width: ['90%', '80%', 'calc(clamp(35rem, 50%, 40rem))'] }} src={logo} />
      <Paragraph sx={{ width: ['90%', '80%', 'calc(clamp(30rem, 50%, 35rem))'], fontFamily: 'heading', fontSize: 2 }}>
        {text}
      </Paragraph>
    </Box>
  );
}

const text = `
Skądinąd to lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
`