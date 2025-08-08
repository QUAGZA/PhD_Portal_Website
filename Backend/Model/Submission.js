const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['submitted', 'pending', 'graded'], default: 'pending' },
    grade: { type: Number },
    comments: { type: String },
    attachments: [
        {
            filename: String,
            path: String,
            mimetype: String,
            size: Number
        }
    ],
    submittedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);