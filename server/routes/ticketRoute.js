const express = require("express");
const {
    createTicket,
    getAllTickets,
    getUserTickets,
    getTicket,
    addMessage,
    updateTicketStatus,
    rateTicket,
    getTicketStats
} = require("../controllers/ticketCtrl");

const router = express.Router();

// Public routes
router.post("/create", createTicket);
router.get("/user/:userId", getUserTickets);
router.get("/single/:ticketId", getTicket);
router.post("/message/:ticketId", addMessage);
router.post("/rate/:ticketId", rateTicket);

// Admin routes
router.get("/admin/all", getAllTickets);
router.put("/admin/status/:ticketId", updateTicketStatus);
router.get("/admin/stats", getTicketStats);

module.exports = router;