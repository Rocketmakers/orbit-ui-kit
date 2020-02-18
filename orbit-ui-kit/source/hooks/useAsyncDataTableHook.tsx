import * as React from "react";
import { useForm, Icon, TextInput, IcomoonIcon, IconName, useDidUpdateEffect, FormBinder } from "@rocketmakers/armstrong";
import { OrbitButton } from "../components/orbitButton";
import { OrbitIcons } from "../utils/orbitIcons";
import { useQueryString } from "./useQueryStringHook";
import { OrbitSpinner } from "../components/orbitSpinner";

/**
 * Interface returned to consumer when a table action is performed (only supports onRowClick right now.)
 * @template TDataRow - A key/value dictionary describing a single row of data.
 * @template TIdentifyingRowKey - The string key of TDataRow to use as the primary key / identifier for each row.
 */
interface IActionData<TDataRow extends {}, TIdentifyingRowKey extends keyof TDataRow> {
  /**
   * The value in the ID column of the row to which an action has been applied. The ID column key should be passed into the "rowKey" property of the main config.
   */
  rowId?: TDataRow[TIdentifyingRowKey];
  /**
   * The on-screen index of the row to which an action has been applied. This index does not respect paging.
   * @type number
   */
  index: number;
}

/**
 * Type describing a table action (only supports onRowClick right now.)
 * @template TDataRow - A key/value dictionary describing a single row of data.
 * @template TIdentifyingRowKey - The string key of TDataRow to use as the primary key / identifier for each row.
 */
type TableAction<TDataRow extends {}, TIdentifyingRowKey extends keyof TDataRow> = (
  data: IActionData<TDataRow, TIdentifyingRowKey>
) => void;

/**
 * Type describing any individual key of the passed in data row type (assuming all keys are strings.)
 * @template TDataRow - A key/value dictionary describing a single row of data.
 */
type ColumnId<TDataRow> = Extract<keyof TDataRow, string>;

/**
 * Type describing the optional customisation settings passed to the main config.
 */
export interface IAsyncDataTableSettings {
  /**
   * Optional override for the default JSX displayed when the data set is empty. Should be a function not a component.
   * @type function
   * @param {boolean} filtersAreSet - Will be true if the data set is empty because of filter configuration, and false if it's just empty in general.
   * @param {string} className - A CSS class which, if added to the element, will apply the default styling for the "no data" message. If you'd like to do bespoke styling, don't add this class.
   * @returns {string|JSX.Element} - A string or JSX element to display inside the table when no data is present.
   */
  noDataBlock: (filtersAreSet: boolean, className: string) => string | JSX.Element;
  /**
   * @type string
   * A prefix which will be added to all the routing params added to the URL query string by the data table automatically. Necessary if your route has more than one table, you should give each table a different prefix.
   */
  routingParamPrefix?: string;
  /**
   * Set to false if you don't want the data to re-fetch automatically when the dataBinder used for the filters detects a change. A false value is useful here if you want a "search" button to apply the filters.
   * A false value here should be used in conjunction with the "submitFilters" function, which is returned from the useAsyncDataTable hook.
   * @type boolean
   * @default true
   */
  autoSubmitFilters: boolean;
}

/**
 * Type describing the main config for the data table. Make sure this is memoized when it's passed into the hook.
 * @template TDataRow - A key/value dictionary describing a single row of data.
 * @template TIdentifyingRowKey - The string key of TDataRow to use as the primary key / identifier for each row.
 * @template TFilters - A key/value dictionary of filters applied to the data set. The key should be the key from TDataRow that the filter applies to, and the value should be the type returned from the filter (usually string.)
 */
export interface IAsyncDataTableConfig<TDataRow extends {}, TIdentifyingRowKey extends keyof TDataRow, TFilters extends {} = {}> {
  /**
   * The column config for columns that correspond to the keys of the data row.
   * @type {Array}
   */
  dataHeaders?: IAsyncDataTableDataHeader<TDataRow>[];
  /**
   * Any column config for columns that don't correspond to keys of the data row. This is useful for adding icons / buttons to each row.
   * @type {Array}
   */
  customHeaders?: IAsyncDataTableCustomHeader<TDataRow>[];
  /**
   * The string key of TDataRow to use as the primary key / identifier for each row as a string. This must exactly match the TIdentifyingRowKey generic.
   * @type {string}
   */
  rowKey?: TIdentifyingRowKey;
  /**
   * The number of results to display on each page of the table. Exclude this if no paging is required.
   * @type {number}
   * @
   */
  pageSize?: number;
  /**
   * A callback to use when a row is clicked. Exclude this if no row click action is required.
   * @type {function} - TableAction
   */
  onRowClick?: TableAction<TDataRow, TIdentifyingRowKey>;
  /**
   * A key/value dictionary of default values for the filters if any are required. This is usually not necessary, but can be useful (as an example) for date range filters on large data sets (default to today.)
   */
  filterDefaults?: Partial<TFilters>;
  /**
   * Optional customisation settings.
   */
  settings?: Partial<IAsyncDataTableSettings>;
}

/**
 * Type describing the paging data that should be passed directly to the table component. This info is usually returned from the API call alongside the data.
 */
export interface IAsyncDataTablePaging {
  /**
   * The current page number (as a string)
   * @type {string}
   */
  current: string;
  /**
   * The number of the page preceding the current page (as a string.) Should be left undefined if the current page is the first available page.
   * @type {string}
   */
  previous?: string;
  /**
   * The number of the page after the current page (as a string.) Should be left undefined if the current page is the last available page.
   * @type {string}
   */
  next?: string;
}

/**
 * Type description for the props passed directly to the <AsyncDataTable /> component. This component is returned from the useAsyncDataTable hook.
 * This data is passed as props because it's most often returned from the API call, and therefore isn't available when the config is passed to the hook.
 * @template TDataRow - A key/value dictionary describing a single row of data.
 */
interface IComponentProps<TDataRow> {
  /**
   * The array of data to display in the table
   */
  data?: TDataRow[];
  /**
   * The total number of rows in the data set, regardless of any paging settings. You can exclude this if no paging is required.
   * @type {number}
   */
  totalRows?: number;
  /**
   * The paging data relating to the current page being displayed. Please exclude this if no paging is required.
   * @type {number}
   */
  paging?: IAsyncDataTablePaging;
  /**
   * Whether the data is currently being requested (can be an initial request or an update for paging/filtering/sorting.)
   * @type {boolean}
   */
  pending?: boolean;
}

/**
 * Type description for the props passed internally from the useAsyncDataTable hook to the AsyncDataTable component.
 * THESE SHOULD NEVER BE PASSED DIRECTLY FROM THE CONSUMING COMPONENT.
 * @template TDataRow - A key/value dictionary describing a single row of data.
 */
interface IHookProps<TDataRow> {
  /**
   * The current page number
   * @type {number}
   */
  currentPage: number;
  /**
   * The function called when the "Previous page" button is clicked.
   * @type {function}
   * @returns {void}
   */
  onPrevClick: () => void;
  /**
   * The function called when the "Next page" button is clicked.
   * @type {function}
   * @returns {void}
   */
  onNextClick: () => void;
  /**
   * The function called to go directly to another page. Used by the first/last buttons, and the goto input.
   * @type {function}
   * @param {number} page - The number of the page to go to.
   * @returns {void}
   */
  onGoto: (page: number) => void;
  /**
   * The function called when a column has been clicked on for sorting.
   * @type {function}
   * @param {string} columnId - The key of the data row type that has been selected for sorting.
   * @param {string?} option - The direction that has been selected for sorting (ASC/DESC). Will be undefined if this action is to turn sorting off for this column.
   * @returns {void}
   */
  onSort: (columnId: ColumnId<TDataRow>, option?: SortOption) => void;
  /**
   * The current sorting data from the query string.
   * @type {Object}
   */
  currentSortData?: SortData<TDataRow>;
  /**
   * The current settings being applied to the data table, this is a combination of the default settings and any customisations passed to the "settings" key of the main config.
   * @type {Object}
   */
  appliedSettings: IAsyncDataTableSettings;
  /**
   * Whether there are any filters currently set in the query string.
   * @type {boolean}
   */
  filtersAreSet: boolean;
}

/**
 * Type definition for the config relating to columns that correspond to the keys of the data row.
 * @template TDataRow - A key/value dictionary describing a single row of data.
 */
export interface IAsyncDataTableDataHeader<TDataRow> {
  /**
   * The key of the data row linking this column to it's data.
   * @type {string}
   */
  columnId: ColumnId<TDataRow>;
  /**
   * A label for the column, will be displayed in the table header.
   * @type {string|number|JSX.Element}
   */
  label: React.ReactText | JSX.Element;
  /**
   * An optional formatter, used for displaying anything in the column other than the raw data.
   * @param {Object} data - The total data set for the row being displayed, not just this column.
   * @param {function} clickProtector - A "factory" function that can be executed inside an onClick handler. It takes another function as it's single argument and passes that function the row data, it then prevents event bubbling. This is useful if you have a button being displayed in the table but you also have a row click action.
   * @returns {string|number|JSX.Element} - What to display in the column, instead of the raw data.
   */
  dataFormatter?: (data: TDataRow, clickProtector: ClickProtector<TDataRow>) => React.ReactText | JSX.Element;
  /**
   * An optional horizontal align setting for the contents of this column.
   * @type {string}
   * @default left
   */
  align?: "left" | "right" | "center";
  /**
   * Allow user sorting for this column.
   * @type {boolean?}
   * @default false
   */
  sortable?: boolean;
}

/**
 * Type description for a "factory" function that can be executed inside an onClick handler. It takes another function as it's single argument and passes that function the row data, it then prevents event bubbling. This is useful if you have a button being displayed in the table but you also have a row click action.
 * @template TDataRow - A key/value dictionary describing a single row of data.
 */
type ClickProtector<TDataRow> = (action?: (data: TDataRow) => any) => (e: React.MouseEvent<Element>) => boolean;

/**
 * Type description for the available options for sorting on columns.
 */
type SortOption = "ASC" | "DESC";

/**
 * Type description for the current sorting settings, read from the query string and converted to this format to be passed to the API call by the consuming component.
 * @template TDataRow - A key/value dictionary describing a single row of data.
 * @property {string} columnId - The key of the data row describing the column that is currently selected for sorting.
 * @property {string} option - The sorting direction currently selected (ASC/DESC)
 */
type SortData<TDataRow> = { columnId: ColumnId<TDataRow>; option: SortOption };

/**
 * Type definition for the config relating to columns that DO NOT correspond to any keys of the data row.
 * @template TDataRow - A key/value dictionary describing a single row of data.
 */
export interface IAsyncDataTableCustomHeader<TDataRow> {
  /**
   * A label for the column, will be displayed in the table header.
   * @type {string|number|JSX.Element}
   */
  label?: React.ReactText | JSX.Element;
  /**
   * The content to display in this column for each row.
   * @param {Object} data - The total data set for the row being displayed, not just this column.
   * @param {function} clickProtector - A "factory" function that can be executed inside an onClick handler. It takes another function as it's single argument and passes that function the row data, it then prevents event bubbling. This is useful if you have a button being displayed in the table but you also have a row click action.
   * @returns {string|number|JSX.Element} - What to display in the column, instead of the raw data.
   */
  contents?: (data: TDataRow, clickProtector: ClickProtector<TDataRow>) => React.ReactText | JSX.Element;
  /**
   * An optional horizontal align setting for the contents of this column.
   * @type {string}
   * @default left
   */
  align?: "left" | "right" | "center";
  /**
   * Pass "pre-data" to this position attribute to display this custom column BEFORE the data rows. By default, custom columns are displayed AFTER the data rows ("post-data")
   * @type {string}
   * @default post-data
   */
  position?: "pre-data" | "post-data";
}

/**
 * Object returned from the useAsyncDataTable hook.
 * @template TDataRow - A key/value dictionary describing a single row of data.
 * @template TFilters - A key/value dictionary of filters applied to the data set. The key should be the key from TDataRow that the filter applies to, and the value should be the type returned from the filter (usually string.)
 */
export interface IAsyncDataTableHookResponse<TDataRow extends {}, TFilters extends {} = {}> {
  /**
   * The data table component. Should be rendered as JSX in the appropriate place by the consuming component. Props from the API response should be passed onto it.
   * Any children passed to this component will be assumed to be filter inputs with no containing element, and will be displayed as such.
   * @template TDataRow - A key/value dictionary describing a single row of data.
   * @example <AsyncTable data={data.rows} totalRows={data.count} paging={data.paging} />
   */
  AsyncTable: React.FC<IComponentProps<TDataRow>>;
  /**
   * The current page number (as a string). This should be passed into the API request if paging is required.
   * @type {string}
   */
  page: string;
  /**
   * The page size from the hook config. This should be passed into the API request if paging is required.
   * @type {number}
   */
  pageSize: number;
  /**
   * A key / value dictionary of current filter values. The key should will likely be the key from TDataRow that the filter applies to, and the value should be the type returned from the filter (usually string.)
   * This should be formatted correctly and passed into the API request.
   * @template TFilters - A key/value dictionary of filters applied to the data set. The key should be the key from TDataRow that the filter applies to, and the value should be the type returned from the filter (usually string.)
   * @type {Object}
   */
  filterValues: Partial<TFilters>;
  /**
   * The filter form component. This MUST be rendered as a parent to any filter inputs, regardless of where the inputs are rendered. A binder will be passed in as a render prop, this should be used to bind the inputs.
   * @template TFilters - A key/value dictionary of filters applied to the data set. The key should be the key from TDataRow that the filter applies to, and the value should be the type returned from the filter (usually string.)
   * @type {React.FC}
   * @example <FilterForm>{bind => <TextInput {...bind.text('email')} placeholder='Search by Email' />}</FilterForm>
   */
  FilterForm: React.FC<{ children: (formBind: FormBinder<TFilters>) => JSX.Element }>;
  /**
   * A function to call in order to clear filters. If no args are passed, ALL filters will be cleared.
   * @template TFilters - A key/value dictionary of filters applied to the data set. The key should be the key from TDataRow that the filter applies to, and the value should be the type returned from the filter (usually string.)
   * @param keys - Pass specific keys from your filters type to only clear specific filters.
   * @type {function}
   */
  clearFilters: (...keys: (keyof TFilters)[]) => void;
  /**
   * A function to submit any filters that have not automatically been submitted.
   * **NOTE** - This should ONLY be used in conjunction with "autoSubmitFilters: false" in the "settings" area of the main hook config. This setting is not the default, by default filters should be submitted when the binder changes and text inputs will need to be throttled.
   * @type {function}
   */
  submitFilters: () => void;
  /**
   * The current sorting setup chosen by the users, will be undefined if no sorting has been selected. This should be passed into the API request if sorting is required.
   * @template TDataRow - A key/value dictionary describing a single row of data.
   * @type {Object}
   * @property {string} columnId - The key of the data row describing the column that is currently selected for sorting.
   * @property {string} option - The sorting direction currently selected (ASC/DESC)
   */
  sortValue: SortData<TDataRow>;
}

/**
 * The defaults for the optional settings that can be passed to the main config.
 */
const defaultSettings: IAsyncDataTableSettings = {
  noDataBlock: (filtersAreSet, className) => (
    <div className={className}>
      <IcomoonIcon iconName={filtersAreSet ? "search" : "warning"} />
      <div>
        <h3>no data found</h3>
        {filtersAreSet && <span>adjust the filters and try again</span>}
      </div>
    </div>
  ),
  autoSubmitFilters: true
};

/**
 * A "factory" function that can be executed inside an onClick handler. It takes another function as it's single argument and passes that function the row data, it then prevents event bubbling. This is useful if you have a button being displayed in the table but you also have a row click action.
 * @example <Button onClick={clickProtectorFactory(d => alert(d.id))} />
 * @param data - The data for the row containing the element being clicked.
 */
function clickProtectorFactory<IDataRow>(data: IDataRow): ClickProtector<IDataRow> {
  return action => e => {
    e.stopPropagation();
    action?.(data);
    return true;
  };
}

/**
 * The hook for using the async data table. Should be used BEFORE the API call that retrieves the data.
 * @param config - The config for the table.
 * @template TDataRow - A key/value dictionary describing a single row of data.
 * @template TIdentifyingRowKey - The string key of TDataRow to use as the primary key / identifier for each row.
 * @template TFilters - A key/value dictionary of filters applied to the data set. The key should be the key from TDataRow that the filter applies to, and the value should be the type returned from the filter (usually string.)
 */
export function useAsyncDataTable<TDataRow, TIdentifyingRowKey extends keyof TDataRow, TFilters extends {} = {}>(
  config: IAsyncDataTableConfig<TDataRow, TIdentifyingRowKey, TFilters>
): IAsyncDataTableHookResponse<TDataRow, TFilters> {
  /**
   * The combined "settings" to apply, loads user config on top of defaults.
   */
  const settings = React.useMemo<IAsyncDataTableSettings>(
    () => ({
      ...defaultSettings,
      ...(config.settings || {})
    }),
    [config.settings]
  );

  /**
   * The table uses the query string to store paging, sorting and filtering settings, allowing specific configurations to form part of the browser history.
   * This hook creates a "react friendly" interface with the query string. - it parses the query string contents into a dictionary, and triggers a re-render when the query string is set.
   */
  const { search, setQueryString } = useQueryString();

  /**
   * This memo defines the names of the parameters used in the query string to store paging, sorting and filtering settings.
   * By default these are "pn", "srt" and "flt" respectively, but this memo will apply any "routingParamPrefix" set in the "settings" area of the hook config.
   */
  const qsParams = React.useMemo<{ paging: string; filter: string; sorting: string }>(() => {
    const prefix = config.settings?.routingParamPrefix ?? "";
    return {
      paging: `${prefix}pn`,
      filter: `${prefix}flt`,
      sorting: `${prefix}srt`
    };
  }, [config.settings?.routingParamPrefix]);

  /**
   * The current page from the query string.
   */
  const currentPage = React.useMemo(() => {
    const pn = search[qsParams.paging];
    return pn ? +pn : 1;
  }, [search, qsParams]);

  /**
   * Sets a new page in the query string.
   */
  const setCurrentPage = React.useCallback(
    (pageNumber: number) => {
      setQueryString({ [qsParams.paging]: pageNumber.toString() });
    },
    [setQueryString, search, qsParams]
  );

  /**
   * Retrieves any filter data stored in the query string as JSON, and parses it into the correct TFilters type.
   */
  const filterDataFromQueryString = React.useMemo<Partial<TFilters>>(() => {
    const flt = search[qsParams.filter];
    if (flt) {
      try {
        const qsData: Partial<TFilters> = JSON.parse(flt);
        return qsData;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Invalid filter data in query string");
      }
    }
    return {};
  }, [search, qsParams]);

  /**
   * Retrieves any sorting data stored in the query string, and parses it into the correct SortData type.
   * Sorting data is stored in the query string as "{columnId}::{option}", e.g. "username::ASC"
   */
  const sortDataFromQueryString = React.useMemo<SortData<TDataRow> | undefined>(() => {
    const srt = search[qsParams.sorting];
    const parts = (srt || "").split("::");
    if (parts.length === 2) {
      return { columnId: parts[0], option: parts[1] } as SortData<TDataRow>;
    }
    return undefined;
  }, [search, qsParams]);

  /**
   * The initial filtering settings to pass to the form binder.
   * This takes into account any 'filterDefaults' passed to the config, as well as any filtering settings in the query string when the page loads.
   */
  const initialDataFromConfigAndQuery = React.useMemo(() => {
    let initialData: Partial<TFilters> = {};
    if (config.filterDefaults) {
      initialData = {
        ...initialData,
        ...Object.keys(config.filterDefaults || {}).reduce<Partial<TFilters>>(
          (reduction, key) => ({ ...reduction, [key]: config.filterDefaults[key] }),
          {}
        )
      };
    }
    if (filterDataFromQueryString) {
      initialData = { ...initialData, ...filterDataFromQueryString };
    }
    return initialData as TFilters;
  }, [config.filterDefaults, filterDataFromQueryString]);

  /**
   * The initial data is stored in state so that the binder can be recreated in the event that all filters are cleared by the "clearFilters" function.
   */
  const [initialData, setInitialData] = React.useState<TFilters>(initialDataFromConfigAndQuery);

  /**
   * The form binder for the filters.
   */
  const { bind, DataForm, dataBinder, notifyChange } = useForm(initialData);

  /**
   * The binder data is stored each render as JS and stringified.
   * This is necessary to keep things dry and allow effects to run when the binder data changes.
   */
  const binderData = dataBinder.toJson();
  const binderDataForHooks = JSON.stringify(binderData);

  /**
   * Sets the filter data in the query string.
   * This function makes sure it only stores "truey" filter data, and also removes any filter data that has been unset or become "falsy".
   * NOTE: This function also sets the page number to "1" when filtering occurs.
   */
  const setFilterData = React.useCallback(
    (data: TFilters) => {
      const validBinderData = Object.keys(data).reduce<TFilters>(
        (r, i) => ({ ...r, ...(data[i] ? { [i]: data[i] } : {}) }),
        {} as TFilters
      );
      if (Object.keys(validBinderData).length) {
        setQueryString({ [qsParams.filter]: JSON.stringify(validBinderData), pn: "1" });
      } else {
        setQueryString({ [qsParams.filter]: "", [qsParams.paging]: "1" });
      }
    },
    [qsParams, setQueryString]
  );

  /**
   * The effect that sets the filter data in the query string whenever the binder changes.
   * This effect respects the "autoSubmitFilters" flag in the "settings" area of the hook config.
   */
  useDidUpdateEffect(() => {
    if (config.settings?.autoSubmitFilters) {
      setFilterData(binderData);
    }
  }, [binderDataForHooks]);

  /**
   * Called when the paging "next" button is clicked - sets the new page in the query string
   */
  const onNextClick = React.useCallback(() => {
    setCurrentPage(currentPage + 1);
  }, [setCurrentPage, currentPage]);

  /**
   * Called when the paging "previous" button is clicked - sets the new page in the query string
   */
  const onPrevClick = React.useCallback(() => {
    setCurrentPage(currentPage - 1);
  }, [setCurrentPage, currentPage]);

  /**
   * Clears the filters, either based on an array of filter keys passed in as args, or just clears all filters if nothing passed.
   * Clears the appropriate data from the form binder AND the query string.
   */
  const onFilterClear = React.useCallback<(...keys: (keyof TFilters)[]) => void>(
    (...keys) => {
      const newInitialData = { ...(config.filterDefaults || {}) } as TFilters;
      if (!keys?.length) {
        setInitialData(newInitialData);
        if (!config.settings?.autoSubmitFilters) {
          setFilterData(newInitialData);
        }
        return;
      }
      keys.forEach(k => dataBinder.setValue(k as string, ""));
      notifyChange();
      if (!config.settings?.autoSubmitFilters) {
        setQueryString(dataBinder.toJson());
      }
    },
    [config.filterDefaults, config.settings?.autoSubmitFilters, dataBinder, notifyChange, qsParams, setQueryString]
  );

  /**
   * Called when sorting actions occur. Sets/unsets the "columnId::option" sorting data in the query string.
   * NOTE: This function also resets the page number to "1" when sorting occurs.
   */
  const onSort = React.useCallback<(columnId: ColumnId<TDataRow>, option?: SortOption) => void>(
    (columnId, option) => {
      if (!option) {
        setQueryString({ [qsParams.sorting]: "" });
        return;
      }
      setQueryString({ [qsParams.sorting]: `${columnId}::${option}`, [qsParams.paging]: "1" });
    },
    [setQueryString, qsParams]
  );

  /**
   * The actual table component to be rendered by the consuming component. It receives props from 3 different places:
   * 1. {...props} are the props added by the consuming component, i.e. the data and current paging settings, usually from the API response.
   * 2. {...config} is the config object passed into the hook. All of this is passed onto the table as props.
   * 3. A set of individual, "internal" props. This is how the hook passes it's own data to the component and triggers re-renders where necessary.
   */
  const AsyncTable = React.useCallback<React.FC<IComponentProps<TDataRow>>>(
    props => {
      return (
        <AsyncDataTable<TDataRow, TIdentifyingRowKey, TFilters>
          {...props}
          {...config}
          currentPage={currentPage}
          onPrevClick={onPrevClick}
          onNextClick={onNextClick}
          onGoto={setCurrentPage}
          currentSortData={sortDataFromQueryString}
          onSort={onSort}
          appliedSettings={settings}
          filtersAreSet={!!Object.keys(filterDataFromQueryString).filter(f => !!f).length}
        />
      );
    },
    [config, currentPage, onPrevClick, onNextClick]
  );

  /**
   * The Form component to be used by the consuming component to wrap any filter inputs.
   * This component passes the filter binder as a render prop.
   * @example <FilterForm>{bind => <TextInput {...bind.text('email')} placeholder='Search by Email' />}</FilterForm>
   */
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

  /**
   * Values returned from the hook.
   * See the IAsyncDataTableHookResponse interface for details.
   */
  return {
    AsyncTable,
    page: currentPage.toString(),
    pageSize: config.pageSize,
    filterValues: filterDataFromQueryString,
    FilterForm,
    clearFilters: onFilterClear,
    submitFilters: () => setFilterData(binderData),
    sortValue: sortDataFromQueryString
  };
}

/**
 * The component returned by the hook and rendered by the consuming component. It receives props from 3 different places:
 * 1. The props added by the consuming component, i.e. the data and current paging settings, usually from the API response.
 * 2. The config object passed into the hook. All of this is passed onto the table as props.
 * 3. A set of individual, "internal" props. This is how the hook passes it's own data to the component and triggers re-renders where necessary.
 * @template TDataRow - A key/value dictionary describing a single row of data.
 * @template TIdentifyingRowKey - The string key of TDataRow to use as the primary key / identifier for each row.
 * @template TFilters - A key/value dictionary of filters applied to the data set. The key should be the key from TDataRow that the filter applies to, and the value should be the type returned from the filter (usually string.)
 */
function AsyncDataTable<TDataRow, TIdentifyingRowKey extends keyof TDataRow, TFilters extends {} = {}>(
  props: React.PropsWithChildren<
    IAsyncDataTableConfig<TDataRow, TIdentifyingRowKey, TFilters> & IComponentProps<TDataRow> & IHookProps<TDataRow>
  >
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
    onSort,
    appliedSettings,
    filtersAreSet,
    pending
  } = props;

  /**
   * The current page is stored in state, giving the "page goto" input at the bottom something to bind to.
   */
  const [currentPageValue, setCurrentPageValue] = React.useState(currentPage.toString());

  /**
   * The effect that sets the internal page number from the value passed down from the hook.
   * This will ensure that the value in the "page goto" input at the bottom is accurate.
   */
  React.useEffect(() => {
    setCurrentPageValue(currentPage.toString());
  }, [currentPage]);

  /**
   * Calculates the total number of pages based available on the page size and the total number of records.
   * The total number of records is passed in as a prop by the consuming component.
   */
  const totalPages = React.useMemo(() => {
    if (rowsPerPage && totalRows) {
      return Math.ceil(totalRows / rowsPerPage);
    }
    return undefined;
  }, [rowsPerPage, totalRows]);

  /**
   * Type definition for a click action performed in the table. Currently only "onRowClick" is supported.
   */
  type Action = (e: React.MouseEvent<any>, index: number, action?: TableAction<TDataRow, TIdentifyingRowKey>) => void;

  /**
   * Function called for a click action performed in the table. Currently only "onRowClick" is supported.
   */
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

  /**
   * Takes the "customHeaders" from the hook config and returns only those to be displayed BEFORE the data columns
   */
  const customPreHeaders = React.useMemo(() => {
    return (customHeaders || []).filter(h => h.position === "pre-data");
  }, [customHeaders]);

  /**
   * Takes the "customHeaders" from the hook config and returns only those to be displayed AFTER the data columns
   * This is the default position for custom headers.
   */
  const customPostHeaders = React.useMemo(() => {
    return (customHeaders || []).filter(h => !h.position || h.position === "post-data");
  }, [customHeaders]);

  /**
   * Function called when the "page goto" input at the bottom is edited.
   * Makes sure the value is permissable (a valid page number) and if so, sets the value in internal state, only updating the controlled input for now.
   */
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

  /**
   * Called on blur of the "page goto" input at the bottom.
   * Informs the hook of a new page value, if the user has changed the value of the input to an acceptable value.
   */
  const onGotoBlur = React.useCallback(() => {
    if (!currentPageValue) {
      setCurrentPageValue(currentPage.toString());
      return;
    }
    if (currentPageValue !== currentPage.toString()) {
      onGoto(+currentPageValue);
    }
  }, [currentPageValue, currentPage]);

  /**
   * Returns the sorting icon to display next to the passed in data column ID.
   * Respects the sorting config passed down from the hook (if any.)
   */
  const getSortIcon = React.useCallback<(colId: ColumnId<TDataRow>) => IconName<"Icomoon">>(
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

  /**
   * A factory method used by the sorting buttons in the headers of the data columns.
   * Takes the ID of the column and returns a function to be called when the user click to sort.
   * The function returned informs the hook of the new sorting settings.
   */
  const onSortFactory = React.useCallback<(colId: ColumnId<TDataRow>) => (e: React.MouseEvent<HTMLAnchorElement>) => boolean>(
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

  /**
   * Render the table...
   */
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
            {!(data || []).length && (
              <tr className="no-data">
                <td colSpan={customPreHeaders.length + customPostHeaders.length + (dataHeaders?.length || 0)}>
                  {!pending && appliedSettings.noDataBlock(filtersAreSet, "no-data-block")}
                </td>
              </tr>
            )}
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
            <div className="cover-spinner" data-visible={pending}>
              <OrbitSpinner display="simple" fill={true} />
            </div>
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
