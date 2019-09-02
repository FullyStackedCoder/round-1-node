# round-1-node
A simple REST node and express server

### Tech Stack used:
1. Node.js.
2. Express.
3. body-parser -> for barsing request bodies
4. JSON Web Token -> for generating authentication tokens.
5. jsonpatch -> for a task to patch json object
6. morgan -> for logging.
7. sharp -> for image resizing.
8. mocha and chai -> for testing.

### How to use?
1. Clone this project somewhere you like.
2. Run - npm install - for installing the required packages.
3. Run the command - npm start - to start the server and watch for changes.
4. Run the command - npm test - to run the tests

### Docker specific
1. The docker file included has a multi-stage build process.
2. Commands for building various docker images ->
   - docker build -t roundonenode:dev --target=dev to build the development only image
   - docker build -t roundonenode:test --target=test to build the test only image
   - docker build -t roundonenode:prod --target=prod to build the production only image
3. Use :prod as tag for pulling from the docker repository.

That is it for now. I will be updating this document if I remember anything else.
