import Realm from "realm";
import {User, Meeting, onlineMeeting, TimeSlot, Room, workMeeting} from "../models/classes.model.js";

const openRealm = async () => {
  try {
    const app = new Realm.App({
      id: process.env.REALM_APP_ID,
    });
    const anonymousUser = await app.logIn(Realm.Credentials.anonymous());
    console.log(anonymousUser);
    const realm = await Realm.open({
      schema: [User, Meeting, onlineMeeting, TimeSlot, Room, workMeeting],
      sync: {
        user: anonymousUser,
        flexible: true,
        initialSubscriptions: {
          update: (subs, realm) => {
            subs.add(realm.objects(User));
          },
        },
      }
    });
    console.log("Realm opened successfully");
    return realm;

  } catch (error) {
    console.error("Error opening Realm:", error);
  }
};

export const realm = await openRealm();
