const Announcement = require("../Model/Announcement");
const User = require("../Model/User");

/**
 * Create a new announcement
 * @route POST /api/announcements/create
 */
async function createAnnouncement(req, res) {
  try {
    const {
      title,
      content,
      type,
      targetAudience,
      department,
      priority,
      expiryDate,
    } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Handle file attachments
    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachments.push({
          filename: file.originalname,
          path: file.filename,
          mimetype: file.mimetype,
          size: file.size,
        });
      });
    }

    // Create announcement
    const announcement = await Announcement.create({
      title,
      content,
      type: type || "general",
      targetAudience: targetAudience || ["All"],
      department: department || null,
      priority: priority || "medium",
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      attachments,
      createdBy: req.user._id,
      isActive: true,
    });

    await announcement.populate("createdBy", "personalDetails email");

    res.status(201).json({
      success: true,
      data: announcement,
      message: "Announcement created successfully",
    });
  } catch (err) {
    console.error("Error creating announcement:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get all announcements for the logged-in user
 * @route GET /api/announcements/my-announcements
 */
async function getMyAnnouncements(req, res) {
  try {
    const user = await User.findById(req.user._id).select("roles programDetails");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userRole = user.roles[0]; // Primary role
    const userDepartment = user.programDetails?.department;

    // Build query
    const query = {
      isActive: true,
      $or: [
        { targetAudience: "All" },
        { targetAudience: userRole },
      ],
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } },
      ],
    };

    // Add department filter if user has a department
    if (userDepartment) {
      query.$or.push({ department: userDepartment });
    }

    const announcements = await Announcement.find(query)
      .populate("createdBy", "personalDetails email")
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    // Mark which announcements the user has viewed
    const announcementsWithViewStatus = announcements.map((announcement) => ({
      ...announcement,
      hasViewed: announcement.viewedBy?.some(
        (v) => v.user.toString() === req.user._id.toString()
      ),
    }));

    res.json({ success: true, data: announcementsWithViewStatus });
  } catch (err) {
    console.error("Error fetching announcements:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get all announcements (for admins/faculty coordinators)
 * @route GET /api/announcements/all
 */
async function getAllAnnouncements(req, res) {
  try {
    const { page = 1, limit = 20, type, department, isActive } = req.query;

    const query = {};
    if (type) query.type = type;
    if (department) query.department = department;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const announcements = await Announcement.find(query)
      .populate("createdBy", "personalDetails email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Announcement.countDocuments(query);

    res.json({
      success: true,
      data: announcements,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching all announcements:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get a specific announcement by ID
 * @route GET /api/announcements/:id
 */
async function getAnnouncementById(req, res) {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id)
      .populate("createdBy", "personalDetails email")
      .populate("viewedBy.user", "personalDetails email");

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.json({ success: true, data: announcement });
  } catch (err) {
    console.error("Error fetching announcement:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Update an announcement
 * @route PUT /api/announcements/:id
 */
async function updateAnnouncement(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      type,
      targetAudience,
      department,
      priority,
      expiryDate,
      isActive,
    } = req.body;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // Only creator or admin can update
    if (
      announcement.createdBy.toString() !== req.user._id.toString() &&
      !req.user.roles.includes("Admin")
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this announcement",
      });
    }

    // Update fields
    if (title) announcement.title = title;
    if (content) announcement.content = content;
    if (type) announcement.type = type;
    if (targetAudience) announcement.targetAudience = targetAudience;
    if (department) announcement.department = department;
    if (priority) announcement.priority = priority;
    if (expiryDate) announcement.expiryDate = new Date(expiryDate);
    if (isActive !== undefined) announcement.isActive = isActive;

    // Handle new file attachments
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        announcement.attachments.push({
          filename: file.originalname,
          path: file.filename,
          mimetype: file.mimetype,
          size: file.size,
        });
      });
    }

    await announcement.save();

    await announcement.populate("createdBy", "personalDetails email");

    res.json({
      success: true,
      data: announcement,
      message: "Announcement updated successfully",
    });
  } catch (err) {
    console.error("Error updating announcement:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Delete an announcement
 * @route DELETE /api/announcements/:id
 */
async function deleteAnnouncement(req, res) {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // Only creator or admin can delete
    if (
      announcement.createdBy.toString() !== req.user._id.toString() &&
      !req.user.roles.includes("Admin")
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this announcement",
      });
    }

    await Announcement.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting announcement:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Mark announcement as viewed
 * @route POST /api/announcements/:id/view
 */
async function markAnnouncementAsViewed(req, res) {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // Check if user has already viewed
    const alreadyViewed = announcement.viewedBy.some(
      (v) => v.user.toString() === req.user._id.toString()
    );

    if (!alreadyViewed) {
      announcement.viewedBy.push({
        user: req.user._id,
        viewedAt: new Date(),
      });
      await announcement.save();
    }

    res.json({
      success: true,
      message: "Announcement marked as viewed",
    });
  } catch (err) {
    console.error("Error marking announcement as viewed:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Toggle announcement active status
 * @route PUT /api/announcements/:id/toggle-active
 */
async function toggleAnnouncementStatus(req, res) {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // Only creator or admin can toggle status
    if (
      announcement.createdBy.toString() !== req.user._id.toString() &&
      !req.user.roles.includes("Admin")
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to modify this announcement",
      });
    }

    announcement.isActive = !announcement.isActive;
    await announcement.save();

    res.json({
      success: true,
      data: announcement,
      message: `Announcement ${announcement.isActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (err) {
    console.error("Error toggling announcement status:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  createAnnouncement,
  getMyAnnouncements,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  markAnnouncementAsViewed,
  toggleAnnouncementStatus,
};
