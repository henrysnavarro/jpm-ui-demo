// Objective: Create a dynamic dashboard using React
// that displays a list of items (e.g., products, users, or tasks)
// with the ability to filter, sort, and paginate the data.
// The dashboard should be responsive and visually appealing.

// Requirements:
// 1. Data Display:
//     * Fetch data from https://jsonplaceholder.typicode.com/users
//     * Display the data in a “contact card” layout. With name, email,
//       and phone number. The card component is already provided
//.    * Add the user initials to the Avatar in the card.
// 2. Searching:
//     * Implement a search filter feature that allows users to search
//       through a specific name. Search field styles already provided.
// 3. Sorting:
//     * Allow users to sort the data by different columns (name, email,
//.      but not phone number) in both ascending and descending order.
// 4. Pagination:
//     * Implement pagination to handle large datasets, allowing users
//.      to navigate through pages of data.
// 5. Responsive Design:
//     * Ensure the dashboard is responsive and works well on different
//.      screen sizes, including mobile devices.

import "./styles.css";
import { useState, useEffect, useCallback } from "react";
import { Card, CardProps } from "./components/Card";
import DATA_SOURCES from "./datasources";

export default function App() {
  const DEFAULT_PAGE_SIZE = 5;
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [filteredSortedUsers, setFilteredSortedUsers] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [error, setError] = useState("");
  const [dataSource, setDataSource] = useState(null);
  const [sortOptions, setSortOptions] = useState([]);

  // Effect for loading data upon datasource selection
  useEffect(() => {
    if (dataSource === null) {
      return;
    }
    setSortOptions(
      dataSource.attributes
        .filter((attribute) => attribute.sortable)
        .map((sortAttribute) => {
          return {
            value: sortAttribute.path,
            label: sortAttribute.path,
          };
        })
    );
    fetch(dataSource.url)
      .then((response) => response.json())
      .then((json) => {
        let userResults = dataSource.collectionNode
          ? json[dataSource.collectionNode]
          : json;
        console.log(userResults);
        setUsers(userResults);
        setFilteredSortedUsers(userResults);
        setDisplayUsers(
          getPaginatedUsers({
            filteredSortedUsers: userResults,
            pageNumber: 0,
            pageSize: DEFAULT_PAGE_SIZE,
          })
        );
        setPageNumber(0);
        setPageSize(DEFAULT_PAGE_SIZE);
        setNumPages(Math.ceil(userResults.length / DEFAULT_PAGE_SIZE));
      })
      .catch((errorReason) => {
        setError(errorReason);
      });
  }, [dataSource]);

  // Pure function to get the list of users that meet any filtering
  // and in the manner specified by the sorting column and order
  const getFilteredSortedUsers = ({
    searchText,
    sortColumn,
    sortOrder,
    users,
  }) => {
    let filteredSortedUsers = [...users];

    if (searchText !== "") {
      filteredSortedUsers = users.filter(
        (user) => user.name.toLowerCase().indexOf(searchText) > -1
      );
    }

    if (sortColumn !== "" && sortOrder !== "") {
      let sortFactor = sortOrder == "asc" ? 1 : -1;
      filteredSortedUsers.sort((userA, userB) => {
        return (userA[sortColumn] <= userB[sortColumn] ? -1 : 1) * sortFactor;
      });
    }
    return filteredSortedUsers;
  };

  const handleSearchText = (event) => {
    // prevent browser behavior for this controlled component
    event.preventDefault();
    const searchText = event.target.value;
    setSearchText(searchText);
    // Changes in search text can lead to empty results
    // and as consequence, invalidate sorting and pagination
    // Hence, reset those when search text is changed
    setSortColumn("");
    setSortOrder("");
    setPageSize(DEFAULT_PAGE_SIZE);
    setPageNumber(0);
    let filteredSortedUsers = getFilteredSortedUsers({
      searchText, // local variable
      sortColumn: "",
      sortOrder: "",
      users, // state variable
    });
    setNumPages(Math.ceil(filteredSortedUsers.length / DEFAULT_PAGE_SIZE));
    let paginatedUsers = getPaginatedUsers({
      filteredSortedUsers,
      pageNumber,
      pageSize,
    });
    setDisplayUsers(paginatedUsers);
    setPageSize(DEFAULT_PAGE_SIZE);
  };

  const handleSortColumnChange = (event) => {
    // prevent browser behavior for this controlled component
    event.preventDefault();
    let sortColumn = event.target.value;
    updateSorting({ changeType: "column", newValue: sortColumn });
  };

  const handleSortOrderChange = (event) => {
    // prevent browser behavior for this controlled component
    event.preventDefault();
    let sortOrder = event.target.value;
    updateSorting({ changeType: "order", newValue: sortOrder });
  };

  const updateSorting = ({ changeType, newValue }) => {
    let newSortColumn = sortColumn;
    let newSortOrder = sortOrder;
    if (changeType === "column") {
      newSortColumn = newValue;
      setSortColumn(newSortColumn);
    } else {
      newSortOrder = newValue;
      setSortOrder(newSortOrder);
    }
    let filteredSortedUsers = getFilteredSortedUsers({
      searchText,
      sortColumn: newSortColumn,
      sortOrder: newSortOrder,
      users,
    });
    setFilteredSortedUsers(filteredSortedUsers);
    setDisplayUsers(
      getPaginatedUsers({
        filteredSortedUsers,
        pageSize,
        pageNumber,
      })
    );
  };

  const handlePageSizeChange = (event) => {
    event.preventDefault();
    const newPageSize = parseInt(event.target.value);
    const newPageNumber = 0;
    setDisplayUsers(
      getPaginatedUsers({
        filteredSortedUsers,
        pageSize: newPageSize,
        pageNumber: newPageNumber,
      })
    );
    setPageSize(newPageSize);
    setNumPages(Math.ceil(filteredSortedUsers.length / newPageSize));
    setPageNumber(0);
  };

  const getArraySlice = ({ userArray, newPageNumber, pageSize }) => {
    const startIndex = newPageNumber * parseInt(pageSize);
    const endIndex = startIndex + parseInt(pageSize);
    return userArray.slice(startIndex, endIndex);
  };

  const getPaginatedUsers = ({
    // Returns the filtered, sorted and paginated list of
    // users to display.  Callued upon each pagination change
    filteredSortedUsers,
    pageSize,
    pageNumber,
  }) => {
    let userResults;

    let startIndex = pageNumber * pageSize;
    let endIndex = startIndex + pageSize;
    userResults = filteredSortedUsers.slice(startIndex, endIndex);
    return userResults;
  };

  const handlePageNav = (navType) => {
    const pageNavigate = navType;
    let newPageNumber;
    switch (pageNavigate) {
      case "first":
        newPageNumber = 0;
        break;
      case "last":
        newPageNumber = numPages - 1;
        break;
      case "prev":
        if (pageNumber > 0) {
          newPageNumber = pageNumber - 1;
        } else {
          newPageNumber = 0;
        }
        break;
      case "next":
        if (pageNumber < numPages - 1) {
          newPageNumber = pageNumber + 1;
        } else {
          newPageNumber = pageNumber;
        }
        break;
      default:
        break;
    }
    setPageNumber(newPageNumber);
    let displayUsers = getPaginatedUsers({
      filteredSortedUsers,
      pageSize,
      pageNumber: newPageNumber,
    });

    setDisplayUsers(displayUsers);
  };

  const handleDataSourceChange = (event) => {
    event.preventDefault();
    setDataSource(
      DATA_SOURCES.find((datasource) => datasource.id == event.target.value)
    );
  };

  return (
    <div className="App">
      <h2>UI Demo</h2>
      <div className="input-wrapper">
        <div className="datasource-wrapper">
          <select
            id="dataSource"
            value={dataSource?.name}
            onChange={handleDataSourceChange}
          >
            <option value="">Select Data Source</option>
            {DATA_SOURCES.map((dataSource) => {
              return <option value={dataSource.id}>{dataSource.name}</option>;
            })}
          </select>
        </div>
        <div className="search-sort-wrapper">
          <div className="search-wrapper">
            <input
              disabled={displayUsers.length === 0}
              placeholder="Search"
              type="search"
              onChange={handleSearchText}
            />
          </div>
          <div className="sorting-paging-wrapper">
            <select
              disabled={displayUsers.length === 0}
              className="drop-down"
              onChange={handleSortColumnChange}
              value={sortColumn}
            >
              <option value="">Sort By</option>
              {sortOptions.map((sortOption, index) => (
                <option key={index} value={sortOption.value}>
                  {sortOption.label}
                </option>
              ))}
            </select>
            <select
              disabled={sortColumn == ""}
              className="drop-down"
              onChange={handleSortOrderChange}
              value={sortOrder}
            >
              <option value="">Sort Order</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>

            <select
              disabled={displayUsers.length === 0}
              className="drop-down"
              onChange={handlePageSizeChange}
              value={pageSize}
            >
              <option value={DEFAULT_PAGE_SIZE}>Page Size</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
        </div>
        <hr />
        {displayUsers.length > 0 && (
          <>
            <h3>{dataSource.name} Results</h3>
            <div className="page-nav-wrapper">
              <button
                className="page-button"
                onClick={() => handlePageNav("first")}
              >
                {"<<"}
              </button>
              <button
                className="page-button"
                onClick={() => handlePageNav("prev")}
                disabled={pageNumber == 0}
              >
                {"<"}
              </button>
              <span>
                {pageNumber + 1} of {numPages}
              </span>
              <button
                className="page-button"
                onClick={() => handlePageNav("next")}
                disabled={pageNumber == numPages - 1}
              >
                {">"}
              </button>
              <button
                className="page-button"
                onClick={() => handlePageNav("last")}
              >
                {">>"}
              </button>
            </div>
          </>
        )}
      </div>
      <div className="results-wrapper">
        {displayUsers.map((user: CardProps) => {
          const userProps: CardProps = {
            name: user.name,
            email: user.email,
            phoneNumber: user.phone,
            image: user.image,
            url: user.url,
          };
          return <Card key={user.name} {...userProps} />;
        })}
      </div>
      <div className="error-wrapper">{error}</div>
    </div>
  );
}
