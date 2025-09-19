## Overview of the project :

- Trade server written in TS, tested by JEST, having the capability to add trades, get the portfolio and the profit&loss report.
- This is just a demo project - Assumes only one user for simplicity.

- Note: The service uses the Average Cost to calculate the unrealised and realised returns.

## How Run the backend service :

Pre-Requisites : `NodeJs` and a package manager like `npm` installed on the system. If not, this would be a good time to do the same.

---

1. Open terminal
2. Run the command `git clone git@github.com:prasunparijat/trade-demo-js.git`
3. `cd trade-demo-js` and then open this directory in your favourite IDE (For me, it is VSCode with shortcut `code .`)
4. Install the dependencies using `npm i`
5. Run the tests `npm run test`. This is like a sanity test that will also show the `coverage` as well the pass or fail results for the various functionalities supported by the backend.
6. Run the BE service using `npm run start` command. This will start the server on the localhost port 3000 by default.
7. Check health of your BE service by running the following curl command in the terminal `curl http://localhost:3000/health`.

## Primarily the Backend service exposes 4 endpoints :

1. GET `/health`
2. POST `/trade`
3. GET `/portfolio`
4. GET `/profitandlossreport`
   Don't worry , none of these are endpoints are authenticated as of now. So, feel free to explore the postman collection by importing the file `trade-demo-js-APIs.postman_collection.json` in your postman for comprehensive documentation of th requests.

## What files are relevant to you if you want to tinker around -

1. service.ts
2. trade-module.ts
3. trade-module.test.ts
4. trade-demo-js-APIs.postman_collection.json

## Further Improvements :

1. Folder structure - `src/` directory to contain all the relevant code.
2. More than 1 user capability
3. Usage of a more mature framework like nestjs and use the native
4. Use environment variables
