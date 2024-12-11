"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVocabularyByCategory = exports.getLessonCategories = exports.createCategoryWithVocabulary = void 0;
const asyncHandeller_1 = require("../utils/asyncHandeller");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const lesson_model_1 = require("../model/lesson.model");
const lesson_model_2 = require("../model/lesson.model");
// Create Category and Add Vocabulary
const createCategoryWithVocabulary = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, icon, vocab } = req.body;
    // Validate required fields for the category
    if (!title || !icon) {
        throw new ApiError_1.ApiError(400, "Title and icon are required!");
    }
    // Check if the category already exists
    const existedCategory = yield lesson_model_1.LessonCategory.findOne({ title });
    if (existedCategory) {
        throw new ApiError_1.ApiError(409, "Category already exists! Use a different title.");
    }
    // Create the category
    const category = yield lesson_model_1.LessonCategory.create({ title, icon });
    // Validate and create vocabulary if provided
    if (vocab && Array.isArray(vocab)) {
        for (const item of vocab) {
            const { word, pronunciation, meaning, whenToSay } = item;
            // Validate vocabulary fields
            if (!word || !pronunciation || !meaning || !whenToSay) {
                throw new ApiError_1.ApiError(400, "All vocabulary fields are required!");
            }
            // Create the vocabulary
            const vocabulary = yield lesson_model_2.Vocabulary.create({
                word,
                pronunciation,
                meaning,
                whenToSay,
                category: category._id,
            });
            // Add vocabulary reference to the category
            category.vocabulary.push(vocabulary._id);
        }
        // Save the updated category
        yield category.save();
    }
    // Respond with the created category and its vocabulary
    const populatedCategory = yield lesson_model_1.LessonCategory.findById(category._id).populate("vocabulary");
    return res.status(201).json(new ApiResponse_1.ApiResponse(201, populatedCategory, "Category and vocabulary created successfully!"));
}));
exports.createCategoryWithVocabulary = createCategoryWithVocabulary;
// Fetch All Lesson Categories
const getLessonCategories = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield lesson_model_1.LessonCategory.find().select("-vocabulary");
    if (!categories.length) {
        throw new ApiError_1.ApiError(404, "No lesson categories found!");
    }
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, categories, "Lesson categories fetched successfully!"));
}));
exports.getLessonCategories = getLessonCategories;
// Fetch Vocabulary by Category
const getVocabularyByCategory = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    // Check if the category exists
    const category = yield lesson_model_1.LessonCategory.findById(categoryId).populate("vocabulary");
    if (!category) {
        throw new ApiError_1.ApiError(404, "Category not found!");
    }
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, category.vocabulary, "Vocabulary fetched successfully!"));
}));
exports.getVocabularyByCategory = getVocabularyByCategory;
