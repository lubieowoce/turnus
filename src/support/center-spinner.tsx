import { Flex, Spinner } from "theme-ui";

export const CenterSpinner = ({ minHeight = '10em' }) => (
  <Flex
    sx={{
      width: '100%',
      height: '100%',
      minHeight,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Spinner />
  </Flex>
)