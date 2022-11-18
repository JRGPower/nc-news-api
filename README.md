# Northcoders News API

# Minimum node version required
 Node.js v18.8.0.

# Initialisation
Use command "npm i" to install required dependencies

# ENV Setup
Two data sets are contained in this project repo, *dev data* and *test data*.

In order to use the provided data sets, two .env files will need to created in the root folder: 
`.env.test`
`.env.development`
Each file must contain `PGDATABASE=<database_name_here>`, with the correct database name for the test data and dev data respectively (see `/db/setup.sql` for the database names).

 Ensure that these .env files are .gitignored.
