const router = require("express").Router();
const leavework = require("../controllers/leavework.controller");

router.post("/", leavework.create)
router.put("/:id", leavework.update)
router.get("/:id", leavework.findOne)
router.get("/", leavework.findAll)
router.delete("/:id", leavework.delete)


module.exports = router;