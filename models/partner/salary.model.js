const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const SalarySchema = new mongoose.Schema({
  salary_owner: { type: String, required: true }, // _id
  salary_amount: { type: Number, required: true },
  salary_pic: { type: String, required: true },
  salary_status: { type: String, required: true },
  salary_date: { type: Date, required: true, default: new Date() },
  salary_payroll_date: { type: Date, required: true, default: new Date() },
});

SalarySchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Salary = mongoose.model("salary", SalarySchema);

const validate = (data) => {
  const schema = Joi.object({
    salary_owner: Joi.string(),
    salary_amount: Joi.number().precision(2),
    salary_pic: Joi.string(),
    salary_status: Joi.string(),
    salary_date: Joi.date().raw(),
    salary_payroll_date: Joi.date(),
  });
  return schema.validate(data);
};

module.exports = { Salary, validate };
