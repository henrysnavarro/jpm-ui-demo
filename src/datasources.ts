const DATA_SOURCES = [
  {
    id: 1,
    name: "JSON Placeholder",
    url: "https://jsonplaceholder.typicode.com/users",
    collectionNode: "",
    attributes: [
      { path: "name", dataType: "string", mapsTo: "name", sortable: true },
      { path: "email", dataType: "string", mapsTo: "email", sortable: true },
      {
        path: "phone",
        dataType: "string",
        mapsTo: "phoneNumber",
        sortable: false,
      },
    ],
    adapter: () => {},
  },
  {
    id: 2,
    name: "Ricky & Morty API",
    url: "https://rickandmortyapi.com/api/character",
    collectionNode: "results",
    attributes: [
      { path: "id", dataType: "number", mapsTo: "id", sortable: false },
      { path: "name", dataType: "string", mapsTo: "name", sortable: true },
      {
        path: "location.url",
        dataType: "string",
        mapsTo: "url",
        sortable: false,
      },
      { path: "image", dataType: "string", mapsTo: "image", sortable: false },
    ],
    adapter: () => {},
  },
];

export default DATA_SOURCES;
