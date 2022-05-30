const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const EventReportSchema = new mongoose.Schema({
  evr_event_id: { type: String, required: true }, // _id
  evr_detail: { type: String, required: true },
  evr_partner_id: { type: String, required: true },
  evr_timestamp: { type: Date, required: true, default: Date.now() },
});

EventReportSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const EventReport = mongoose.model("event_report", EventReportSchema);

const validate = (data) => {
  const schema = Joi.object({
    evr_event_id: Joi.string(),
    evr_detail: Joi.string(),
    evr_partner_id: Joi.string(),
    evr_timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { EventReport, validate };
