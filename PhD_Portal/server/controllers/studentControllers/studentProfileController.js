import { Student, PersonalDetails, AcademicQualification } from "../../models/index.js";

export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userId: req.user.id },
      include: [PersonalDetails, AcademicQualification],
    });
  
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    return res.json(student);
  } catch (err) {
    console.error("Error fetching student profile:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
