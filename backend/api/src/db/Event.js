import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  id: Number,
  cancelled: Boolean,
  startDate: Date,
  endDate: Date,
  name: String,
  strippedDetail: String,
  eventsCategory: String,
  eventsHost: String,
  newUrl: String,
  paymentEventType: String,
  eventsAddress: {
    city: String,
    state: String,
    country: String,
  },
}, { collection: "events" }); 

export default mongoose.model("Event", eventSchema);
