import * as React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useForm, Icon, TextInput, IcomoonIcon, IconName, useDidUpdateEffect } from "@rocketmakers/armstrong";
import { OrbitButton } from "../components/orbitButton";
import { OrbitIcons } from "../utils/orbitIcons";
import { useQueryString } from "./useQueryStringHook";

interface IActionData<T extends {}, K extends keyof T> {
  rowId?: T[K];
  index: number;
}

type TableAction<T extends {}, K extends keyof T> = (data: IActionData<T, K>) => void;
type ColumnId<T> = Extract<keyof T, string>;

export interface IAsyncDataTableConfig<T extends {}, K extends keyof T, F extends {} = {}> {
  dataHeaders?: IAsyncDataTableDataHeader<T>[];
  customHeaders?: IAsyncDataTableCustomHeader<T>[];
  rowKey?: K;
  pageSize?: number;
  onRowClick?: TableAction<T, K>;
  filterDefaults?: Partial<F>;
}

interface IPagingDetails {
  current: string;
  previous?: string;
  next?: string;
}

interface IProps<T> {
  data?: T[];
  totalRows?: number;
  paging?: IPagingDetails;
  pending: boolean;
}

interface IHookProps<T> {
  currentPage: number;
  onPrevClick: () => void;
  onNextClick: () => void;
  onGoto: (page: number) => void;
  onSort: (columnId: ColumnId<T>, option?: SortOption) => void;
  currentSortData?: SortData<T>;
}

export interface IAsyncDataTableDataHeader<T> {
  columnId: ColumnId<T>;
  label: React.ReactText | JSX.Element;
  dataFormatter?: (data: T, clickProtector: ClickProtector<T>) => React.ReactText | JSX.Element;
  align?: "left" | "right" | "center";
  sortable?: boolean;
}

type ClickProtector<D> = (action?: (data: D) => any) => (e: React.MouseEvent<Element>) => boolean;
type SortOption = "ASC" | "DESC";
type SortData<T> = { columnId: ColumnId<T>; option: SortOption };

function clickProtectorFactory<D>(data: D): ClickProtector<D> {
  return action => e => {
    e.stopPropagation();
    action?.(data);
    return true;
  };
}

export interface IAsyncDataTableCustomHeader<T> {
  label?: React.ReactText | JSX.Element;
  contents?: (data: T, clickProtector: ClickProtector<T>) => React.ReactText | JSX.Element;
  align?: "left" | "right" | "center";
  position?: "pre-data" | "post-data";
}

export function useAsyncDataTable<T, K extends keyof T, F extends {} = {}>(config: IAsyncDataTableConfig<T, K, F>) {
  const { search, setQueryString } = useQueryString<{ pn?: string; flt?: string; srt?: string }>();

  const currentPage = React.useMemo(() => {
    const { pn } = search;
    return pn ? +pn : 1;
  }, [search]);

  const setCurrentPage = React.useCallback(
    (pageNumber: number) => {
      setQueryString({ pn: pageNumber.toString() });
    },
    [setQueryString, search]
  );

  const filterDataFromQueryString = React.useMemo<Partial<F>>(() => {
    if (search.flt) {
      try {
        const qsData: Partial<F> = JSON.parse(search.flt);
        return qsData;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Invalid filter data in query string");
      }
    }
    return {};
  }, [search]);

  const sortDataFromQueryString = React.useMemo<SortData<T> | undefined>(() => {
    const parts = (search.srt || "").split("::");
    if (parts.length === 2) {
      return { columnId: parts[0], option: parts[1] } as SortData<T>;
    }
    return undefined;
  }, [search]);

  const initialDataFromConfigAndQuery = React.useMemo(() => {
    let initialData: Partial<F> = {};
    if (config.filterDefaults) {
      initialData = {
        ...initialData,
        ...Object.keys(config.filterDefaults || {}).reduce<Partial<F>>(
          (reduction, key) => ({ ...reduction, [key]: config.filterDefaults[key] }),
          {}
        )
      };
    }
    if (filterDataFromQueryString) {
      initialData = { ...initialData, ...filterDataFromQueryString };
    }
    return initialData as F;
  }, [config.filterDefaults, filterDataFromQueryString]);

  const [initialData, setInitialData] = React.useState<F>(initialDataFromConfigAndQuery);

  const { bind, DataForm, dataBinder, notifyChange } = useForm(initialData);
  const binderData = dataBinder.toJson();
  const binderDataForHooks = JSON.stringify(binderData);

  const filterValues = React.useMemo(() => {
    const data = dataBinder.toJson();
    Object.keys(data || {}).forEach(k => {
      if (!data[k]) {
        delete data[k];
      }
    });
    return { ...data };
  }, [binderDataForHooks, dataBinder]);

  useDidUpdateEffect(() => {
    if (Object.keys(binderData).length) {
      setQueryString({ flt: JSON.stringify(binderData), pn: "1" });
    } else {
      setQueryString({ flt: "", pn: "1" });
    }
  }, [binderDataForHooks]);

  const onNextClick = React.useCallback(() => {
    setCurrentPage(currentPage + 1);
  }, [setCurrentPage, currentPage]);

  const onPrevClick = React.useCallback(() => {
    setCurrentPage(currentPage - 1);
  }, [setCurrentPage, currentPage]);

  const onFilterClear = React.useCallback<(...keys: (keyof F)[]) => void>(
    (...keys) => {
      const newInitialData = { ...(config.filterDefaults || {}) } as F;
      if (!keys?.length) {
        setInitialData(newInitialData);
        return;
      }
      keys.forEach(k => dataBinder.setValue(k as string, ""));
      notifyChange();
    },
    [config.filterDefaults, dataBinder, notifyChange]
  );

  const onSort = React.useCallback<(columnId: ColumnId<T>, option?: SortOption) => void>((columnId, option) => {
    if (!option) {
      setQueryString({ srt: "" });
      return;
    }
    setQueryString({ srt: `${columnId}::${option}` });
  }, []);

  const AsyncTable = React.useCallback<React.FC<IProps<T>>>(
    props => {
      return (
        <AsyncDataTable<T, K, F>
          {...props}
          {...config}
          currentPage={currentPage}
          onPrevClick={onPrevClick}
          onNextClick={onNextClick}
          onGoto={setCurrentPage}
          currentSortData={sortDataFromQueryString}
          onSort={onSort}
        />
      );
    },
    [config, currentPage, onPrevClick, onNextClick]
  );

  const FilterForm = React.useCallback<React.FC<{ children: (formBind: typeof bind) => JSX.Element }>>(
    ({ children }) => {
      return (
        <DataForm>
          <div className="filters">{children(bind)}</div>
        </DataForm>
      );
    },
    [DataForm, bind]
  );

  return {
    AsyncTable,
    page: currentPage.toString(),
    pageSize: config.pageSize,
    filterValues,
    filterBind: bind,
    FilterForm,
    clearFilters: onFilterClear,
    sortValue: sortDataFromQueryString
  };
}

function AsyncDataTable<T, K extends keyof T, F extends {} = {}>(
  props: React.PropsWithChildren<IAsyncDataTableConfig<T, K, F> & IProps<T> & IHookProps<T>>
) {
  const {
    data,
    dataHeaders,
    rowKey,
    pageSize: rowsPerPage,
    totalRows,
    onNextClick,
    onPrevClick,
    currentPage,
    onRowClick,
    customHeaders,
    paging,
    onGoto,
    children,
    currentSortData,
    onSort
  } = props;

  const [currentPageValue, setCurrentPageValue] = React.useState(currentPage.toString());

  React.useEffect(() => {
    setCurrentPageValue(currentPage.toString());
  }, [currentPage]);

  const totalPages = React.useMemo(() => {
    if (rowsPerPage && totalRows) {
      return Math.ceil(totalRows / rowsPerPage);
    }
    return undefined;
  }, [rowsPerPage, totalRows]);

  type Action = (e: React.MouseEvent<any>, index: number, action?: TableAction<T, K>) => void;

  const actionClick = React.useCallback<Action>(
    (e, index, action) => {
      e.stopPropagation();
      if (action) {
        action({ rowId: rowKey && data[index][rowKey], index });
      }
      return false;
    },
    [rowKey, data]
  );

  const customPreHeaders = React.useMemo(() => {
    return (customHeaders || []).filter(h => h.position === "pre-data");
  }, [customHeaders]);

  const customPostHeaders = React.useMemo(() => {
    return (customHeaders || []).filter(h => !h.position || h.position === "post-data");
  }, [customHeaders]);

  const onGotoChanged = React.useCallback<(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void>(
    e => {
      const { value } = e.currentTarget;
      if (!value) {
        setCurrentPageValue("");
      }
      const newPage = +e.currentTarget.value;
      if (!Number.isNaN(newPage) && newPage > 0 && newPage <= totalPages) {
        setCurrentPageValue(newPage.toString());
      }
    },
    [totalPages, onGoto]
  );

  const onGotoBlur = React.useCallback(() => {
    if (!currentPageValue) {
      setCurrentPageValue(currentPage.toString());
      return;
    }
    if (currentPageValue !== currentPage.toString()) {
      onGoto(+currentPageValue);
    }
  }, [currentPageValue, currentPage]);

  const getSortIcon = React.useCallback<(colId: ColumnId<T>) => IconName<"Icomoon">>(
    colId => {
      switch (true) {
        case currentSortData?.columnId === colId && currentSortData?.option === "ASC":
          return "arrowDown3";
        case currentSortData?.columnId === colId && currentSortData?.option === "DESC":
          return "arrowUp3";
        default:
          return "minus3";
      }
    },
    [currentSortData]
  );

  const onSortFactory = React.useCallback<(colId: ColumnId<T>) => (e: React.MouseEvent<HTMLAnchorElement>) => boolean>(
    colId => {
      return e => {
        e.preventDefault();
        switch (true) {
          case currentSortData?.columnId === colId && currentSortData?.option === "ASC":
            onSort(colId, "DESC");
            break;
          case currentSortData?.columnId === colId && currentSortData?.option === "DESC":
            onSort(colId);
            break;
          default:
            onSort(colId, "ASC");
        }
        return false;
      };
    },
    [currentSortData, onSort]
  );

  return (
    <div className="async-dt">
      {children}
      <table className="data-table">
        <>
          <thead>
            <tr>
              {customPreHeaders.map((h, i) => (
                <th key={`custom-pre-header-${i}`} className="custom-header pre" data-align={h.align || "left"}>
                  {h.label && <div className="table-cell-inner header">{h.label}</div>}
                </th>
              ))}
              {(dataHeaders || []).map(h => (
                <th key={h.columnId} data-align={h.align || "left"}>
                  {h.sortable ? (
                    <a className="table-cell-inner header" href="#" onClick={onSortFactory(h.columnId)}>
                      {h.label && <div>{h.label}</div>}
                      <IcomoonIcon iconName={getSortIcon(h.columnId)} />
                    </a>
                  ) : (
                    <>{h.label && <div className="table-cell-inner header">{h.label}</div>}</>
                  )}
                </th>
              ))}
              {customPostHeaders.map((h, i) => (
                <th key={`custom-post-header-${i}`} className="custom-header post" data-align={h.align || "left"}>
                  {h.label && <div className="table-cell-inner header">{h.label}</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data || []).map((r, i) => (
              <tr key={rowKey ? `${r[rowKey]}` : i} onClick={e => actionClick(e, i, onRowClick)} data-clickable={!!onRowClick}>
                {customPreHeaders.map((h, hi) => (
                  <td key={`custom-pre-data-${i}-${hi}`}>
                    <div className="table-cell-inner custom">{h.contents(r, clickProtectorFactory(r))}</div>
                  </td>
                ))}
                {dataHeaders.map(h => (
                  <td key={h.columnId}>
                    <div className="table-cell-inner">{h.dataFormatter ? h.dataFormatter(r, clickProtectorFactory(r)) : r[h.columnId]}</div>
                  </td>
                ))}
                {customPostHeaders.map((h, hi) => (
                  <td key={`custom-pre-data-${i}-${hi}`}>
                    <div className="table-cell-inner custom">{h.contents(r, clickProtectorFactory(r))}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </>
      </table>
      {!!paging && (
        <div className="table-pager">
          <div className="table-pager-inner">
            <OrbitButton className="double-arrow" disabled={!paging.previous} onClick={() => onGoto(1)}>
              <Icon icon={OrbitIcons.left} />
              <Icon icon={OrbitIcons.left} />
            </OrbitButton>
            <OrbitButton leftIcon={OrbitIcons.left} disabled={!paging.previous} onClick={onPrevClick} big={true} />
            <div className="page-indicator">
              <span>page</span>
              <TextInput
                onKeyUp={e => e.keyCode === 13 && e.currentTarget.blur()}
                disabled={totalPages === 1}
                value={currentPageValue}
                onChange={onGotoChanged}
                onBlur={onGotoBlur}
              />
              <span>of {totalPages}</span>
            </div>
            <OrbitButton leftIcon={OrbitIcons.right} disabled={!paging.next} onClick={onNextClick} big={true} />
            <OrbitButton className="double-arrow" disabled={!paging.next} onClick={() => onGoto(totalPages)}>
              <Icon icon={OrbitIcons.right} />
              <Icon icon={OrbitIcons.right} />
            </OrbitButton>
          </div>
        </div>
      )}
    </div>
  );
}
