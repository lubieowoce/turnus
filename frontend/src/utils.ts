import { useCallback } from "react";
import { useLocation } from '@tanstack/react-location';

export const useGoBack = () => {
  const { history } = useLocation();
  return useCallback(() => history.back(), [history]);
}