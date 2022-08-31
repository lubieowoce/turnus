import { Box, Close, Flex, Heading, Paragraph, Spinner, Text, ThemeUIStyleObject } from 'theme-ui';
import { DialogProps } from "reakit/Dialog";
import { fancyTextStyle } from "./config";
import { ThemedDialog, ThemedDialogBackdrop } from "./support/themed-dialog";
import { useAuthors, usePostsByAuthor } from './api';
import { Anchor } from './support/themed-link';

const styles = {
  dialog: {
    top: 0,
    bottom: 0,
    right: 0,
    left: 'unset',
    width: ['100vw', 'sidebar'],
    backgroundColor: 'backgroundYellow',
    boxShadow: 'medium',
  } as ThemeUIStyleObject,
}

export const InfoPopup = (props: Omit<DialogProps, 'className'>) => {
  return (
    <ThemedDialogBackdrop {...props}>
      <ThemedDialog
        {...props}
        sx={styles.dialog}
      >
        <Box sx={{ padding: '1.5rem', maxHeight: '100%', overflowY: 'scroll' }}>
          <Close
            onClick={props.hide}
            sx={{ cursor: 'pointer', position: 'absolute', top: 0, right: 0, margin: '1rem' }}
          />
          <Content />
        </Box>
      </ThemedDialog>
    </ThemedDialogBackdrop>
  )
}

type LinkDef = { label: string, link: string }

const links = {
  email: {
    label: 'e-mail',
    link: 'mailto:turnustwojegozycia@gmail.com',
  },
  instagram: {
    label: 'instagram',
    link: 'https://www.instagram.com/turnusik',
  },
  facebook: {
    label: 'facebook',
    link: 'https://www.facebook.com/turnustwojegozycia'
  },
  website: {
    label: 'turnus.com',
    link: 'https://www.turnus.com'
  },
}

const renderLink = (link: LinkDef) => <Anchor variant='underlined' href={link.link}>{link.label}</Anchor>

const Content = () => (<>
  <Heading sx={{ fontWeight: 'normal'}}>
    Skądinąd,<br />
    kolektywu Turnus<br />
    2021 - do teraz
  </Heading>
  <Flex sx={{ ...fancyTextStyle, justifyContent: 'end', my: '1em' }}>
    <Box>
      {renderLink(links.email)}<br />
      {renderLink(links.instagram)}<br />
      {renderLink(links.facebook)}<br />
      {renderLink(links.website)}
    </Box>
  </Flex>
  <br />
  <Paragraph sx={fancyTextStyle}>Jak masz swój projekt, zgłoś go <Anchor href={links.email.link} variant='underlined'>tutaj</Anchor>!</Paragraph>
  <br />
  <Paragraph sx={fancyTextStyle}>W projekcie wzięli udział:</Paragraph>
  <br />
  <PeopleList />
</>)

const PeopleList = () => {
  const authors = useAuthors();
  if (authors.status === 'error') {
    return null
  };
  if (authors.status !== 'success') {
    return <Spinner />
  }
  return (<>
    {authors.data.map((authorName) =>
      <Box key={authorName}>
        <Text sx={fancyTextStyle}>{authorName}</Text>
      </Box>
    )}
  </>
  )

}
