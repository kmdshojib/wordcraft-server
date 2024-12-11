import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandeller";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { LessonCategory } from "../model/lesson.model";
import { Vocabulary } from "../model/lesson.model";

// Create Category and Add Vocabulary
const createCategoryWithVocabulary = asyncHandler(async (req: Request, res: Response) => {
    const { title, icon, vocab } = req.body;

    // Validate required fields for the category
    if (!title || !icon) {
        throw new ApiError(400, "Title and icon are required!");
    }

    // Check if the category already exists
    const existedCategory = await LessonCategory.findOne({ title });
    if (existedCategory) {
        throw new ApiError(409, "Category already exists! Use a different title.");
    }

    // Create the category
    const category = await LessonCategory.create({ title, icon });

    // Validate and create vocabulary if provided
    if (vocab && Array.isArray(vocab)) {
        for (const item of vocab) {
            const { word, pronunciation, meaning, whenToSay } = item;

            // Validate vocabulary fields
            if (!word || !pronunciation || !meaning || !whenToSay) {
                throw new ApiError(400, "All vocabulary fields are required!");
            }

            // Create the vocabulary
            const vocabulary:any = await Vocabulary.create({
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
        await category.save();
    }

    // Respond with the created category and its vocabulary
    const populatedCategory = await LessonCategory.findById(category._id).populate("vocabulary");
    return res.status(201).json(
        new ApiResponse(201, populatedCategory, "Category and vocabulary created successfully!")
    );
});


// Fetch All Lesson Categories
const getLessonCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await LessonCategory.find().select("-vocabulary")
    if (!categories.length) {
        throw new ApiError(404, "No lesson categories found!");
    }

    return res.status(200).json(
        new ApiResponse(200, categories, "Lesson categories fetched successfully!")
    );
});

// Fetch Vocabulary by Category
const getVocabularyByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    // Check if the category exists
    const category = await LessonCategory.findById(categoryId).populate("vocabulary");
    if (!category) {
        throw new ApiError(404, "Category not found!");
    }

    return res.status(200).json(
        new ApiResponse(200, category.vocabulary, "Vocabulary fetched successfully!")
    );
});

export { createCategoryWithVocabulary, getLessonCategories, getVocabularyByCategory };