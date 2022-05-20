const router = require("express").Router();
const advance_money = require("../controllers/advance_money.controller");

router.post("/", advance_money.create)
router.put("/:id", advance_money.update)
router.get("/:id", advance_money.findOne)
router.get("/", advance_money.findAll)
router.delete("/:id", advance_money.delete)


module.exports = router;