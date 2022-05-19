const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Partner, validate } = require("../models/partner.model");

exports.create = async (req, res) => {
  console.log(req.body);
  try {
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .send({ message: error.details[0].message, status: false });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.partner_password, salt);
    const data = {
      ...req.body,
      partner_password: hashPassword,
    };
    await new Partner({
      ...req.body,
      partner_password: hashPassword,
    }).save();
    res
      .status(201)
      .send({ message: "Partner created successfully", status: true });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", status: false });
  }
};
exports.findAll = async (req, res) => {
  try {
    Partner.find()
      .then(async (data) => {
        res.send({ data, message: "success", status: true });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials.",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", status: false });
  }
};
exports.findOne = (req, res) => {
  const id = req.params.id;
  Partner.findById(id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "Not found Partner with id " + id, status: false });
      else res.send({ data, status: true });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Partner with id=" + id,
        status: false,
      });
    });
};
exports.update = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!",
      });
    }
    const id = req.params.id;
    if (!req.body.partner_password) {
      Partner.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update Partner with id=${id}. Maybe Partner was not found!`,
              status: false,
            });
          } else
            res.send({
              message: "Partner was updated successfully.",
              status: true,
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating Partner with id=" + id,
            status: false,
          });
        });
    } else {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.partner_password, salt);
      Partner.findByIdAndUpdate(
        id,
        { ...req.body, partner_password: hashPassword },
        { useFindAndModify: false }
      )
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update Partner with id=${id}. Maybe Partner was not found!`,
              status: false,
            });
          } else
            res.send({
              message: "Partner was updated successfully.",
              status: true,
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating Partner with id=" + id,
            status: false,
          });
        });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", status: false });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;
  console.log(id);
  Partner.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      console.log(data);
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Partner with id=${id}. Maybe Partner was not found!`,
          status: false,
        });
      } else {
        res.send({
          message: "Partner was deleted successfully!",
          status: true,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Partner with id=" + id,
        status: false,
      });
    });
};
