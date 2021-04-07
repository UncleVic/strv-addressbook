# strv-addressbook-polyakov-viktor
Test assignment for STRV
## Build
After clone git repo you have to build it

``` bash
npm install && npm run build
```
## Setup
If you like to start the App in HTTPS(recomended), you need to have files of SSL certificate. Please, see other resuorces for get them.

Also, you have to set enviroments variables. All variables are required.

```
PORT - apps port
NODE_ENV - production or development
PROCESS_SIGNALS - comma separated string of signals for gracefull shutdown. For ex. SIGINT,SIGTERM,SIGHUP

MONGODB_URI - connection string for MongoDB
MONGODB_DB_NAME - name of DB
MONGODB_APP_NAME - app name
MONGODB_LOGGER_LEVEL - log level for MongoDB mesages (info, error, debug)
MONGODB_AUTO_INDEX - set to true for this project
MONGODB_SERVER_SELECTION_TIMEOUT - integer, for ex. 5000
MONGODB_SOCKET_TIMEOUT - integer, for ex. 45000
MONGODB_FAMILY - set 4 or see MongoDB`s doc
MONGODB_POOL_SIZE - integer, not recomended use more than 10 for this project.

SSL_KEY - path to 'key' file or empty string for HTTP
SSL_CERT - path to 'crt' file or empty string for HTTP

BASE_SERVICE_ROUTE - base route for Address book's books routes. Recommended /api/v1
AUTH_ROUTE - base route for auth's routes. Recommended /auth

PASSWORD_SALT_ROUND - any integer
JWT_ISSUER - any string
JWT_AUDIENCE - any string
JWT_EXPIRES - time of token lives in seconds, for ex. 60
JWT_SECRET - any string

GOOGLE_APPLICATION_CREDENTIALS - path to Google credantional file
FIREBASE_URL - url of Firebase DB
```

For local start in ```dev``` mode you should use ```.env``` file and start the App by next command
``` bash
npm run dev
```

## Start
Please use
``` bash
npm start
```
for start the App in production enviroment