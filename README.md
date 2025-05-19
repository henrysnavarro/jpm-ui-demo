# UI Demo

## Overview

This is an example NodeJS React application that fetches a collection of data from a web resource and displays it using a specific component.  Upon display of the collecton of records, the user is allowed to perform matching searches, sorting by specific fields, specifying paging size, and navigating along the resulting pages.

## Instructions

The application starts with a data source selector, input fields and an empty result.

1. Select the data source from the dropdown

    - The application will then fetch the data
    - Upon loading of the data
        - card components will be shown
        - Search, sort and pagination fields will be enabled

2. Perform the available features by interacting the user interface:

    - Enter search text to filter matching records
    - Specify a "Sort By" column and "Sort Order" to sort the records in the desired manner (both are needed)
    - Specify "Page Size" to display the desired number of records for each page
    - Navigate through the pages of the entire collection by pressing on the appropriate page navigation buttons above the collection

NOTE:
All of filtering, sorting and paging are performed client-side (in-memory), on the data fetched by the application

## Technical Information

### Techniques and Methods

- The following have been used in the implementation:
    - React
        - function components
        - hooks (useState, useEffect)
        - controlled components
        - event handlers
    - fetch JavaScript function (Promises, event handling for data/error)
    - various JavaScript array utilities for mapping, filtering, sorting
    - CSS
        - FlexBox display (supporting responsive behavior)
    - Dependency Injection / Configuration
        - A data sources code file to specify and control the available data sources for the application

### Outstanding Features To Be Implemented

As of the time of writing, the following items are yet to be implemented:

- TypeScript error fixes
- Re-factoring for code streaming and best practices alignment
- WCAG/Accessibility features
- Theming
- Unit Testing
- Integration Testing
- Storybook Testing
- Live Device Testing (mobile, small screen size )
