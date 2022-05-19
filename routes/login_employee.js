const router = require("express").Router();
const { Employee } = require("../models/employee.model");
const bcrypt = require("bcrypt");
const Joi = require("joi");
require("dotenv").config();
// emp_username
// emp_password

router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const employee = await Employee.findOne({
      emp_username: req.body.emp_username,
    });
    const newData = employee;
    if (!employee)
      return res.status(401).send({
        message: "Invalid emp_username or emp_password",
        status: false,
      });

    const validPassword = await bcrypt.compare(
      req.body.emp_password,
      employee.emp_password
    );
    if (!validPassword)
      return res.status(401).send({
        message: "Invalid emp_username or emp_password",
        status: false,
      });

    const token = employee.generateAuthToken();
    const data = {
      _id: employee._id,
      emp_name: employee.emp_name,
      emp_deparment: employee.emp_deparment,
      emp_position: employee.emp_position,
      emp_pic: employee.emp_pic,
      emp_status: employee.emp_status,
    };
    console.log(data, "data");
    res.status(200).send({
      token: token,
      message: "logged in successfully",
      status: true,
      data: data,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    emp_username: Joi.string().required().label("emp_username"),
    emp_password: Joi.string().required().label("emp_password"),
  });
  return schema.validate(data);
};

module.exports = router;
