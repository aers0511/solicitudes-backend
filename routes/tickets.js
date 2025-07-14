const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const auth = require("../middlewares/authMiddleware");
const ticketController = require("../controllers/ticketController");

router.get("/", auth, ticketController.getTickets);
router.post("/", auth, upload.single("archivo"), ticketController.createTicket);
router.put("/:id", auth, ticketController.updateTicket);
router.get("/export/month", auth, ticketController.exportCurrentMonth);

module.exports = router;
