## Getting started

- Clone the repository
- Run `yarn install` to install all dependencies
- Run `yarn start` to start the process; it should launch a browser tab
- That's it!

### Notes

- This was built using CRA
- This refers to data from `src/data/store.ts`
- This utilises a custom `useData` hook to simulate fetching data from a remote resource
  - This hook also behaves as an interface to process the data before the UI consumes it
- Basic TS interfaces have been setup
- The MomentJS library was used to navigate the timezone complexities
- Some inline comments exist for better understanding
- Some of the boilerplate CRA files/assets remain as-is
- Minimal usage of CSS or any theming logic
