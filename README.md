# Northcoders News API

Link to live application
<url>https://lazy-cyan-pike-slip.cyclic.app/</url>

# Introduction
This is app that utilises node.js, express.js and postgresql to provide api that can query a database with http requests.

The project is designed to facilitate user interaction with news articles. 
The user can request to be served articles, article topic categories, comments and user profiles. 
They can also submit new comments, and add or remove votes from existing articles and comments.

# Minimum node and psql versions required
 Node.js v18.8.0.
 postgresql v12.12

# Initialisation
Use "git clone <link to this repo>" in a local command line to download the repo 
Then use command "npm i" to install required dependencies

# ENV Setup
Two data sets are contained in this project repo, *dev data* and *test data*.

In order to use the provided data sets, two .env files will need to created in the root folder: 
`.env.test`
`.env.development`
Each file must contain `PGDATABASE=<database_name_here>`, with the correct database name for the test data and dev data respectively (see `/db/setup.sql` for the database names).

Ensure that these .env files are .gitignored.

# DB setup commands
Use the following commands to set up and seed local development and test databases
npm run setup-dbs
npm run seed

