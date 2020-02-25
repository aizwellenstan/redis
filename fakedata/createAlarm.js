const request = require("request");

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var fakeAlarm = {
  uri: "http://127.0.0.1:5443/alarmInfo/",
  headers: {
    "Content-type": "application/json"
  },
  json: [
    {
      objectId: "f9ad22d7-4657-408b-95db-08147c619ae7",
      DisplayObjectId: "environment_co100101", //CO感測器01
      AlarmCategory: "Medium",
      AlarmFunction: "AlarmNeedAckNoReset",
      TriggerLogic: ">",
      trigger_value: "50",
      AlarmMessage: "CO1濃度過高",
      AlarmMessageEnglish: "CO1濃度過高",
      AlarmMessageSpanish: "CO1濃度過高",
      AlarmMessageJapenese: "CO1濃度過高",
      IsOpenTrigger: "1"
    },
    {
      objectId: "b48ddf73-c31d-4731-8047-83ad40e73464",
      DisplayObjectId: "environment_chillermotor000201", //冷卻水泵01 
      AlarmCategory: "Low",
      AlarmFunction: "AlarmNoAckNoReset",
      TriggerLogic: "=",
      trigger_value: "0",
      AlarmMessage: "冷卻馬達-2停止中",
      AlarmMessageEnglish: "冷卻馬達-2停止中",
      AlarmMessageSpanish: "冷卻馬達-2停止中",
      AlarmMessageJapenese: "冷卻馬達-2停止中",
      IsOpenTrigger: "1"
    },
    {
      objectId: "e10f9d11-13b5-4694-ba12-cec88222cf20",
      DisplayObjectId: "energy_volltagemchine000301", //電箱01 
      AlarmCategory: "Emergency",
      AlarmFunction: "AlarmNeedAckNoReset",
      TriggerLogic: "=",
      trigger_value: "1",
      AlarmMessage: "ACBB1-故障",
      AlarmMessageEnglish: "ACBB1-故障",
      AlarmMessageSpanish: "ACBB1-故障",
      AlarmMessageJapenese: "ACBB1-故障",
      IsOpenTrigger: "1"
    },
    {
      objectId: "4bdc2e8a-ce5c-4a84-b0a8-8efe4d74e0ef",
      DisplayObjectId: "environment_chillerwatertank000301", //冷水箱01 
      AlarmCategory: "Medium",
      AlarmFunction: "AlarmNeedAckNoReset",
      TriggerLogic: "=",
      trigger_value: "0",
      AlarmMessage: "冷卻水塔-1停止中",
      AlarmMessageEnglish: "冷卻水塔-1停止中",
      AlarmMessageSpanish: "冷卻水塔-1停止中",
      AlarmMessageJapenese: "冷卻水塔-1停止中",
      IsOpenTrigger: "1"
    },
    {
      objectId: "8b13dfea-a7fb-4404-88a5-b58f5a3e5822",
      DisplayObjectId: "environment_chillermotor000201", //冷卻水泵01 
      AlarmCategory: "High",
      AlarmFunction: "AlarmNeedAckNeedReset",
      TriggerLogic: "=",
      trigger_value: "1",
      AlarmMessage: "冷卻馬達-1故障跳脫",
      AlarmMessageEnglish: "冷卻馬達-1故障跳脫",
      AlarmMessageSpanish: "冷卻馬達-1故障跳脫",
      AlarmMessageJapenese: "冷卻馬達-1故障跳脫",
      IsOpenTrigger: "1"
    },
  ]
};

request.post(fakeAlarm, function (error, response, body) {
  console.log(response);
});

const URI = "http://localhost:4000/historical";

var alarm = {
  uri: "http://127.0.0.1:5443/testAlarmTrigger/",
  headers: {
    "Content-type": "application/json"
  },
  json: {
    objectId: "",
    sensor_value: 0
  }
};

createHis = {
  uri: "",
  headers: {
    "Content-type": "application/json"
  },
  json: [{ Name: "Value", Value: "", DataType: "ExtendedEnum" }]
};

var his = {
  uri: "",
  headers: {
    "Content-type": "application/json"
  },
  json: [{ Name: "Value", Value: "", DataType: "ExtendedEnum" }]
};

var ddosAlarm_His = function (ObjectId, min, max) {
  var rand = randomIntFromInterval(min, max);
  // Add Data to alarm
  alarm.json.objectId = ObjectId;
  alarm.json.sensor_value = rand;

  // Add Data To his
  his.uri = URI + ObjectId + "/attributes";
  his.json.Value = rand;
  //request.post(his, function(error, response, body) {});
  request.post(alarm, function (error, response, body) { });
  console.log("post " + alarm.uri + " " + his.json.Value);
  console.log("post " + his.uri + " " + his.json.Value);
};

// 5 alam datas
createAlarm = () => {
  request.post(fakeAlarm, function (error, response, body) {
    console.log(response);
  });
  setInterval(function () {
    ddosAlarm_His("f9ad22d7-4657-408b-95db-08147c619ae7", 51, 60); // CO 感測器1
    ddosAlarm_His("4bdc2e8a-ce5c-4a84-b0a8-8efe4d74e0ef", 0, 0); // 冷卻水塔-1運轉狀態
    ddosAlarm_His("b48ddf73-c31d-4731-8047-83ad40e73464", 0, 0); // 冷卻馬達-1運轉狀態
    ddosAlarm_His("8b13dfea-a7fb-4404-88a5-b58f5a3e5822", 1, 1); // 冷卻馬達-1故障跳脫
    ddosAlarm_His("e10f9d11-13b5-4694-ba12-cec88222cf20", 1, 1); // ACBB1-故障狀態01
  }, 5000);
}

module.exports = createAlarm