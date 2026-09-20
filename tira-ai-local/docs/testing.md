# Testing

## App Unit tests

- Install the dependencies using `pnpm install`
- In the app directory run `pnpm run test`

## App e2e tests

- Install the dependencies using `pnpm install` in app and `poetry install` in background-service
- Build background-service with ``poetry run invoke build`` and then run `pnpm run package` in app directory.
- In the app directory run `pnpm run test:e2e`

## Background-service Unit tests

- Install the dependencies using `poetry install`
- Run the unit tests using `poetry run invoke test`
