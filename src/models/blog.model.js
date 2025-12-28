import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required'],
        trim: true,
    },
    link: {
        type: String,
        unique: true
    },
    content: String,
    source: {
        type: String,
        default: 'beyondchats.com'
    }
}, {
    timestamps: true,
});


const Blog = mongoose.model('Blog', blogSchema);

export default Blog;