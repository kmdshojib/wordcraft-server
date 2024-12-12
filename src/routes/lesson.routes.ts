import { Router } from "express";
import {
    createCategoryWithVocabulary,
    createLessonCategory,
    createVocabulary,
    deleteLessonCategory,
    deleteVocabulary,
    getLessonCategories,
    getVocabularyByCategory,
    updateLessonCategory,
    updateVocabulary
} from "../controllers/lesson.controller";

const router = Router();

router.post("/createLesson", createCategoryWithVocabulary)
router.post("/createCategory", createLessonCategory)
router.put("/updateCategory/:categoryId", updateLessonCategory)
router.delete("/deleteCategory/:categoryId", deleteLessonCategory)

router.post("/createVocab", createVocabulary)
router.put("/updateVocab/:id", updateVocabulary)
router.delete("/deleteVocab/:id", deleteVocabulary)

router.get("/getCategories", getLessonCategories)
router.get("/getVocab/:categoryId", getVocabularyByCategory)

export default router