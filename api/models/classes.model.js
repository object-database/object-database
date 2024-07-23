import Realm from "realm";

//User Class
export class User extends Realm.Object {
  static schema = {
    name: "User",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      name: "string",
      email: "string"
    },
    primaryKey: "_id"
  };
}

//Meeting Class
export class Meeting extends Realm.Object {
  static schema = {
    name: "Meeting",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      MeetingOwner: "User",
      MeetingAttendees: "User[]",
      Title: "string",
      StartTime: "date", 
      EndTime: "date", 
      onlineMeeting: "onlineMeeting?",
      workMeeting: "workMeeting?"
    },
    primaryKey: "_id"
  };
}

//onlineMeeting Class
export class onlineMeeting extends Realm.Object {
  static schema = {
    name: "onlineMeeting",
    embedded: true,
    properties: {
      teamsLink: "string"
    },
  };
}

//TimeSlot Class
export class TimeSlot extends Realm.Object {
  static schema = {
    name: "TimeSlot",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      StartTime: "date", 
      EndTime: "date", 
    },
    primaryKey: "_id"
  };
}

//Room Class
export class Room extends Realm.Object {
  static schema = {
    name: "Room",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      Location: "string",
      Name: "string",
      Capacity: "int",
      TimeSlots: "TimeSlot[]"
    },
    primaryKey: "_id"
  };
}

//workMeeting Class
export class workMeeting extends Realm.Object {
  static schema = {
    name: "workMeeting",
    embedded: true,
    properties: {
      room: "Room"
    },
  };
}