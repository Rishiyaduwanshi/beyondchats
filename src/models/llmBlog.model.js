import mongoose from 'mongoose';

const llmBlogSchema = new mongoose.Schema({
    originalBlog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    title: String,
    metaDesc: String,
    contentMarkdown: String,
    version: { type: Number, required: true },
    references: [String],
}, { timestamps: true });


llmBlogSchema.pre("validate", async function (next) {
    if (this.isNew && !this.version) {
        const last = await mongoose.model("LlmBlog")
            .findOne({ originalBlog: this.originalBlog })
            .sort({ version: -1 })
            .select("version");

        this.version = last ? last.version + 1 : 1;
    }
    next();
});


export default mongoose.model('LlmBlog', llmBlogSchema);
