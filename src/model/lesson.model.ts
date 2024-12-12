import mongoose, { Schema, Document, Model } from 'mongoose';

interface IVocabulary extends Document {
    word: string;
    pronunciation: string;
    meaning: string;
    whenToSay: string;
    adminEmail: string;
    lessonCategory: mongoose.Schema.Types.ObjectId;
}

const VocabularySchema: Schema<IVocabulary> = new Schema({
    word: { type: String, required: true },
    pronunciation: { type: String, required: true },
    meaning: { type: String, required: true },
    whenToSay: { type: String, required: true },
    adminEmail: { type: String, required: true },
    lessonCategory: { type: Schema.Types.ObjectId, ref: 'LessonCategory', required: true },
});

interface ILessonCategory extends Document {
    title: string;
    icon: string;
    createdBy?: string;
    vocabulary: mongoose.Schema.Types.ObjectId[];
}

const LessonCategorySchema: Schema<ILessonCategory> = new Schema({
    title: { type: String, required: true },
    icon: { type: String, required: true },
    createdBy: { type: String, required: false },
    vocabulary: [{ type: Schema.Types.ObjectId, ref: 'Vocabulary' }],
});

const Vocabulary: Model<IVocabulary> = mongoose.model<IVocabulary>('Vocabulary', VocabularySchema);
const LessonCategory: Model<ILessonCategory> = mongoose.model<ILessonCategory>('LessonCategory', LessonCategorySchema);

export { Vocabulary, LessonCategory, IVocabulary, ILessonCategory };
