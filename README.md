# Atomic TODO
Track your TODOs across days, weeks and months

# Setting up
This repo uses Yarn workspaces, this means running `yarn install` in the root will install the dependencies in the subdirectories.

# Atomic TODO Server
This is a simple Apollo based GraphQL server that provides the types for the Atomic TODO data models as well as a means for the frontends to sync data.

## Setting up Appwrite
- `cd appwrite`
- `cp env-template .env` , make any changes you need to for your setup
- Run `docker compose up`, this will start the Appwrite stack
- Sign up for an account with the new Appwrite stack at `http://localhost`
- Create a new project with the project ID (click the button to set it) of `atomic-todo`
- Create a new API key (under the server integration option), this needs to passed as an environment variable for `load_fixtures.py` and when running the Apollo server (details on that later)
  - You'll need to add the `users.read`, `users.write` and all the Database scopes for the token
- Install the Appwrite CLI and login
- Run `appwrite deploy collection`, select the collections and deploy them to create the database tables used
- Run `API_KEY=[api key generated] python3 load_fixtures.py` to then load fixture data into the database tables

## Running Server Locally
- `API_KEY=[api key generated] yarn start` will generate the TypeScript types for the GraphQL schema and transpile the TypeScript code into JS before running the server under Node.
The Apollo server will then be available under [http://localhost:4000](http://localhost:4000)

## Running Web Front-end Locally
- `yarn start` will compile and run the React development server on [http://localhost:3000](http://localhost:3000)