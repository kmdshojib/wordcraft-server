import { Router } from "express";
import { createCategoryWithVocabulary, getLessonCategories,getVocabularyByCategory } from "../controllers/lesson.controller";
const router = Router();

router.post("/createLesson", createCategoryWithVocabulary)
router.get("/getCategories", getLessonCategories)
router.get("/getVocab/:categoryId", getVocabularyByCategory)
export default router