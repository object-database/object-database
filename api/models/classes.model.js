import Realm from "realm";

//User Class
class User extends Realm.Object {
  static schema = {
    name: "User",
    properties: {
      UserId: "int",
      Name: "string",
      Email: "string"
    },
    primaryKey: "UserId"
  };
}

//Meeting Class
class Meeting extends Realm.Object {
  static schema = {
    name: "Meeting",
    properties: {
      MeetingId: "int",
      MeetingOwner: "User",
      MeetingAttendees: "User[]",
      Title: "string",
      StartTime: "date", 
      EndTime: "date", 
      onlineMeeting: "onlineMeeting?",
      workMeeting: "workMeeting?"
    },
    primaryKey: "MeetingId"
  };
}

//onlineMeeting Class
class onlineMeeting extends Realm.Object {
  static schema = {
    name: "onlineMeeting",
    embedded: true,
    properties: {
      teamsLink: "string"
    },
  };
}

//TimeSlot Class
class TimeSlot extends Realm.Object {
  static schema = {
    name: "TimeSlot",
    properties: {
      TimeSlotId: "int",
      StartTime: "date", 
      EndTime: "date", 
    },
    primaryKey: "TimeSlotId"
  };
}

//Room Class
class Room extends Realm.Object {
  static schema = {
    name: "Room",
    properties: {
      RoomId: "int",
      Location: "string",
      Name: "string",
      Capacity: "int",
      TimeSlots: "TimeSlot[]"
    },
    primaryKey: "RoomId"
  };
}

//workMeeting Class
class workMeeting extends Realm.Object {
  static schema = {
    name: "workMeeting",
    embedded: true,
    properties: {
      room: "Room"
    },
  };
}

const openRealm = async () => {
  try {
    const realm = await Realm.open({
      schema: [User, Meeting, onlineMeeting, TimeSlot, Room, workMeeting],
    });
    console.log("Realm opened successfully");
    return realm;

  } catch (error) {
    console.error("Error opening Realm:", error);
  }
};

openRealm();