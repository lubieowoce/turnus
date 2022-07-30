import { memo } from 'react';
import {
  Box,
  Heading,
  Paragraph,
  Flex,
  Text,
} from 'theme-ui';

import { EventList as EventListType } from "./api";
import { PADDING_BODY } from './config';
import { EntryWithImages } from './entry-with-images';

export const EventList = memo(({
  eventList,
}: {
  eventList: EventListType,
}) => {
  const events = Object.entries(eventList.events);
  return (
    <Box sx={{ marginBottom: '2em' }}>
      <Flex py='1em' px={PADDING_BODY.horizontal} mb='3em'>
        <Heading as='h1' sx={{ flex: '1 1 auto' }}>
          Wystawy
        </Heading>
      </Flex>
      <Box sx={{ paddingLeft: PADDING_BODY.horizontal }}>
        {!events.length && (
          <Text sx={{ fontStyle: 'italic' }}>{'Nie ma tu jeszcze żadnych wydarzeń.'}</Text>
        )}
        <Flex sx={{ gap: ['4em', '2em'], flexDirection: 'column', alignItems: 'stretch' }}>
          {events.map(([id, eventSummary]) =>
            <EntryWithImages
              link={`./${eventSummary.id}`}
              description={
                <Box>
                  <Heading as='h2'>{eventSummary.title}</Heading>
                  <Heading as='h3'>{eventSummary.location} / {eventSummary.time}</Heading>
                  <br />
                  <Paragraph sx={{ fontSize: 0 }}>{eventSummary.summary} ⟶</Paragraph>
                </Box>
              }
              images={Object.values(eventSummary.media)}
              key={id}
            />
          )}
        </Flex>
      </Box>
    </Box>
  );
})
