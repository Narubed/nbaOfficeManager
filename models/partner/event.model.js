const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const EventSchema = new mongoose.Schema({
  event_owner: { type: String, required: true }, // _id
  event_topic: { type: String, required: true },
  event_detail: { type: String, required: true },
  event_status: { type: String, required: true, default: "sent" },
  event_timestamp: { type: Date, required: true, default: new Date() },
});

EventSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Event = mongoose.model("event", EventSchema);

const validate = (data) => {
  const schema = Joi.object({
    event_owner: Joi.string(),
    event_topic: Joi.string(),
    event_detail: Joi.string(),
    event_status: Joi.string().default("sent"),
    // event_timestamp: Joi.date().raw().required().default(new Date()),
  });
  return schema.validate(data);
};

module.exports = { Event, validate };
