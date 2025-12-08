/**
 * Joi Validation Schemas
 * Centralized validation schemas for request validation
 */
const Joi = require("joi");

// Custom Joi extensions
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const customJoi = Joi.extend((joi) => ({
  type: "objectId",
  base: joi.string(),
  messages: {
    "objectId.invalid": "{{#label}} must be a valid MongoDB ObjectId",
  },
  validate(value, helpers) {
    if (!objectIdPattern.test(value)) {
      return { value, errors: helpers.error("objectId.invalid") };
    }
  },
}));

// ===== Auth Schemas =====
const authSchemas = {
  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
  }),

  register: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
    roles: Joi.array()
      .items(Joi.string().valid("Student", "Guide", "FacultyCoordinator", "Admin"))
      .default(["Student"]),
  }),
};

// ===== User Schemas =====
const userSchemas = {
  addRole: Joi.object({
    role: Joi.string()
      .valid("Student", "Guide", "FacultyCoordinator", "Admin")
      .required()
      .messages({
        "any.only": "Role must be one of: Student, Guide, FacultyCoordinator, Admin",
        "any.required": "Role is required",
      }),
  }),

  removeRole: Joi.object({
    role: Joi.string()
      .valid("Student", "Guide", "FacultyCoordinator", "Admin")
      .required()
      .messages({
        "any.only": "Role must be one of: Student, Guide, FacultyCoordinator, Admin",
        "any.required": "Role is required",
      }),
  }),

  updatePrimaryRole: Joi.object({
    role: Joi.string()
      .valid("Student", "Guide", "FacultyCoordinator", "Admin")
      .required()
      .messages({
        "any.only": "Role must be one of: Student, Guide, FacultyCoordinator, Admin",
        "any.required": "Role is required",
      }),
  }),
};

// ===== Guide Assignment Schemas =====
const guideAssignmentSchemas = {
  assign: Joi.object({
    studentId: customJoi.objectId().required().messages({
      "any.required": "Student ID is required",
    }),
    guideId: customJoi.objectId().required().messages({
      "any.required": "Guide ID is required",
    }),
  }),

  changeGuide: Joi.object({
    newGuideId: customJoi.objectId().required().messages({
      "any.required": "New Guide ID is required",
    }),
  }),
};

// ===== Registration Schemas =====
const registrationSchemas = {
  personalDetails: Joi.object({
    title: Joi.string().valid("Mr.", "Mrs.", "Ms.", "Dr.", "Prof.").allow(""),
    firstName: Joi.string().max(50).required().messages({
      "any.required": "First name is required",
      "string.max": "First name cannot exceed 50 characters",
    }),
    middleName: Joi.string().max(50).allow(""),
    lastName: Joi.string().max(50).required().messages({
      "any.required": "Last name is required",
    }),
    fatherName: Joi.string().max(100).allow(""),
    motherName: Joi.string().max(100).allow(""),
    gender: Joi.string().valid("Male", "Female", "Other", "").allow(""),
    maritalStatus: Joi.string().valid("Married", "Unmarried", "Divorced", "Widowed").default("Unmarried"),
    aadhar: Joi.string()
      .pattern(/^[0-9]{12}$/)
      .messages({
        "string.pattern.base": "Aadhar must be a 12-digit number",
      })
      .allow(""),
    addressLine1: Joi.string().max(200).allow(""),
    addressLine2: Joi.string().max(200).allow(""),
    district: Joi.string().max(50).allow(""),
    state: Joi.string().max(50).allow(""),
    pinCode: Joi.number().integer().min(100000).max(999999).allow(null),
    permanentAddressLine1: Joi.string().max(200).allow(""),
    permanentAddressLine2: Joi.string().max(200).allow(""),
    permanentDistrict: Joi.string().max(50).allow(""),
    permanentState: Joi.string().max(50).allow(""),
    permanentPinCode: Joi.number().integer().min(100000).max(999999).allow(null),
    contacts: Joi.object({
      mobile: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .messages({
          "string.pattern.base": "Mobile must be a 10-digit number",
        })
        .allow(""),
      alternateMobile: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .allow(""),
      primaryEmail: Joi.string().email().allow(""),
      alternateEmail: Joi.string().email().allow(""),
    }),
  }),

  register: Joi.object({
    personalDetails: Joi.object({
      title: Joi.string().valid("Mr.", "Mrs.", "Ms.", "Dr.", "Prof.").allow(""),
      firstName: Joi.string().max(50).allow(""),
      middleName: Joi.string().max(50).allow(""),
      lastName: Joi.string().max(50).allow(""),
      fatherName: Joi.string().max(100).allow(""),
      motherName: Joi.string().max(100).allow(""),
      gender: Joi.string().valid("Male", "Female", "Other", "").allow(""),
      maritalStatus: Joi.string().valid("Married", "Unmarried", "Divorced", "Widowed").allow(""),
    }).allow(null),
    academicQualifications: Joi.object({
      undergraduate: Joi.array().items(
        Joi.object({
          degree: Joi.string().allow(""),
          institute: Joi.string().allow(""),
          university: Joi.string().allow(""),
          yearOfPassing: Joi.string().allow(""),
        })
      ),
      postgraduate: Joi.array().items(
        Joi.object({
          degree: Joi.string().allow(""),
          institute: Joi.string().allow(""),
          university: Joi.string().allow(""),
          yearOfPassing: Joi.string().allow(""),
        })
      ),
    }).allow(null),
    employmentDetails: Joi.array().items(
      Joi.object({
        designation: Joi.string().allow(""),
        organization: Joi.string().allow(""),
        startDate: Joi.string().allow(""),
        endDate: Joi.string().allow(""),
        duration: Joi.string().allow(""),
      })
    ).allow(null),
    programDetails: Joi.object({
      rollNumber: Joi.string().allow(""),
      department: Joi.string().allow(""),
      institute: Joi.string().allow(""),
      enrollmentYear: Joi.string().allow(""),
      semester: Joi.string().allow(""),
    }),
  }),
};

// ===== Assignment Schemas =====
const assignmentSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
      "any.required": "Assignment title is required",
      "string.min": "Title must be at least 3 characters",
      "string.max": "Title cannot exceed 200 characters",
    }),
    description: Joi.string().max(5000).allow(""),
    deadline: Joi.date().iso().greater("now").required().messages({
      "any.required": "Deadline is required",
      "date.greater": "Deadline must be in the future",
    }),
    department: Joi.string().allow(""),
    assignedTo: Joi.array().items(customJoi.objectId()),
    status: Joi.string().valid("active", "closed", "draft").default("active"),
  }),

  update: Joi.object({
    title: Joi.string().min(3).max(200),
    description: Joi.string().max(5000).allow(""),
    deadline: Joi.date().iso(),
    department: Joi.string().allow(""),
    assignedTo: Joi.array().items(customJoi.objectId()),
    status: Joi.string().valid("active", "closed", "draft"),
  }),
};

// ===== Schedule Schemas =====
const scheduleSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
      "any.required": "Schedule title is required",
    }),
    description: Joi.string().max(2000).required(),
    date: Joi.date().iso().required().messages({
      "any.required": "Date is required",
    }),
    startTime: Joi.string()
      .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        "string.pattern.base": "Start time must be in HH:MM format",
        "any.required": "Start time is required",
      }),
    endTime: Joi.string()
      .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        "string.pattern.base": "End time must be in HH:MM format",
        "any.required": "End time is required",
      }),
    location: Joi.string().max(200).required(),
    type: Joi.string()
      .valid("Meeting", "Defense", "Review", "Committee", "Seminar", "Workshop", "Conference", "Other")
      .required(),
    priority: Joi.string().valid("Low", "Medium", "High", "Critical").default("Medium"),
    attendees: Joi.array().items(
      Joi.object({
        userId: customJoi.objectId(),
        name: Joi.string().required(),
        email: Joi.string().email().allow(""),
        role: Joi.string().valid("Student", "Guide", "FacultyCoordinator", "Admin", "External"),
        isRequired: Joi.boolean().default(false),
      })
    ),
  }),
};

// ===== Announcement Schemas =====
const announcementSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
      "any.required": "Announcement title is required",
    }),
    content: Joi.string().min(10).max(10000).required().messages({
      "any.required": "Announcement content is required",
      "string.min": "Content must be at least 10 characters",
    }),
    type: Joi.string()
      .valid("general", "important", "urgent", "event", "deadline")
      .default("general"),
    targetAudience: Joi.array()
      .items(Joi.string().valid("Student", "Guide", "FacultyCoordinator", "Admin", "All"))
      .default(["All"]),
    department: Joi.string().allow(""),
    priority: Joi.string().valid("low", "medium", "high").default("medium"),
    expiryDate: Joi.date().iso().greater("now").allow(null),
  }),
};

// ===== Guide Preferences Schemas =====
const guidePreferencesSchemas = {
  submit: Joi.object({
    preferences: Joi.object({
      preference1: Joi.object({
        guideId: Joi.string().required(),
        guideName: Joi.string().allow(""),
        researchArea: Joi.string().required().messages({
          "any.required": "Research area for preference 1 is required",
        }),
      }).required(),
      preference2: Joi.object({
        guideId: Joi.string().required(),
        guideName: Joi.string().allow(""),
        researchArea: Joi.string().required().messages({
          "any.required": "Research area for preference 2 is required",
        }),
      }).required(),
      preference3: Joi.object({
        guideId: Joi.string().required(),
        guideName: Joi.string().allow(""),
        researchArea: Joi.string().required().messages({
          "any.required": "Research area for preference 3 is required",
        }),
      }).required(),
    }).required(),
  }),
};

// ===== Pagination Schema =====
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(100).allow(""),
  role: Joi.string().valid("Student", "Guide", "FacultyCoordinator", "Admin", "").allow(""),
  department: Joi.string().max(100).allow(""),
  status: Joi.string().max(50).allow(""),
});

// ===== ID Parameter Schema =====
const idParamSchema = Joi.object({
  id: customJoi.objectId().required(),
});

const studentIdParamSchema = Joi.object({
  studentId: customJoi.objectId().required(),
});

const guideIdParamSchema = Joi.object({
  guideId: customJoi.objectId().required(),
});

module.exports = {
  customJoi,
  authSchemas,
  userSchemas,
  guideAssignmentSchemas,
  registrationSchemas,
  assignmentSchemas,
  scheduleSchemas,
  announcementSchemas,
  guidePreferencesSchemas,
  paginationSchema,
  idParamSchema,
  studentIdParamSchema,
  guideIdParamSchema,
};
