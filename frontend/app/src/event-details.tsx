import { memo } from 'react';
import {
  Box,
  Flex,
  Heading,
  Image,
} from 'theme-ui';

import {
  EventDetails as EventDetailsType,
} from "./api";
import { sortByMediaOrder } from './support/media-order';


const MAX_COLUMN_WIDTH = '500px'

export const EventDetails = memo(({
  event,
}: {
  event: EventDetailsType,
}) => {
  const flexItem = {
    flex: ['unset', null, `0 1 ${MAX_COLUMN_WIDTH}`],
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: ['column', 'column', 'row'],
      justifyContent: ['unset', 'unset', 'space-between'],
      gap: '50px',
    }}>
      <Box sx={flexItem}>
        <Heading as='h1' sx={{ flex: '1 1 auto' }}>
          {event.title}
        </Heading>
        <Heading as='h3' sx={{ flex: '1 1 auto' }}>
          {event.location} / {event.time}
        </Heading>
        <Box>
          <Box
            sx={{
              fontFamily: 'body',
              marginBottom: '2em',
              maxWidth: ['100%', 'small'],
            }}
            dangerouslySetInnerHTML={{ __html: event.content }}
          />
        </Box>
      </Box>
      <Flex sx={{...flexItem, flexDirection: 'column', gap: '1em'}}>
        {sortByMediaOrder(event.media, event.media_order).map(({ url }) => {
          return (
            <Image
              key={url}
              src={url}
              sx={{
                backgroundColor: 'lightgray'
              }}
            />
          )
        })}
      </Flex>
    </Box>
  );
});
