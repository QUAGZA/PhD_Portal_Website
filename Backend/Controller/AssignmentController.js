const Assignment = require('../Model/Assignment');
const Submission = require('../Model/Submission');
const User = require('../Model/User');

async function createAssignment (req, res) {
    try {
        const { title, description, deadline, attachments } = req.body;

        const assignment = await Assignment.create({
            title,
            description,
            deadline,
            attachments,
            createdBy: req.user._id
        });

        return res.status(201).json({ success: true, data: assignment });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}


async function getAllAssignmentsByTheGuide(req, res) {
    try {
        const student = await User.findById(req.user._id).populate('programDetails.guide');

        if (!student || !student.programDetails?.guide) {
            return res.status(404).json({ success: false, message: 'Guide not assigned' });
        }

        const assignments = await Assignment.find({ createdBy: student.programDetails.guide._id })
            .populate('createdBy', 'name email');

        return res.json({ success: true, data: assignments });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

//for guide
async function getAssignedAssignmentsBySelf(req, res) {
    try {
        const user = await User.findById(req.user._id);
        const assignments = await Assignment.find({ createdBy:  user._id })
            .populate('createdBy', 'name email');

        return res.json({ success: true, data: assignments });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function getAssignmentById (req, res){
    try {
        const assignment = await Assignment.findById(req.params.id).populate('createdBy', 'name email');
        if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });

        res.json({ success: true, data: assignment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}


async function submitAssignment (req, res){
    try {
        const { assignmentId, attachments } = req.body;

        const existing = await Submission.findOne({ assignment: assignmentId, student: req.user._id });
        if (existing) return res.status(400).json({ success: false, message: 'Already submitted' });

        const submission = await Submission.create({
            assignment: assignmentId,
            student: req.user._id,
            status: 'submitted',
            attachments,
            submittedAt: new Date()
        });

        res.status(201).json({ success: true, data: submission });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function gradeSubmission (req, res){
    try {
        const { submissionId, grade, comments } = req.body;

        const submission = await Submission.findByIdAndUpdate(
            submissionId,
            { grade, comments, status: 'graded' },
            { new: true }
        );

        if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

        res.json({ success: true, data: submission });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getSubmissionsForAssignment(req, res) {
    try {
        const submissions = await Submission.find({ assignment: req.params.assignmentId })
            .populate('student', 'name email');

        res.json({ success: true, data: submissions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getListOfNonSubmissions(req, res) {
    try {
        const { assignmentId } = req.params;

        const user = await User.findById(req.user._id);

        const allStudents = await User.find({
            role: 'Student',
            'programDetails.guide': req.user._id
        }).select('_id profile.name profile.email');

        const submitted = await Submission.find({ assignment: assignmentId }).select('student');

        const submittedIds = submitted.map(s => s.student.toString());

        const nonSubmitted = allStudents.filter(s => !submittedIds.includes(s._id.toString()));

        res.json({ success: true, data: nonSubmitted });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    getSubmissionsForAssignment,
    getAllAssignmentsByTheGuide,
    createAssignment,
    gradeSubmission,
    submitAssignment,
    getAssignmentById,
    getAssignedAssignmentsBySelf,
    getListOfNonSubmissions
}