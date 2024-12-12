"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonCategory = exports.Vocabulary = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const VocabularySchema = new mongoose_1.Schema({
    word: { type: String, required: true },
    pronunciation: { type: String, required: true },
    meaning: { type: String, required: true },
    whenToSay: { type: String, required: true },
    adminEmail: { type: String, required: true },
    lessonCategory: { type: mongoose_1.Schema.Types.ObjectId, ref: 'LessonCategory', required: true },
});
const LessonCategorySchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    icon: { type: String, required: true },
    createdBy: { type: String, required: false },
    vocabulary: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Vocabulary' }],
});
const Vocabulary = mongoose_1.default.model('Vocabulary', VocabularySchema);
exports.Vocabulary = Vocabulary;
const LessonCategory = mongoose_1.default.model('LessonCategory', LessonCategorySchema);
exports.LessonCategory = LessonCategory;
