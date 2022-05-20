const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const Advance_MoneySchema = new mongoose.Schema({
  avm_owner: { type: String, required: true }, // _id
  avm_amount: { type: Number, required: true },
  avm_status: { type: String, required: true, default: "waiting" },
  avm_timestamp: { type: Date, required: true, default: new Date() },
});

Advance_MoneySchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Advance_Money = mongoose.model("advance_money", Advance_MoneySchema);

const validate = (data) => {
  const schema = Joi.object({
    avm_owner: Joi.string().required().label("avm_owner"),
    avm_amount: Joi.number().precision(2),
    avm_status: Joi.string().default("waiting"),
    // avm_timestamp: Joi.date().raw().required().default(new Date()),
  });
  return schema.validate(data);
};

module.exports = { Advance_Money, validate };
