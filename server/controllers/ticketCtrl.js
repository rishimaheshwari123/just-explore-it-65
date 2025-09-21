const Ticket = require("../models/ticketModel");
const User = require("../models/userModel");
const Vendor = require("../models/vendorModel");
const Admin = require("../models/authModel");

// Create new ticket
const createTicket = async (req, res) => {
    try {
        const { title, description, category, priority, attachments } = req.body;
        const { userId, userModel, userEmail, userName } = req.body;

        // Validate required fields
        if (!title || !description || !category || !userId || !userModel) {
            return res.status(400).json({
                success: false,
                message: "Title, description, category, userId, and userModel are required"
            });
        }

        // Create ticket
        const ticket = new Ticket({
            title,
            description,
            category,
            priority: priority || 'medium',
            userId,
            userModel,
            userEmail,
            userName,
            attachments: attachments || [],
            messages: [{
                sender: userId,
                senderModel: userModel,
                senderName: userName,
                message: description,
            }]
        });

        await ticket.save();

        res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            ticket
        });
    } catch (error) {
        console.error("Create ticket error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get all tickets (Admin only)
const getAllTickets = async (req, res) => {
    try {
        const { status, category, priority, page = 1, limit = 10 } = req.query;
        
        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;

        const tickets = await Ticket.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('assignedTo', 'name email');

        const total = await Ticket.countDocuments(filter);

        res.status(200).json({
            success: true,
            tickets,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error("Get all tickets error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get user tickets
const getUserTickets = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, page = 1, limit = 10 } = req.query;

        const filter = { userId };
        if (status) filter.status = status;

        const tickets = await Ticket.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('assignedTo', 'name email');

        const total = await Ticket.countDocuments(filter);

        res.status(200).json({
            success: true,
            tickets,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error("Get user tickets error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get single ticket
const getTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Ticket.findById(ticketId)
            .populate('assignedTo', 'name email')
            .populate('messages.sender', 'name email');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        res.status(200).json({
            success: true,
            ticket
        });
    } catch (error) {
        console.error("Get ticket error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Add message to ticket
const addMessage = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { message, senderId, senderModel, senderName, attachments } = req.body;

        if (!message || !senderId || !senderModel || !senderName) {
            return res.status(400).json({
                success: false,
                message: "Message, senderId, senderModel, and senderName are required"
            });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        ticket.messages.push({
            sender: senderId,
            senderModel,
            senderName,
            message,
            attachments: attachments || []
        });

        // Update status if it was closed
        if (ticket.status === 'closed') {
            ticket.status = 'open';
        }

        await ticket.save();

        res.status(200).json({
            success: true,
            message: "Message added successfully",
            ticket
        });
    } catch (error) {
        console.error("Add message error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update ticket status (Admin only)
const updateTicketStatus = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status, assignedTo, internalNote } = req.body;

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        if (status) {
            ticket.status = status;
            
            if (status === 'resolved') {
                ticket.resolvedAt = new Date();
            } else if (status === 'closed') {
                ticket.closedAt = new Date();
            }
        }

        if (assignedTo) {
            ticket.assignedTo = assignedTo;
        }

        if (internalNote) {
            ticket.internalNotes.push({
                note: internalNote,
                addedBy: req.body.adminId // Assuming admin ID is passed
            });
        }

        await ticket.save();

        res.status(200).json({
            success: true,
            message: "Ticket updated successfully",
            ticket
        });
    } catch (error) {
        console.error("Update ticket status error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Rate ticket (User only, after resolution)
const rateTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { score, feedback } = req.body;

        if (!score || score < 1 || score > 5) {
            return res.status(400).json({
                success: false,
                message: "Score must be between 1 and 5"
            });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        if (ticket.status !== 'resolved' && ticket.status !== 'closed') {
            return res.status(400).json({
                success: false,
                message: "Can only rate resolved or closed tickets"
            });
        }

        ticket.rating = {
            score,
            feedback: feedback || '',
            ratedAt: new Date()
        };

        await ticket.save();

        res.status(200).json({
            success: true,
            message: "Ticket rated successfully",
            ticket
        });
    } catch (error) {
        console.error("Rate ticket error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get ticket statistics (Admin only)
const getTicketStats = async (req, res) => {
    try {
        const totalTickets = await Ticket.countDocuments();
        const openTickets = await Ticket.countDocuments({ status: 'open' });
        const inProgressTickets = await Ticket.countDocuments({ status: 'in_progress' });
        const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });
        const closedTickets = await Ticket.countDocuments({ status: 'closed' });

        const categoryStats = await Ticket.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        const priorityStats = await Ticket.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        const avgRating = await Ticket.aggregate([
            { $match: { 'rating.score': { $exists: true } } },
            { $group: { _id: null, avgRating: { $avg: '$rating.score' } } }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                total: totalTickets,
                open: openTickets,
                inProgress: inProgressTickets,
                resolved: resolvedTickets,
                closed: closedTickets,
                categoryBreakdown: categoryStats,
                priorityBreakdown: priorityStats,
                averageRating: avgRating[0]?.avgRating || 0
            }
        });
    } catch (error) {
        console.error("Get ticket stats error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createTicket,
    getAllTickets,
    getUserTickets,
    getTicket,
    addMessage,
    updateTicketStatus,
    rateTicket,
    getTicketStats
};