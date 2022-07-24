import { Box } from "theme-ui";

export const ResponsiveSwitch = ({ small, big }) => {
  return (
    <Box sx={{ display: 'contents' }}>
      <Box sx={{ display: ['contents', 'none'] }}>{small}</Box>
      <Box sx={{ display: ['none', 'contents'] }}>{big}</Box>
    </Box>
  );
}
