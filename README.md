# Chain Runners ELO

Visit [http://runners.datascience.art/](http://runners.datascience.art/) to vote on your favorite Mega City Chain Runners!

- [Chain Runners ELO](#chain-runners-elo)
  - [Getting Started](#getting-started)
    - [Configuring Postgres](#configuring-postgres)
    - [Installing dependencies](#installing-dependencies)
    - [Running the project locally](#running-the-project-locally)

## Getting Started

### Configuring Postgres

1. Download [Postgres](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) (_I grabbed version 14.1_)
2. Install it.
3. Create a new database named `chainrunners`
4. Use the `Restore` function to import `database/chainrunners.postgres`
5. That should do it!

### Installing dependencies

1. `cd` into `/app` and run `yarn install`
2. `cd` into `/middleware` and run `yarn install`

### Running the project locally

_It helps to have two terminals windows open for this_

1. In terminal A, `cd` into `/app` and run `yarn build`
2. In terminal B, `cd` into `/middleware` and run `yarn server`
3. In terminal A, run `yarn start`
4. Your browser will open to `localhost:3000` and you should see the UI!

:)
