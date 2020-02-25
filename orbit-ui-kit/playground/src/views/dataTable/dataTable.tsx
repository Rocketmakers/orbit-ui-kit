import * as React from "react";
import * as moment from "moment";
import * as _ from "underscore";
import { IAsyncDataTableConfig, useAsyncDataTable, OrbitView, OrbitButton, OrbitIcons } from "../../../../source";
import { IcomoonIcon, TextInput, Icons, SelectInput, ThrottledTextInput } from "@rocketmakers/armstrong";

const dummyData: DummyRow[] = require("./mock_data.json");

interface DummyRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  date_created: string;
}

interface IFilters {
  first_name: string;
  last_name: string;
  gender: string;
}

const fakeDelay = (): Promise<void> => new Promise(res => setTimeout(res, 700));

export const DataTableView: React.FC = () => {
  const [pending, setPending] = React.useState(false);

  const fakePending = React.useCallback<typeof fakeDelay>(async () => {
    setPending(true);
    await fakeDelay();
    setPending(false);
  }, [setPending]);

  const editClick = React.useCallback<(d: DummyRow) => void>(d => {
    alert(`edit click - ${d.id}`);
  }, []);

  const tableConfig = React.useMemo<IAsyncDataTableConfig<DummyRow, "id", IFilters>>(
    () => ({
      dataHeaders: [
        {
          columnId: "id",
          label: "Id"
        },
        {
          columnId: "first_name",
          label: "First name",
          sortable: true
        },
        {
          columnId: "last_name",
          label: "Last name",
          sortable: true
        },
        {
          columnId: "email",
          label: "Email",
          dataFormatter: (d, protect) => (
            <a href={`mailto:${d.email}`} onClick={protect()}>
              {d.email}
            </a>
          ),
          sortable: true
        },
        {
          columnId: "gender",
          label: "Gender",
          sortable: true
        },
        {
          columnId: "date_created",
          label: "Date created",
          dataFormatter: d => moment(d.date_created).format("DD/MM/YYYY"),
          sortable: true
        }
      ],
      customHeaders: [
        {
          contents: d => <IcomoonIcon iconName="user" title={`${d.first_name} ${d.last_name}`} />,
          position: "pre-data",
          width: "min"
        },
        {
          contents: (d, protect) => <OrbitButton leftIcon={OrbitIcons.edit} onClick={protect(editClick)} />,
          width: "min"
        }
      ],
      pageSize: 10,
      rowKey: "id",
      onRowClick: () => alert("row click"),
      settings: {
        autoSubmitFilters: false
      }
    }),
    []
  );

  const { AsyncTable, pageSize, page, sortValue, FilterForm, filterValues, submitFilters, clearFilters } = useAsyncDataTable(tableConfig);

  const formattedData = React.useMemo<DummyRow[]>(() => {
    let data = [...dummyData];
    const skip = pageSize * (+page - 1);
    const take = pageSize;

    if (sortValue) {
      data = _.sortBy(data, d => d[sortValue.columnId]);
      if (sortValue.option === "DESC") {
        data.reverse();
      }
    }

    if (filterValues) {
      if (filterValues.first_name) {
        data = data.filter(d => d.first_name.toLowerCase().indexOf(filterValues.first_name.toLowerCase()) > -1);
      }
      if (filterValues.last_name) {
        data = data.filter(d => d.last_name.toLowerCase().indexOf(filterValues.last_name.toLowerCase()) > -1);
      }
      if (filterValues.gender) {
        data = data.filter(d => d.gender.indexOf(filterValues.gender) > -1);
      }
    }

    return data.slice(skip, skip + take);
  }, [pageSize, page, sortValue, filterValues]);

  const [dataToShow, setDataToShow] = React.useState([]);

  React.useEffect(() => {
    fakePending().then(() => setDataToShow(formattedData));
  }, [formattedData]);

  const paging = React.useMemo(
    () => ({
      current: page,
      next: +page * pageSize < dummyData.length && (+page + 1).toString(),
      previous: page !== "1" && (+page - 1).toString()
    }),
    [page, pageSize]
  );

  return (
    <OrbitView mode="full-width">
      <h1 className="m-left-medium">Data Table</h1>
      <AsyncTable pending={pending} data={dataToShow} totalRows={dummyData.length} paging={paging}>
        <FilterForm>
          {bind => (
            <>
              <ThrottledTextInput {...bind.text("first_name")} placeholder="First name..." leftIcon={Icons.Icomoon.search} />
              <ThrottledTextInput {...bind.text("last_name")} placeholder="Last name..." leftIcon={Icons.Icomoon.search} />
              <SelectInput
                {...bind.select("gender")}
                options={[
                  { id: "Male", name: "Male" },
                  { id: "Female", name: "Female" }
                ]}
                optionLabel="All"
                enableOptionLabel={true}
              />
              <OrbitButton displayMode="negative" leftIcon={OrbitIcons.cross} onClick={() => clearFilters()}>
                Clear
              </OrbitButton>
              <OrbitButton displayMode="positive" leftIcon={Icons.Icomoon.search} onClick={submitFilters}>
                Search
              </OrbitButton>
            </>
          )}
        </FilterForm>
      </AsyncTable>
    </OrbitView>
  );
};
