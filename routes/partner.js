const router = require("express").Router();
const partner = require("../controllers/partner.controller");

router.post("/", partner.create);

router.get("/", partner.findAll);
router.get("/:id", partner.findOne);
router.delete("/:id", partner.delete);
router.put("/:id", partner.update);

module.exports = router;