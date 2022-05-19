const router = require("express").Router();
// const { User, validate } = require("../models/user");
// const bcrypt = require("bcrypt");

const employee = require("../controllers/employee.controller")

router.post("/", employee.create)
router.get("/", employee.findAll)
router.get("/:id", employee.findOne);
router.delete("/:id", employee.delete);
router.put("/:id", employee.update);
module.exports = router;
