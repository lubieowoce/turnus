import { ClassNames } from "@emotion/react";
import { Link } from "@tanstack/react-location";
import { Box, Flex } from "theme-ui";
import { Places } from "./api";
import { COLORS_ACCENT, fancyTextStyle, PADDING_BODY } from "./config";

export const PlaceList = ({ places }: { places: Places }) => {
  return (
    <Flex py='1em' px={PADDING_BODY.horizontal} sx={{ flexWrap: 'wrap', flexDirection: ['column', 'row'] }}>
      {Object.values(places.items).map((place, index, arr) => {
        const isLast = index === arr.length - 1;
        return (
          <Box key={place.id}>
            <ClassNames>{({ css }) => {
              const coloredUnderline = css({
                '&:hover': {
                  textDecorationColor: randomAccentColor(index),
                }
              });
              return (
                <Link
                  className={coloredUnderline}
                  style={fancyTextStyle}
                  to={`/miejscowosci/${place.id}`}
                >
                  {place.name}
                </Link>
              )
            }}</ClassNames>
            {!isLast && <span style={fancyTextStyle}>{','}&nbsp;</span>}
          </Box>
        )
      })}
    </Flex>
  )
}


const ACCENT_COLORS_ARRAY = Object.values(COLORS_ACCENT);
export const randomAccentColor = (n: number) => {
  return ACCENT_COLORS_ARRAY[n % ACCENT_COLORS_ARRAY.length]
}