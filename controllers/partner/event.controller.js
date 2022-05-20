const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Event, validate } = require("../../models/partner/event.model");

exports.create = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .send({ message: error.details[0].message, status: false });
    await new Event({ ...req.body }).save();
    res.status(201).send({ message: "สร้างรายงานสำเร็จ", status: true });
  } catch (error) {
    res.status(500).send({ message: "มีบ่างอย่างผิดพลาด", status: false });
  }
};

exports.update = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "การส่งข้อมูลไม่ถูกต้อง",
      });
    }
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .send({ message: error.details[0].message, status: false });

    const id = req.params.id;
    Event.findByIdAndUpdate(
      id,
      { ...req.body },
      { useFindAndModify: false }
    )
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `ไม่สามารถเเก้ไขรายงานนี้ได้`,
            status: false,
          });
        } else
          res.send({
            message: "แก้ไขรายงานสำเร็จ",
            status: true,
          });
      })
      .catch((err) => {
        res.status(500).send({
          message: "ไม่สามารถเเก้ไขรายงานนี้ได้",
          status: false,
        });
      });
  } catch (error) {
    res.status(500).send({ message: "มีบ่างอย่างผิดพลาด", status: false });
  }
};

exports.findAll = async (req, res) => {
    try {
        Event.find()
        .then(async (data) => {
          res.send({ data, message: "success", status: true });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "มีบางอย่างผิดพลาด",
          });
        });
    } catch (error) {
      res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
    }
  };
  exports.findOne = (req, res) => {
    const id = req.params.id;
    Event.findById(id)
      .then((data) => {
        if (!data)
          res
            .status(404)
            .send({ message: "ไม่สามารถหารายงานนี้ได้", status: false });
        else res.send({ data, status: true });
      })
      .catch((err) => {
        res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      });
  };
  exports.delete = (req, res) => {
    const id = req.params.id;
  
    Event.findByIdAndRemove(id, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `ไม่สามารถลบรายงานนี้ได้`,
            status: true,
          });
        } else {
          res.send({
            message: "ลบรายงานสำเร็จ",
            status: false,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "ไม่สามารถลบรายงานนี้ได้",
          status: false,
        });
      });
  };