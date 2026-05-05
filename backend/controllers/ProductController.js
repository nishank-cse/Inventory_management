const asyncHandler = require("../utils/AsyncHandler");
const Product = require("../models/ProductModel");
const StockHistory = require("../models/StockHistoryModel");

// ================= CREATE PRODUCT =================
// Admin only
const createProduct = asyncHandler(async (req, res) => {

    if (req.user.role !== "admin") {
        res.status(403);
        throw new Error("Admin only");
    }

    const { name, sku, category, price, quantity, minStock, description, supplier } = req.body;

    const productExists = await Product.findOne({
        name,
        staff: req.user.staffId
    });

    if (productExists) {
        res.status(400);
        throw new Error("Product already exists");
    }

    const product = await Product.create({
        staff: req.user.staffId,
        name,
        sku,
        category,
        price,
        quantity,
        minStock,
        description,
        supplier,
    });

    if (quantity > 0) {
        await StockHistory.create({
            staff: req.user.staffId,
            productId: product._id,
            type: "IN",
            quantity,
            reason: "Initial Stock",
        });
    }

    res.status(201).json(product);
});


// ================= GET ALL PRODUCTS =================
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({
        staff: req.user.staffId
    }).sort("-createdAt");

    res.status(200).json(products);
});


// ================= GET SINGLE PRODUCT =================
const getProductById = asyncHandler(async (req, res) => {

    const product = await Product.findOne({
        _id: req.params.id,
        staff: req.user.staffId
    });

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    res.status(200).json(product);
});


// ================= UPDATE PRODUCT =================
// Admin only
const updateProduct = asyncHandler(async (req, res) => {

    if (req.user.role !== "admin") {
        res.status(403);
        throw new Error("Admin only");
    }

    const { name, sku, category, price, quantity, minStock, description, supplier } = req.body;

    const product = await Product.findOne({
        _id: req.params.id,
        staff: req.user.staffId
    });

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    // Check duplicate name
    if (name && name !== product.name) {
        const exists = await Product.findOne({
            name,
            staff: req.user.staffId
        });

        if (exists) {
            res.status(400);
            throw new Error("Product name already exists");
        }
    }

    // Update fields
    product.name = name || product.name;
    product.sku = sku ?? product.sku;
    product.category = category || product.category;
    product.price = price ?? product.price;
    product.minStock = minStock ?? product.minStock;
    product.description = description || product.description;
    product.supplier = supplier || product.supplier;

    // Handle quantity change
    if (quantity !== undefined) {
        const diff = quantity - product.quantity;

        if (diff !== 0) {
            await StockHistory.create({
                staff: req.user.staffId,
                productId: product._id,
                type: diff > 0 ? "IN" : "OUT",
                quantity: Math.abs(diff),
                reason: "Manual Adjustment",
            });

            product.quantity = quantity;
        }
    }

    const updated = await product.save();
    res.status(200).json(updated);
});


// ================= DELETE PRODUCT =================
// Admin only
const deleteProduct = asyncHandler(async (req, res) => {

    if (req.user.role !== "admin") {
        res.status(403);
        throw new Error("Admin only");
    }

    const product = await Product.findOne({
        _id: req.params.id,
        staff: req.user.staffId
    });

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    await product.deleteOne();

    await StockHistory.deleteMany({
        productId: req.params.id,
        staff: req.user.staffId
    });

    res.status(200).json({ message: "Deleted successfully" });
});


// ================= STOCK IN =================
const stockIn = asyncHandler(async (req, res) => {

    const { productId, quantity, reason } = req.body;

    if (!quantity || quantity <= 0) {
        res.status(400);
        throw new Error("Invalid quantity");
    }

    const product = await Product.findOne({
        _id: productId,
        staff: req.user.staffId
    });

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    product.quantity += Number(quantity);
    await product.save();

    await StockHistory.create({
        staff: req.user.staffId,
        productId,
        type: "IN",
        quantity,
        reason,
    });

    res.status(200).json({
        message: "Stock In successful",
        currentQuantity: product.quantity
    });
});


// ================= STOCK OUT =================
const stockOut = asyncHandler(async (req, res) => {

    const { productId, quantity, reason } = req.body;

    if (!quantity || quantity <= 0) {
        res.status(400);
        throw new Error("Invalid quantity");
    }

    const product = await Product.findOne({
        _id: productId,
        staff: req.user.staffId
    });

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    if (product.quantity < quantity) {
        res.status(400);
        throw new Error("Insufficient stock");
    }

    product.quantity -= Number(quantity);
    await product.save();

    await StockHistory.create({
        staff: req.user.staffId,
        productId,
        type: "OUT",
        quantity,
        reason,
    });

    res.status(200).json({
        message: "Stock Out successful",
        currentQuantity: product.quantity
    });
});


// ================= STOCK HISTORY =================
const getStockHistory = asyncHandler(async (req, res) => {

    const history = await StockHistory.find({
        staff: req.user.staffId
    })
    .populate("productId", "name")
    .sort("-createdAt");

    const formatted = history.map(item => ({
        ...item.toObject(),
        product: item.productId
    }));

    res.status(200).json(formatted);
});


// ================= LOW STOCK =================
const getLowStockProducts = asyncHandler(async (req, res) => {

    const products = await Product.find({
        staff: req.user.staffId,
        $or: [
            { $expr: { $lte: ["$quantity", "$minStock"] } },
            { quantity: { $lte: 10 } }
        ]
    }).sort("quantity");

    res.status(200).json(products);
});


// ================= EXPORT =================
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    stockIn,
    stockOut,
    getStockHistory,
    getLowStockProducts
};