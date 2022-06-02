const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const leaveworkSchema = new mongoose.Schema({
  lew_topic: { type: String, required: true }, // หัวข้อ
  lew_detail: { type: String, required: true },
  lew_start: { type: Date, required: true },
  lew_end: { type: Date, required: true },
  lew_number_day: { type: Number, required: true },
  lew_manager_confirm: { type: Boolean, required: true, default: false },
  lew_ceo_confirm: { type: Boolean, required: true, default: false },
  lew_timestamp: { type: Date, required: true, default: Date.now() },
});

leaveworkSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Leavework = mongoose.model("leavework", leaveworkSchema);

const validate = (data) => {
  const schema = Joi.object({
    lew_topic: Joi.string().required().label("lew_topic"),
    lew_detail: Joi.string().required().label("lew_detail"),
    lew_start: Joi.date().raw().required(),
    lew_end: Joi.date().raw().required(),
    lew_number_day: Joi.number()
      .precision(2)
      .required()
      .label("lew_number_day"),
    lew_manager_confirm: Joi.boolean().default(false),
    lew_ceo_confirm: Joi.boolean().default(false),
    lew_timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { Leavework, validate };
