import * as React from "react";
import { useLocation, useHistory } from "react-router-dom";

/**
 * A "React friendly" interface for the browser query string. Uses location + history hooks from React Router to get/set the data.
 * @template State - A type definition dor the expected key/value pairs stored in the query string as "x=y". The values should be strings as this is how they will be returned from the query string.
 */
export function useQueryString<State extends { [key: string]: string } = {}>() {
  /**
   * React Router hooks used to get/set data.
   */
  const { search, pathname, hash } = useLocation();
  const history = useHistory();

  /**
   * The current data in the query string. Decoded and parses into a key/value dictionary matching the State type definition
   * @template State - A type definition dor the expected key/value pairs stored in the query string as "x=y". The values should be strings as this is how they will be returned from the query string.
   */
  const searchParsed = React.useMemo<State>(() => {
    const replaced = (search || "").replace(/(?:^\?)(.*?)(?:$|#)/, "$1");
    if (replaced) {
      return replaced.split("&").reduce<State>((r, i) => {
        const split = i.split("=");
        if (split.length === 2) {
          return { ...r, [decodeURIComponent(split[0])]: decodeURIComponent(split[1]) };
        }
        return r;
      }, {} as State);
    }
    return {} as State;
  }, [search]);

  /**
   * Sets new values for x number of keys in the query string. To unset a value set it to a "falsy" value (ideally an empty string.)
   * @template State - A type definition dor the expected key/value pairs stored in the query string as "x=y". The values should be strings as this is how they will be returned from the query string.
   */
  const setQueryString = React.useCallback<(changes: Partial<State>) => void>(
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
