const router = require("express").Router();
const { Partner } = require("../models/partner.model");
const bcrypt = require("bcrypt");
const Joi = require("joi");
require("dotenv").config();
// partner_username
// emp_password

router.post("/", async (req, res) => {
  // console.log(req.body);
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const partner = await Partner.findOne({
      partner_username: req.body.partner_username,
    });
    console.log(partner);

    if (!partner)
      return res.status(401).send({
        message: "Invalid partner_username or partner_password",
        status: false,
      });

    const validPassword = await bcrypt.compare(
      req.body.partner_password,
      partner.partner_password
    );
    if (!validPassword)
      return res.status(401).send({
        message: "Invalid partner_username or partner_password",
        status: false,
      });

    const token = partner.generateAuthToken();
    const data = {
      _id: partner._id,
      partner_name: partner.partner_name,
      partner_level: partner.partner_level,
      partner_sublevel: partner.partner_sublevel,
      partner_status: partner.partner_status,
    };
    res.status(200).send({
      token: token,
      message: "logged in successfully",
      status: true,
      data,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    partner_username: Joi.string().required().label("partner_username"),
    partner_password: Joi.string().required().label("partner_password"),
  });
  return schema.validate(data);
};

module.exports = router;
