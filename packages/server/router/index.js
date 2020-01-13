const express = require("express");
// ルーティングするで
const router = express.Router();
const bodyParser = require("body-parser");
const { createApolloFetch } = require("apollo-fetch");
const BIND_PORT = require("../config");
const fetch = createApolloFetch({
  uri: `http://127.0.0.1:${BIND_PORT}/graphql`
});

const redis = require("redis");
let client = redis.createClient();

client.on("connect", function() {
  console.log("Connected to Redis...");
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/historical", function(req, res) {
  req.query.from ? (from = req.query.from) : (from = "");
  var obj = "";
  client.keys("*", function(e, keys) {
    if (e) console.log(e);

    keys.forEach(function(key) {
      client.hgetall(key, function(err, obj) {
        if (!obj) {
          console.log("err");
        } else {
          obj.id = key;
          console.log({ ObjectData: obj });
          return (obj = obj);
        }
      });
    });
  });

  // id = "38c69d3d-d5f8-47ff-a615-4b5b02f32380";
  // client.hgetall(id, function(err, obj) {
  //   if (!obj) {
  //     console.log("err");
  //   } else {
  //     obj.id = id;
  //     console.log({ user: obj });
  //   }
  // });

  res.json(obj);

  // if (from !== "") {
  //   // res.json("slow");
  //   from = parseInt(req.query.from);
  //   fetch({
  //     query: `{
  //             historicals{
  //               ObjectId
  //               Attributes(Timestamp: ${from}){
  //                 Key
  //                 Value
  //                 Timestamp
  //               }
  //             }
  //           }`
  //   })
  //     .then(response => {
  //       obj = response;
  //       const json = JSON.stringify(obj);
  //       const withStrings = JSON.parse(json, (key, val) =>
  //         typeof val !== "object" && val !== null ? String(val) : val
  //       );
  //       res.json(withStrings.data.historicals);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // } else {
  //   // res.json("fast");
  //   from = Math.floor(Date.now() / 1000);
  //   fetch({
  //     query: `{
  //             fasthistoricals{
  //               ObjectId
  //               Attributes{
  //                 Key
  //                 Value
  //                 Timestamp
  //               }
  //             }
  //           }`
  //   })
  //     .then(response => {
  //       obj = response;
  //       const json = JSON.stringify(obj);
  //       const withStrings = JSON.parse(json, (key, val) =>
  //         typeof val !== "object" && val !== null ? String(val) : val
  //       );
  //       res.json(withStrings.data.fasthistoricals);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });

  // from !== ""
  //   ? (from = parseInt(req.query.from))
  //   : (from = Math.floor(Date.now() / 1000));
  // fetch({
  //   query: `{
  //             historicals{
  //               ObjectId
  //               Attributes(Timestamp: ${from}){
  //                 Key
  //                 Value
  //                 Timestamp
  //               }
  //             }
  //           }`
  // })
  //   .then(response => {
  //     obj = response;
  //     const json = JSON.stringify(obj);
  //     const withStrings = JSON.parse(json, (key, val) =>
  //       typeof val !== "object" && val !== null ? String(val) : val
  //     );
  //     res.json(withStrings.data.historicals);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
});

router.post("/historical", function(req, res) {
  // objectId = req.body.objectId;
  var data = req.body;
  for (var i in data) {
    console.log(data[i].objectId);
    fetch({
      query: `mutation {
                addHistorical(ObjectId: "${data[i].objectId}"){
                  id
                  ObjectId
                }
              }`
    }).then(response => {
      // obj = response;
      // res.json(obj);
    });
  }
  res.status(200).json("created");
});

// Attribute Control
router.post("/attributecontrol/:objectId", function(req, res) {
  Key = "Present_Value";
  Value = req.body[0].Value;
  Timestamp = Math.floor(Date.now() / 1000);
  objectId = req.params.objectId;
  console.log(objectId);

  fetch({
    query: `mutation {
              addAttribute(
                Key: "${Key}",
                Value: "${Value}",
                Timestamp: ${Timestamp},
                objectId: "${objectId}"
              ){
                Key
                Value
                Timestamp
              }
            }`
  }).then(response => {
    obj = response;
    res.json(obj);
  });
});

// Attribute Create
router.post("/attribute", function(req, res) {
  Key = "Present_Value";
  Timestamp = Math.floor(Date.now() / 1000);
  var data = req.body;
  Key = "Present_Value";

  for (var i in data) {
    Timestamp = Math.floor(Date.now() / 1000);
    client.hmset(
      data[i].objectId,
      ["Key", Key, "Value", data[i].Value, "Timestamp", Timestamp],
      function(err, reply) {
        if (err) {
          console.log(err);
        }
        console.log(reply);
      }
    );

    // fetch({
    //   query: `mutation {
    //                       addAttribute(
    //                         Key: "${Key}",
    //                         Value: "${data[i].Value}",
    //                         Timestamp: ${Timestamp},
    //                         objectId: "${data[i].objectId}"
    //                       ){
    //                         Key
    //                         Value
    //                         Timestamp
    //                       }
    //                     }`
    // });
  }
  res.status(200).json("created");
});

//routerをモジュールとして扱う準備
module.exports = router;
