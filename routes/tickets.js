const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const ticketController = require("../controllers/ticketController");

router.get("/", auth, ticketController.getTickets);
router.post("/", auth, ticketController.createTicket);
router.put("/:id", auth, ticketController.updateTicket);

module.exports = router;