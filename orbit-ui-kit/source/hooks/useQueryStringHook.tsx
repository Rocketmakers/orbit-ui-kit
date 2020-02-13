import * as React from "react";
import { useLocation, useHistory } from "react-router-dom";

export function useQueryString<S extends { [key: string]: string } = {}>() {
  const { search, pathname, hash } = useLocation();
  const history = useHistory();

  const searchParsed = React.useMemo<S>(() => {
    const replaced = (search || "").replace(/(?:^\?)(.*?)(?:$|#)/, "$1");
    if (replaced) {
      return replaced.split("&").reduce<S>((r, i) => {
        const split = i.split("=");
        if (split.length === 2) {
          return { ...r, [decodeURIComponent(split[0])]: decodeURIComponent(split[1]) };
        }
        return r;
      }, {} as S);
    }
    return {} as S;
  }, [search]);

  const setQueryString = React.useCallback<(changes: Partial<S>) => void>(
    changes => {
      const newQueryString = `?${Object.entries({ ...searchParsed, ...changes })
        .filter(([, v]) => !!v)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&")}`;
      history.push(`${pathname}${newQueryString}${hash || ""}`);
    },
    [searchParsed, pathname, hash, history]
  );

  return { search: searchParsed, setQueryString };
}
