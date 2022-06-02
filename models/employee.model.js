const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const employeeSchema = new mongoose.Schema({
  emp_name: { type: String, required: true },
  emp_tel: { type: String, required: true },
  emp_iden: { type: String, required: true },
  emp_address: { type: String, required: true },
  emp_username: { type: String, required: true },
  emp_password: { type: String, required: true },
  emp_department: { type: String, required: true },
  emp_position: { type: String, required: true },
  emp_salary: { type: Number, required: true },
  emp_start: { type: Date, required: true },
  emp_end: { type: Date, required: true },
  emp_bank: { type: String, required: true },
  emp_bank_number: { type: String, required: true },
  emp_pic: { type: String, required: true },
  emp_status: { type: String, required: true },
  emp_timestamp: { type: Date, required: true, default: Date.now() },
});

employeeSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Employee = mongoose.model("employee", employeeSchema);

const validate = (data) => {
  const schema = Joi.object({
    emp_name: Joi.string(),
    emp_tel: Joi.string(),
    emp_address: Joi.string(),
    emp_iden: Joi.string(),
    emp_username: Joi.string(),
    emp_password: passwordComplexity().required().label("emp_password"),
    emp_department: Joi.string(),
    emp_position: Joi.string(),
    emp_salary: Joi.number().precision(2).required().label("emp_salary"),
    emp_start: Joi.date().raw().required(),
    emp_end: Joi.date().raw().required(),
    emp_bank: Joi.string().required().label("emp_bank"),
    emp_bank_number: Joi.string(),
    // emp_pic: Joi.string().required().label("emp_pic"),
    emp_status: Joi.string(),
    emp_timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { Employee, validate };
//   emp_end: Joi.date().format("YYYY-MM-DD").raw().required(),
