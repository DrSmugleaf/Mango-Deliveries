# Mango Deliveries
## About
Mango Deliveries is a freighting website for EVE Online.

## Setup
1. Clone this repository.
2. Run `npm install`
3. Go to https://developers.eveonline.com/ and create an application.
4. Set "Connection Type" to "Authentication Only" and "Callback URL" to the url that users will be redirected to after login (locally `http://localhost:3000/callback` for development).
5. Create a .env file at the root of the project that sets the required environment variables below (see .env.example).
4. Run `npm run dev` to run both the express back-end and react front-end.

## Environment variables
### Required
- `EVE_CALLBACK` The URL to redirect to after the EVE SSO logs in the user, that has also been set in the EVE application configuration. This needs to use the same port as the react front-end.
- `EVE_DELIVERIES_SESSION_SECRET` A cryptographically secure secret for the cookie system to use.
- `EVE_ID` The client ID to use to communicate with the EVE API, obtained from the EVE application creation process in https://developers.eveonline.com/.
- `EVE_SECRET` The EVE Secret to use to communicate with the EVE API, obtained from the EVE application creation process in https://developers.eveonline.com/.
- `MYSQL_DATABASE` Name of the database to use for the connection.
- `MYSQL_PASSWORD` The password of the MySQL user.
- `MYSQL_USER` The MySQL user to authenticate as.

### Optional
- `DEBUG` Set to `express-session` to enable printing debug output for express sessions.
- `MYSQL_CONNECTION_LIMIT` The maximum number of connections to create at once. Defaults to 10.
- `MYSQL_HOST` The hostname of the database you are connecting to. Defaults to `localhost`.
- `MYSQL_PORT` The port number to connect to. Defaults to 3306.
- `NODE_ENV` Set to `dev` in a development environment, empty otherwise.
- `PORT` The port that the express back-end will use. Defaults to 3001.

## Front Page
![chrome_2ZLgNXFBtP](https://user-images.githubusercontent.com/10968691/129737164-52d5e8fc-2605-4a66-9cb3-3bb86e45fe0b.png)

## Contracts
![chrome_7uJ52AvTSK](https://user-images.githubusercontent.com/10968691/129737208-e37a1f5b-4972-463b-b00c-698b22eed163.png)

## Director Panel
![evedirectors](https://user-images.githubusercontent.com/10968691/129738840-081e2107-0f1b-47ce-b830-75e2d021cbaf.gif)
