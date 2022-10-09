import { Box, Close, Flex, Heading, Paragraph, Spinner, Text, ThemeUIStyleObject } from 'theme-ui';
import { DialogProps } from "reakit/Dialog";
import { fancyTextStyle } from "./config";
import { ThemedDialog, ThemedDialogBackdrop } from "./support/themed-dialog";
import { useAuthors } from './api';
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
        {(props.visible ?? false) && (
          <Box sx={{ padding: '1.5rem', maxHeight: '100%', overflowY: 'scroll' }}>
            <Close
              onClick={props.hide}
              sx={{ cursor: 'pointer', position: 'absolute', top: 0, right: 0, margin: '1rem' }}
            />
            <Content />
          </Box>
        )}
      </ThemedDialog>
    </ThemedDialogBackdrop>
  )
}

type LinkDef = { label: string, link: string }

const EMAIL = 'turnustwojegozycia@gmail.com'

const links = {
  email: {
    label: 'e-mail',
    link: `mailto:${EMAIL}`,
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
  <Description />
  <br />
  <Heading as="h2" mt="1em">W projekcie wzięli udział:</Heading>
  <br />
  <PeopleList />
</>)

const P_SPACING = "0.66em"

const Description = () => <Flex sx={{ flexDirection: 'column', gap: P_SPACING }}>
  <Paragraph>
    <strong>Skądinąd</strong> to wystawa objazdowa i internetowe archiwum spostrzeżeń na temat miejsc pochodzenia.
    Pomysłodawcami tego projektu są <Anchor variant='underlined' href="#turnusowicze">Turnusowicze*</Anchor> poznani dzięki grupie 
    {' '}<Anchor variant='underlined' href='https://www.facebook.com/groups/282501663323411'>wszyscy na turnus wszyscy to turnus</Anchor>.
    Prace o rodzinnych miastach i wsiach wyłonione podczas open callu ruszą w formie wystawy w podróż po całej Polsce.
    Internetowe archiwum projektu jest za to ciągle otwarte na nowe historie, a naszym marzeniem jest zapełnienie mapy Polski jak największą ilością kropek.
  </Paragraph>
  <Paragraph>
    <strong>Pomysłodawcy projektu</strong>: Joanna Klikowicz, Marika Gorczyńska, Bartosz Korszun, Mateusz Pipczyński, Michał Żyłowski, Wojtek Grum, Klaudia Figura, Patryk Powierza
  </Paragraph>
  <Paragraph id="turnusowicze">
    <strong>* Turnusowicz</strong> - to osoba, która chociaż raz współtworzyła wydarzenie turnusu przez przesłanie swojej pracy,
    występ, udział w spotkaniu, nieocenioną pomoc, dziękujemy, że jesteście z nami Turnusowicze!
  </Paragraph>

  <Heading as="h2" mt="1em">Przyjmij wystawę u siebie</Heading>
  <Paragraph>
    Chcesz, aby wystawa Skądinąd odwiedziła Twoje miasto, napisz do nas!
    Wystarczy wysłać maila na <Anchor variant='underlined' href={links.email.link}>{EMAIL}</Anchor>,
    w tytule maila wpisać <em>"SKĄDINĄD - WYSTAWA W (tutaj wpisz nazwę miejsca)"</em>,
    a w treści opisać miejsce w którym mogłaby się odbyć wystawa.
  </Paragraph>

  <Heading as="h2" mt="1em">Dodaj swoje miejsce na stronę</Heading>
  <Paragraph>
    Jeżeli chcesz, aby twoja historia o miejscu z którego pochodzisz
    znalazła się w naszych archiwum, wystarczy wysłać maila na <Anchor variant='underlined' href={links.email.link}>{EMAIL}</Anchor>,
    w tytule wpisać <em>"SKĄDINĄD - NOWA HISTORIA"</em>, a w treści podać miejsce z którego pochodzisz,
    imię i nazwisko lub pseudonim, tytuł pracy/historii (opcjonalnie), krótki opis oraz minimum jedno zdjęcie. 
  </Paragraph>
</Flex>

const PeopleList = () => {
  const authors = useAuthors();
  if (authors.status === 'error') {
    return null
  };
  if (authors.status !== 'success') {
    return <Spinner />
  }
  return (<>
    {[...authors.data].sort().map((authorName) =>
      <Box key={authorName}>
        <Text sx={fancyTextStyle}>{authorName}</Text>
      </Box>
    )}
  </>
  )

}
