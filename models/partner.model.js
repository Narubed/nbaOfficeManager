const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const partnerSchema = new mongoose.Schema({
  partner_name: { type: String, required: true },
  partner_tel: { type: String, required: true },
  partner_iden: { type: String, required: true },
  partner_level: { type: String, required: true },
  partner_sublevel: { type: String, required: true },
  partner_address: { type: String, required: true },
  partner_district: { type: String, required: true },
  partner_amphur: { type: String, required: true },
  partner_province: { type: String, required: true },
  partner_username: { type: String, required: true },
  partner_password: { type: String, required: true },
  partner_salary: { type: Number, required: true },
  partner_start: { type: Date, required: true },
  partner_end: { type: Date, required: true },
  partner_bank: { type: String, required: true },
  partner_bank_number: { type: String, required: true },
  partner_status: { type: String, required: true },
  partner_timestamp: { type: Date, required: true, default: Date.now() },
});

partnerSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Partner = mongoose.model("partner", partnerSchema);

const validate = (data) => {
  const schema = Joi.object({
    partner_name: Joi.string().required().label("partner_name"),
    partner_tel: Joi.string().required().label("partner_tel"),
    partner_iden: Joi.string().required().label("partner_iden"),
    partner_level: Joi.string().required().label("partner_level"),
    partner_sublevel: Joi.string().required().label("partner_sublevel"),
    partner_address: Joi.string().required().label("partner_address"),
    partner_district: Joi.string().required().label("partner_district"),
    partner_amphur: Joi.string().required().label("partner_amphur"),
    partner_province: Joi.string().required().label("partner_province"),
    partner_username: Joi.string().required().label("partner_username"),
    partner_password: passwordComplexity().required().label("partner_password"),
    partner_salary: Joi.number()
      .precision(2)
      .required()
      .label("partner_salary"),
    partner_start: Joi.date().raw().required(),
    partner_end: Joi.date().raw().required(),
    partner_bank: Joi.string().required().label("partner_bank"),
    partner_bank_number: Joi.string().required().label("partner_bank_num"),
    partner_status: Joi.string().required().label("partner_status"),
    // partner_timestamp: Joi.date().raw().required(),
  });
  return schema.validate(data);
};

module.exports = { Partner, validate };
