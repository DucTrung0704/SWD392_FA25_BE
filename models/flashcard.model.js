import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema({
    deck_id: { type: mongoose.Schema.Types.ObjectId, ref: "FlashcardDeck", required: true },
    question_image: String,
    answer_image: String,
    tag: String,
    note: String
});

export default mongoose.model("Flashcard", flashcardSchema);
