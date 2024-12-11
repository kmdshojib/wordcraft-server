import mongoose, { Schema, Document, Model } from 'mongoose';

interface IVocabulary extends Document {
    word: string;
    pronunciation: string;
    meaning: string;
    whenToSay: string;
    category: mongoose.Schema.Types.ObjectId;
}

const VocabularySchema: Schema<IVocabulary> = new Schema({
    word: { type: String, required: true },
    pronunciation: { type: String, required: true },
    meaning: { type: String, required: true },
    whenToSay: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'LessonCategory', required: true },
});

// LessonCategory Interface and Schema
interface ILessonCategory extends Document {
    title: string;
    icon: string;
    vocabulary: mongoose.Schema.Types.ObjectId[];
}

const LessonCategorySchema: Schema<ILessonCategory> = new Schema({
    title: { type: String, required: true },
    icon: { type: String, required: true },
    vocabulary: [{ type: Schema.Types.ObjectId, ref: 'Vocabulary' }],
});

const Vocabulary: Model<IVocabulary> = mongoose.model<IVocabulary>('Vocabulary', VocabularySchema);
const LessonCategory: Model<ILessonCategory> = mongoose.model<ILessonCategory>('LessonCategory', LessonCategorySchema);

export { Vocabulary, LessonCategory, IVocabulary, ILessonCategory };
