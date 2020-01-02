# Currency Exchange Application

Instructions to run the application:

- Clone the application

```bash
git clone https://github.com/sh-waqar/currency-exchange.git
```

- Install the dependencies

```bash
npm install
```

- Run the app locally in the development mode

```bash
npm start
```

Open http://localhost:3000 to view it in the browser.

## Libraries Used

- `React` with Class Components
- `Redux` for State Management
- `Jest` for Unit Testing
- `PropTypes` for type safety
- `Emotion` for styles
- `Big.js` for precise mathematical calculations
- `normalize.css` for normalizing the base styles in different browsers
- `react-page-visibility` for controlling the number of API requests to the server when the tab is not active

## Folder Structure

- `/api` contains the API related code
- `/components` contains all the reusable dumb react components
- `/helpers` contains helper functions that can be used throughout the project
- `/pages` contains the entire page/widget or smart components that are connected to Redux and API
- `/redux` contains all the redux related code

## Architectural Decisions

- I decided not to use Redux-thunks or Redux-Sagas for this application because there is only one single page and the functional requirements can be fulfilled by only managing the API state in Class component
- For redux, I decided to use ducks modular pattern to keep files based on features, and each file contains the Constants, Action creators, and Reducer.
- I used [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) to format currencies based on browser locale and add currency symbols.
- I used [Big.js](https://github.com/MikeMcl/big.js/) for performing precise mathematical calculations because doing Math operations in Javascript are not reliable most of the times.
- I used [Page Visibility Api](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) to reduce the number of API requests being sent to the server while the user is not actively using the application. When the user changes the tab, I stop polling for Exchange Rate information, and when the user comes back to the application and makes the tab active, I start polling again.

## Technical Specification

- The source input can accept minimum amount of 0.00 and maximum amount of 9.99 Trillion.
- The target input can accept minimum amount of 0.00 and maximum amount of 9.99 Trillion times currency rate.
- The source and target amount is updated in real-time based on latest exchange rate, if either source or target amount is updated.
- Its not allowed to exchange currency if source amount is more than the pocket balance.

## Known Improvements

- The initial state is defined in redux, but for a real app, it might be coming from API, which would require some new action creators.
- There can be some improvements related to bundle optimization by lazy loading the Exchange page, but since right now, that is the only page in the application, its an overkill.
- ~~The target input is calculated only when the user is typing, to have a more delightful experience, and to make the exchange happening real-time, the amount on target should be updated when the rate changes even if the user is not typing in the input. It can be achieved probably by using selectors, but it would involve controlling more state and can become a bit complicated.~~
- ~~There can be some error notification when the API returns some error.~~
