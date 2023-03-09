# Atomic TODO
Track your TODOs across days, weeks and months

# Setting up
This repo uses Yarn workspaces, this means running `yarn install` in the root will install the dependencies in the subdirectories.

# Atomic TODO Server
This is a simple Apollo based GraphQL server that provides the types for the Atomic TODO data models as well as a means for the frontends to sync data.

## Running Server Locally
`yarn start` will generate the TypeScript types for the GraphQL schema and transpile the TypeScript code into JS before running the server under Node.
The Apollo server will then be available under [http://localhost:4000](http://localhost:4000)
