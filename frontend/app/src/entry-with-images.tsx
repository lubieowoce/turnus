import { Flex, Box, Image } from "theme-ui"
import { ImageMediaObject } from "./api";
import { PADDING_BODY } from './config';
import { Link } from './support/themed-link'

const makeImageDims = (heightEm) => {
  return {
    height: `${heightEm}em`,
    width: `${(4 / 3) * heightEm}em`,
  }
}

const _imageDims = [makeImageDims(10), makeImageDims(15), makeImageDims(20)]
const imageDims = {
  width: _imageDims.map((d) => d.width),
  height: _imageDims.map((d) => d.height),
}

type Props = {
  description: React.ReactNode,
  link: string,
  images: ImageMediaObject[],
}

export const EntryWithImages = ({ description, link, images }: Props) => {
  return (
    <Flex sx={{
      flexDirection: ['column-reverse', null, 'row'],
      width: '100%',
      maxWidth: '100%',
      // transition: 'all ease-in-out 0.1s',
      // background: 'rgba(0,0,0, 0)',
      // outline: '1em solid rgba(0,0,0, 0)',
      // '&:hover': {
      //   backgroundColor: 'rgba(0,0,0, 0.05)',
      //   outlineColor: 'rgba(0,0,0, 0.05)',
      // }
    }}>
      <Link
        variant='reset' to={link}
        sx={{
          display: 'block',
          flex: [null, null, '0 0 40ch'],
          marginRight: [PADDING_BODY.horizontal, null, 'unset'],
        }}
      >
        {description}
      </Link>
      <Spacer />
      <Flex sx={{
        overflowY: 'clip',
        overflowX: 'auto',
        gap: '1em',
        flex: '1 auto',
        height: imageDims.height,
      }}>
        {images.map(({ sizes: { thumbnail: url } }) =>
          <Link variant='reset' key={url} to={link} sx={{ flex: 'none' }}>
            <Image
              src={url}
              sx={{ 
                objectFit: 'cover',
                width: imageDims.width,
                height: imageDims.height,
                backgroundColor: 'lightgray'
              }}
            />
          </Link>
        )}
        <Spacer />
      </Flex>
    </Flex>
  )
}

const Spacer = () => <Box sx={{ flex: '0 0 1em' }} />
