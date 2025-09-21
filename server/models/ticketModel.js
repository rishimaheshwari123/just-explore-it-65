const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        // Ticket Information
        ticketId: {
            type: String,
            unique: true,
        },
        
        title: {
            type: String,
            required: true,
            trim: true,
        },
        
        description: {
            type: String,
            required: true,
        },
        
        category: {
            type: String,
            enum: [
                'technical',
                'billing',
                'account',
                'business_listing',
                'feature_request',
                'bug_report',
                'general'
            ],
            required: true,
        },
        
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
        },
        
        status: {
            type: String,
            enum: ['open', 'in_progress', 'resolved', 'closed'],
            default: 'open',
        },
        
        // User Information
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'userModel',
        },
        
        userModel: {
            type: String,
            required: true,
            enum: ['User', 'Vendor', 'Auth'],
        },
        
        userEmail: {
            type: String,
            required: true,
        },
        
        userName: {
            type: String,
            required: true,
        },
        
        // Admin Assignment
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auth',
        },
        
        // Attachments
        attachments: [{
            fileName: String,
            fileUrl: String,
            fileType: String,
            uploadedAt: {
                type: Date,
                default: Date.now,
            },
        }],
        
        // Conversation/Messages
        messages: [{
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                refPath: 'messages.senderModel',
            },
            senderModel: {
                type: String,
                required: true,
                enum: ['User', 'Vendor', 'Auth'],
            },
            senderName: {
                type: String,
                required: true,
            },
            message: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
            attachments: [{
                fileName: String,
                fileUrl: String,
                fileType: String,
            }],
        }],
        
        // Timestamps
        resolvedAt: Date,
        closedAt: Date,
        
        // Analytics
        responseTime: Number, // in minutes
        resolutionTime: Number, // in minutes
        
        // Tags
        tags: [String],
        
        // Internal Notes (Admin only)
        internalNotes: [{
            note: String,
            addedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Auth',
            },
            addedAt: {
                type: Date,
                default: Date.now,
            },
        }],
        
        // Rating (after resolution)
        rating: {
            score: {
                type: Number,
                min: 1,
                max: 5,
            },
            feedback: String,
            ratedAt: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Generate unique ticket ID
ticketSchema.pre('save', async function(next) {
    if (!this.ticketId) {
        try {
            const count = await this.constructor.countDocuments();
            this.ticketId = `TKT-${String(count + 1).padStart(6, '0')}`;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Indexes for better performance
ticketSchema.index({ userId: 1, status: 1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
ticketSchema.index({ category: 1, priority: 1 });
ticketSchema.index({ ticketId: 1 });

module.exports = mongoose.model("Ticket", ticketSchema);