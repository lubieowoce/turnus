import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { Box, Image, Paragraph } from 'theme-ui';
import { preloadMapView } from './map';
import { Link } from './support/themed-link';


export const Landing = () => {
  const logo = `${process.env.PUBLIC_URL}/assets/landing-logo.svg`;
  const queryClient = useQueryClient();
  useEffect(() => {
    preloadMapView(queryClient);
  }, [queryClient])
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Image sx={{ width: ['90%', '80%', 'calc(clamp(35rem, 50%, 40rem))'] }} src={logo} />
      <Link to="/mapa" variant="reset" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paragraph sx={{ width: ['90%', '80%', 'calc(clamp(30rem, 50%, 35rem))'], fontFamily: 'heading', fontSize: 2, textAlign: 'center', whiteSpace: 'pre-wrap', lineHeight: 1 }}>
          {text}
        </Paragraph>
        <Box sx={{ fontFamily: 'heading', fontSize: 3, color: `${colors.blue}`}}>
          ⟶
        </Box>
      </Link>
    </Box>
  );
}

const text = (
  'Skądinąd to wystawa objazdowa i internetowe archiwum' + '\n' +
  'spostrzeżeń na temat miejsc pochodzenia.'
)

const colors = {
  'orange': '#ff7600',
  // 'beige': '#f3ecd9',
  'yellow': '#ffff02',
  'blue': '#01c4ff',
  'neon-green': '#02ff09',
  'light-pink': '#fd7b89',
  'grey': '#777365',
  'lila': '#7c91cb',
  'hot-pink': '#f5629d',
}