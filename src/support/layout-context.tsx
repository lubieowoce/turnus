import { createContext, memo, MutableRefObject, PropsWithChildren, useContext, useMemo } from "react";
import { useBoundingclientrect as useBoundingClientRect } from 'rooks';


export const useLayoutCalculator = ({
  mainRef,
  headerRef,
}: {
  mainRef: MutableRefObject<HTMLElement | null>,
  headerRef: MutableRefObject<HTMLElement | null>,
}): Dimensions => {
  const mainRect = useBoundingClientRect(mainRef);
  const headerRect = useBoundingClientRect(headerRef);
  return useMemo(() => ({
    mainWidth: mainRect?.width ?? null,
    mainHeight: mainRect?.height ?? null,
    headerHeight: headerRect?.height ?? null,
  }), [mainRect?.width, mainRect?.height, headerRect?.height]);
}

type Dimensions = {
  mainWidth: number | null,
  mainHeight: number | null,
  headerHeight: number | null,
}

export const LayoutContext = createContext<Dimensions>({
  mainWidth: null,
  mainHeight: null,
  headerHeight: null,
});

export const LayoutContextProvider = memo(({ dimensions, children }: PropsWithChildren<{ dimensions: Dimensions }>) => {
  return <LayoutContext.Provider value={dimensions}>{children}</LayoutContext.Provider>
})

export const useDimensions = (): Dimensions => {
  return useContext(LayoutContext);
}
