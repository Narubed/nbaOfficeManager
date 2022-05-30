const router = require("express").Router();
const partner = require("../controllers/partner.controller");
const event = require("../controllers/partner/event.controller");
const salary = require("../controllers/partner/salary.controller");
const event_report = require("../controllers/partner/event_report.controller");


router.post("/event_report/", event_report.create);
router.get("/event_report/", event_report.findAll);
router.get("/event_report/:id", event_report.findOne);
router.delete("/event_report/:id", event_report.delete);
router.put("/event_report/:id", event_report.update);

router.post("/event/", event.create);
router.get("/event/", event.findAll);
router.get("/event/:id", event.findOne);
router.delete("/event/:id", event.delete);
router.put("/event/:id", event.update);

router.post("/salary/", salary.create);
router.get("/salary/", salary.findAll);
router.get("/salary/:id", salary.findOne);
router.delete("/salary/:id", salary.delete);
router.put("/salary/:id", salary.update);

router.post("/", partner.create);
router.get("/", partner.findAll);
router.get("/:id", partner.findOne);
router.delete("/:id", partner.delete);
router.put("/:id", partner.update);

module.exports = router;
