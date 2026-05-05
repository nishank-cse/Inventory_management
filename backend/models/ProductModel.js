const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: [true, "Please add a product name"],
        trim: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    minStock: {
        type: Number,
        default: 0,
    }
},
{ timestamps: true }
);

// unique per staff
productSchema.index({ staff: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);