import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandeller";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { LessonCategory, Vocabulary } from "../model/lesson.model";

// Create Category with Vocabulary
const createCategoryWithVocabulary = asyncHandler(async (req: Request, res: Response) => {
    const { title, icon, vocab } = req.body;

    if (!title || !icon) {
        throw new ApiError(400, "Title and icon are required!");
    }

    const existedCategory = await LessonCategory.findOne({ title });
    if (existedCategory) {
        throw new ApiError(409, "Category already exists! Use a different title.");
    }

    const category = await LessonCategory.create({ title, icon });

    if (vocab && Array.isArray(vocab)) {
        for (const item of vocab) {
            const { word, pronunciation, meaning, whenToSay, lessonNo, adminEmail } = item;

            if (!word || !pronunciation || !meaning || !whenToSay || !lessonNo || !adminEmail) {
                throw new ApiError(400, "All vocabulary fields are required!");
            }

            const vocabulary: any = await Vocabulary.create({
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

        await category.save();
    }

    const populatedCategory = await LessonCategory.findById(category._id).populate("vocabulary");
    return res.status(201).json(
        new ApiResponse(201, populatedCategory, "Category and vocabulary created successfully!")
    );
});
const createLessonCategory = asyncHandler(async (req: Request, res: Response) => {
    const { title, icon, createdBy } = req.body;

    if (!title || !icon) {
        throw new ApiError(400, "Title and icon are required!");
    }

    // Check if the category already exists
    const existingCategory = await LessonCategory.findOne({ title });
    if (existingCategory) {
        throw new ApiError(409, "Category already exists! Use a different title.");
    }

    // Create the category
    const category = await LessonCategory.create({ title, icon, createdBy });

    return res.status(201).json(
        new ApiResponse(201, category, "Category created successfully!")
    );
});
// Create Vocabulary and Associate with Category
const createVocabulary = asyncHandler(async (req, res) => {
    const { categoryId, word, pronunciation, meaning, whenToSay, adminEmail } = req.body;

    if (!categoryId || !word || !pronunciation || !meaning || !whenToSay || !adminEmail) {
        throw new ApiError(400, "All fields are required!");
    }
    const category = await LessonCategory.findById(categoryId);
    if (!category) {
        throw new ApiError(404, "Category not found!");
    }
    const vocabulary: any = await Vocabulary.create({
        word,
        pronunciation,
        meaning,
        whenToSay,
        adminEmail,
        lessonCategory: category._id,
    });
    category.vocabulary.push(vocabulary._id);
    await category.save();

    return res.status(201).json(
        new ApiResponse(201, vocabulary, "Vocabulary created and associated with category successfully!")
    );
});
const deleteLessonCategory = asyncHandler(async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    const category = await LessonCategory.findById(categoryId);
    if (!category) {
        throw new ApiError(404, "Lesson category not found!");
    }

    await Vocabulary.deleteMany({ lessonCategory: category._id });

    await category.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, "Lesson category and associated vocabulary deleted successfully!")
    );
});
// Fetch All Lesson Categories
const getLessonCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await LessonCategory.find()
        .select("-vocabulary")
        .sort({ createdAt: -1 })
    if (!categories.length) {
        throw new ApiError(404, "No lesson categories found!");
    }

    return res.status(200).json(
        new ApiResponse(200, categories, "Lesson categories fetched successfully!")
    );
});
const updateLessonCategory = asyncHandler(async (req:Request, res:Response) => {
    const { categoryId } = req.params;
    const { title, icon } = req.body;

    // Find the category by ID
    const category = await LessonCategory.findById(categoryId);
    if (!category) {
        throw new ApiError(404, "Lesson category not found!");
    }

    // Update the category fields
    if (title) category.title = title;
    if (icon) category.icon = icon;

    // Save the updated category
    const updatedCategory = await category.save();

    return res.status(200).json(
        new ApiResponse(200, updatedCategory, "Lesson category updated successfully!")
    );
});
const getVocabularyByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    const category = await LessonCategory.findById(categoryId).populate("vocabulary");
    if (!category) {
        throw new ApiError(404, "Category not found!");
    }

    return res.status(200).json(
        new ApiResponse(200, { vocabulary: category.vocabulary, title: category.title }, "Vocabulary fetched successfully!")
    );
});

const updateVocabulary = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const vocabulary = await Vocabulary.findById(id);
    if (!vocabulary) {
        throw new ApiError(404, "Vocabulary not found!");
    }

    Object.assign(vocabulary, updates);
    await vocabulary.save();

    return res.status(200).json(new ApiResponse(200, vocabulary, "Vocabulary updated successfully!"));
});

// Delete Vocabulary
const deleteVocabulary = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const vocabulary: any = await Vocabulary.findById(id);
    if (!vocabulary) {
        throw new ApiError(404, "Vocabulary not found!");
    }

    await vocabulary.deleteOne();
    return res.status(200).json(new ApiResponse(200, null, "Vocabulary deleted successfully!"));
});

export {
    createCategoryWithVocabulary,
    getLessonCategories,
    getVocabularyByCategory,
    updateVocabulary,
    deleteVocabulary,
    createLessonCategory,
    createVocabulary,
    deleteLessonCategory,
    updateLessonCategory
};
