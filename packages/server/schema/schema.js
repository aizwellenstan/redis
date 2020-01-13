const graphql = require("graphql");
const Attribute = require("../models/attribute");
const Historical = require("../models/historical");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const AttributeType = new GraphQLObjectType({
  name: "Attribute",
  fields: () => ({
    id: { type: GraphQLID },
    Key: { type: GraphQLString },
    Value: { type: GraphQLString },
    Timestamp: { type: GraphQLInt },
    historical: {
      type: HistoricalType,
      resolve(parent, args) {
        return Historical.findById(parent.historicalId);
      }
    }
  })
});

const HistoricalType = new GraphQLObjectType({
  name: "Historical",
  fields: () => ({
    id: { type: GraphQLID },
    ObjectId: { type: GraphQLString },
    Attributes: {
      type: new GraphQLList(AttributeType),
      args: { Timestamp: { type: GraphQLInt } },
      resolve(parent, args) {
        return Attribute.find({
          objectId: parent.ObjectId,
          // $lte, $gte
          Timestamp: { $lte: args.Timestamp }
        })
          .sort({ Timestamp: -1 })
          .limit(1);
      }
    }
  })
});

const FastHistoricalType = new GraphQLObjectType({
  name: "FastHistorical",
  fields: () => ({
    id: { type: GraphQLID },
    ObjectId: { type: GraphQLString },
    Attributes: {
      type: new GraphQLList(AttributeType),
      resolve(parent, args) {
        return Attribute.find({
          objectId: parent.ObjectId
        })
          .sort({ Timestamp: -1 })
          .limit(1);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    attribute: {
      type: AttributeType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Attribute.findById(args.id);
      }
    },
    historical: {
      type: HistoricalType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Historical.findById(args.id);
      }
    },
    attributes: {
      type: new GraphQLList(AttributeType),
      resolve(parent, args) {
        return Attribute.find({});
      }
    },
    historicals: {
      type: new GraphQLList(HistoricalType),
      resolve(parent, args) {
        return Historical.find({});
      }
    },
    fasthistoricals: {
      type: new GraphQLList(FastHistoricalType),
      resolve(parent, args) {
        return Historical.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addHistorical: {
      type: HistoricalType,
      args: {
        ObjectId: { type: GraphQLString }
      },
      resolve(parent, args) {
        console.log(args.ObjectId);
        Historical.count({ ObjectId: args.ObjectId }).then(count => {
          if (count > 0) {
            console.log("Historical exists.");
          } else {
            let historical = new Historical({
              ObjectId: args.ObjectId
            });
            return historical.save();
          }
        });
      }
    },
    addAttribute: {
      type: AttributeType,
      args: {
        Key: { type: new GraphQLNonNull(GraphQLString) },
        Value: { type: new GraphQLNonNull(GraphQLString) },
        Timestamp: { type: GraphQLInt },
        objectId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let attribute = new Attribute({
          Key: args.Key,
          Value: args.Value,
          objectId: args.objectId,
          Timestamp: args.Timestamp
        });
        return attribute.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
