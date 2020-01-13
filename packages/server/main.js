const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const router = require("./router");

const BIND_PORT = require("./config");

const port = process.env.PORT || BIND_PORT;

// allow cross-origin requests
app.use(cors());
app.use(router);

// connect to mlab database
// make sure to replace my db string & creds with your own
mongoose.connect("mongodb://localhost:27017/historical");
mongoose.connection.once("open", () => {
  console.log("conneted to database");
});

// bind express with graphql
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(port, () => {
  console.log(`now listening for requests on port ${port}`);
});
