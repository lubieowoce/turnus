import { memo} from 'react';
import {
  Box,
  Heading,
} from 'theme-ui';

import {
  EventDetails as EventDetailsType,
} from "./api";


export const EventDetails = memo(({
  event,
}: {
  event: EventDetailsType,
}) => {
  return (
    <Box>
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
  );
});
