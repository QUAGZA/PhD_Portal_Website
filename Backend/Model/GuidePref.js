const mongoose = require("mongoose");

const GuidePrefSchema = new mongoose.Schema(
  {
    email: { 
        type: String,
        required: true
    },
    preference1: { 
        type: String,
        required: true
    },
    researchArea1:{ 
        type: String,
        required: true
    },
    preference2: { 
        type: String,
        required: true
    },
    researchArea2:{ 
        type: String,
        required: true
    },
    preference3: { 
        type: String,
        required: true
    },
    researchArea3:{ 
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  },
  { timestamps: true },
);

module.exports = mongoose.model("GuidePref", GuidePrefSchema);