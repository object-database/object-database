import {timeslots} from "./timeslots.fixtures.js";

export const rooms = [
  {Location: "Cape Town", Name: "CPT Room 1", Capacity: 10, TimeSlots: [timeslots[0], timeslots[1], timeslots[2]]},
  {Location: "Cape Town", Name: "CPT Room 2", Capacity: 16, TimeSlots: [timeslots[0], timeslots[1]]},
  {Location: "Rosebank", Name: "JHB Room 1", Capacity: 6, TimeSlots: [timeslots[0], timeslots[1]]},
  {Location: "Rosebank", Name: "JHB Room 2", Capacity: 20, TimeSlots: [timeslots[0], timeslots[1]]},
  {Location: "Rosebank", Name: "JHB Colab", Capacity: 100, TimeSlots: [timeslots[0], timeslots[1]]},
]