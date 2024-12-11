"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lesson_controller_1 = require("../controllers/lesson.controller");
const router = (0, express_1.Router)();
router.post("/createLesson", lesson_controller_1.createCategoryWithVocabulary);
router.get("/getCategories", lesson_controller_1.getLessonCategories);
router.get("/getVocab/:categoryId", lesson_controller_1.getVocabularyByCategory);
exports.default = router;
