# Junior fullstack interview exercise

Simple backend API for skills list application.

Project can contain a few "not the best" solutions that can be pointed out by the candidate during interview.

## prerequisites

- node v20.10.0+
- npm v10.2.3+
- docker-compose version 2.22.0+
- docker version 24.0.6+

## run tests

- install dependencies `npm install`
- run docker with postgres `npm run start:services` keep it running in separate terminal
- run tests `npm run test`

## notes

- You can switch to use storage mocks in `.env` file: `USE_DB_MOCK=true`
- tests should pass for integration tests with dockerized database and also with mocked storages

## troubleshooting

- in case of error related to installing dependencies install `libpq` (on mac: `brew install libpq`)

## Structure

Tasks are on cascading branches main <- task1 <- task2  <- task3
Final version is on task3 branch

## Testing

To see applicaton in work it can be run local with postgress docker `npm run dev:local`
or everything on docker `npm run dev:docker`
allso only database `npm run dev:db-only`
test work as described originally but can be run when postgress ir run by diffrent means

##Not the best pracices:

- **Script clutter** – some scripts contain similar functionalities that could be consolidated.  
- **Environment variables** – `.env` files should normally be added to `.gitignore` to avoid committing sensitive data.  
- **Import paths** – setting up path aliases in `tsconfig.json` would help avoid relative file imports.  
- **Team coordination** – some changes were made to existing files (e.g., error-handling middleware) that should ideally be discussed with the team before modifying.  
- **Component exports** – components could be exported from their folders using an `index.ts` that re-exports the component, making scope management cleaner.  
- **Localization** – using a library like `i18next` would allow proper handling of translations per component instead of a shared pool of hard-coded translations.  
- **App structure** – currently all components, fetches, and `useEffect` calls are in `App.tsx`. It could be split so that individual components (e.g., `SkillsList`) handle their own data and pagination, improving performance for larger datasets.  
- **Front-end testing** – there are no front-end tests implemented, even though testing libraries are installed.  
- **API service** – `apiService.ts` could be divided into separate modules for better maintainability.  
- **Fetch requests** – using `axios` or a custom wrapper around `fetch` could improve consistency, error handling, and readability of API calls.
