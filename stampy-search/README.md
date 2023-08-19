# Stampy Search

This is a standalone library for searching Stampy questions and answers.

## Local Development

1. [Install Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. Install all requirements: `npm install`
3. Change stuff
4. Run tests: `npm test`
5. Make minified version: `npm run build:prod`

## Example usage

There is an example HTML page that can be used to see how things can be integrated. It can be started with:

    npm run example

This can then be accessed at http://127.0.0.1:3123/index.html

## Configuration

Configuration is done by calling `stampySeach.setupSearch(<confing>)`, where `<config>` is an object with the
following optional keys:

- getAllQuestions - a function that will return a list of questions to be used in the baseline search. The default is an empty array
- numResults - the number of results to be returned by default. Initially set to 5
- server - where to look for stuff. The default is '', i.e. the current server
- searchEndpoint - the endpoint to use for searching for in progress questions
- workerPath - the path to the worker's js file on the server. The default is '/tfWorker.js'

### CORS

For the live questions query to work properly, it has to load a web worker. For the unpublished search to work, it needs to query an API endpoint. Both of these require CORS to be setup properly on the server that is to be queried. In the case of the basic Stampy sites, this can be configured via the `ALLOW_ORIGINS` environment setting - set it to the origin of the server that will be fetching stuff (so e.g. 'http://127.0.0.1:3123' for the example server) and everything should Just Work. Maybe. Hopefully...
