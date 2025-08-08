const User = require('../Model/User');
const AcademicQualification = require('../Model/AcademicQualifications.js');
const EmploymentRecord = require('../Model/EmploymentRecords.js');
const mongoose = require('mongoose');


async function registerUser(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { personalDetails, academicQualifications, employmentDetails } = req.body;

        if (!personalDetails?.email || !personalDetails?.firstName || !personalDetails?.lastName) {
            return res.status(400).json({ message: "Personal details are incomplete." });
        }

        if (!Array.isArray(academicQualifications) || academicQualifications.length === 0) {
            return res.status(400).json({ message: "At least one academic qualification is required." });
        }

        if (!Array.isArray(employmentDetails) || employmentDetails.length === 0) {
            return res.status(400).json({ message: "At least one employment record is required." });
        }

        const personal = await User.create([personalDetails], { session });

        const email = personalDetails.email;

        const academicWithEmail = academicQualifications.map(q => ({ ...q, email }));
        const employmentWithEmail = employmentDetails.map(e => ({ ...e, email }));

        const academic = await AcademicQualification.insertMany(academicWithEmail, { session });
        const employment = await EmploymentRecord.insertMany(employmentWithEmail, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ personal: personal[0], academic, employment });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        console.error('Error during user registration:', err);
        res.status(500).json({ error: err.message || "Internal server error" });
    }
}

module.exports = { registerUser };