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
exports.updateLessonCategory = exports.deleteLessonCategory = exports.createVocabulary = exports.createLessonCategory = exports.deleteVocabulary = exports.updateVocabulary = exports.getVocabularyByCategory = exports.getLessonCategories = exports.createCategoryWithVocabulary = void 0;
const asyncHandeller_1 = require("../utils/asyncHandeller");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const lesson_model_1 = require("../model/lesson.model");
// Create Category with Vocabulary
const createCategoryWithVocabulary = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, icon, vocab } = req.body;
    if (!title || !icon) {
        throw new ApiError_1.ApiError(400, "Title and icon are required!");
    }
    const existedCategory = yield lesson_model_1.LessonCategory.findOne({ title });
    if (existedCategory) {
        throw new ApiError_1.ApiError(409, "Category already exists! Use a different title.");
    }
    const category = yield lesson_model_1.LessonCategory.create({ title, icon });
    if (vocab && Array.isArray(vocab)) {
        for (const item of vocab) {
            const { word, pronunciation, meaning, whenToSay, lessonNo, adminEmail } = item;
            if (!word || !pronunciation || !meaning || !whenToSay || !lessonNo || !adminEmail) {
                throw new ApiError_1.ApiError(400, "All vocabulary fields are required!");
            }
            const vocabulary = yield lesson_model_1.Vocabulary.create({
                word,
                pronunciation,
                meaning,
                whenToSay,
                lessonNo,
                adminEmail,
                lessonCategory: category._id,
            });
            category.vocabulary.push(vocabulary._id);
        }
        yield category.save();
    }
    const populatedCategory = yield lesson_model_1.LessonCategory.findById(category._id).populate("vocabulary");
    return res.status(201).json(new ApiResponse_1.ApiResponse(201, populatedCategory, "Category and vocabulary created successfully!"));
}));
exports.createCategoryWithVocabulary = createCategoryWithVocabulary;
const createLessonCategory = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, icon, createdBy } = req.body;
    if (!title || !icon) {
        throw new ApiError_1.ApiError(400, "Title and icon are required!");
    }
    // Check if the category already exists
    const existingCategory = yield lesson_model_1.LessonCategory.findOne({ title });
    if (existingCategory) {
        throw new ApiError_1.ApiError(409, "Category already exists! Use a different title.");
    }
    // Create the category
    const category = yield lesson_model_1.LessonCategory.create({ title, icon, createdBy });
    return res.status(201).json(new ApiResponse_1.ApiResponse(201, category, "Category created successfully!"));
}));
exports.createLessonCategory = createLessonCategory;
// Create Vocabulary and Associate with Category
const createVocabulary = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId, word, pronunciation, meaning, whenToSay, adminEmail } = req.body;
    if (!categoryId || !word || !pronunciation || !meaning || !whenToSay || !adminEmail) {
        throw new ApiError_1.ApiError(400, "All fields are required!");
    }
    const category = yield lesson_model_1.LessonCategory.findById(categoryId);
    if (!category) {
        throw new ApiError_1.ApiError(404, "Category not found!");
    }
    const vocabulary = yield lesson_model_1.Vocabulary.create({
        word,
        pronunciation,
        meaning,
        whenToSay,
        adminEmail,
        lessonCategory: category._id,
    });
    category.vocabulary.push(vocabulary._id);
    yield category.save();
    return res.status(201).json(new ApiResponse_1.ApiResponse(201, vocabulary, "Vocabulary created and associated with category successfully!"));
}));
exports.createVocabulary = createVocabulary;
const deleteLessonCategory = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    const category = yield lesson_model_1.LessonCategory.findById(categoryId);
    if (!category) {
        throw new ApiError_1.ApiError(404, "Lesson category not found!");
    }
    yield lesson_model_1.Vocabulary.deleteMany({ lessonCategory: category._id });
    yield category.deleteOne();
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, null, "Lesson category and associated vocabulary deleted successfully!"));
}));
exports.deleteLessonCategory = deleteLessonCategory;
// Fetch All Lesson Categories
const getLessonCategories = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield lesson_model_1.LessonCategory.find()
        .select("-vocabulary")
        .sort({ createdAt: -1 });
    if (!categories.length) {
        throw new ApiError_1.ApiError(404, "No lesson categories found!");
    }
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, categories, "Lesson categories fetched successfully!"));
}));
exports.getLessonCategories = getLessonCategories;
const updateLessonCategory = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    const { title, icon } = req.body;
    // Find the category by ID
    const category = yield lesson_model_1.LessonCategory.findById(categoryId);
    if (!category) {
        throw new ApiError_1.ApiError(404, "Lesson category not found!");
    }
    // Update the category fields
    if (title)
        category.title = title;
    if (icon)
        category.icon = icon;
    // Save the updated category
    const updatedCategory = yield category.save();
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, updatedCategory, "Lesson category updated successfully!"));
}));
exports.updateLessonCategory = updateLessonCategory;
const getVocabularyByCategory = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    const category = yield lesson_model_1.LessonCategory.findById(categoryId).populate("vocabulary");
    if (!category) {
        throw new ApiError_1.ApiError(404, "Category not found!");
    }
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, { vocabulary: category.vocabulary, title: category.title }, "Vocabulary fetched successfully!"));
}));
exports.getVocabularyByCategory = getVocabularyByCategory;
const updateVocabulary = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updates = req.body;
    const vocabulary = yield lesson_model_1.Vocabulary.findById(id);
    if (!vocabulary) {
        throw new ApiError_1.ApiError(404, "Vocabulary not found!");
    }
    Object.assign(vocabulary, updates);
    yield vocabulary.save();
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, vocabulary, "Vocabulary updated successfully!"));
}));
exports.updateVocabulary = updateVocabulary;
// Delete Vocabulary
const deleteVocabulary = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const vocabulary = yield lesson_model_1.Vocabulary.findById(id);
    if (!vocabulary) {
        throw new ApiError_1.ApiError(404, "Vocabulary not found!");
    }
    yield vocabulary.deleteOne();
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, null, "Vocabulary deleted successfully!"));
}));
exports.deleteVocabulary = deleteVocabulary;
