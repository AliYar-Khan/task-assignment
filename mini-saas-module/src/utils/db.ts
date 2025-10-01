import mongoose from 'mongoose';

const mongoUrl = process.env.MONGODB_URI || '';

export const connectDB = async () => {
    try {
        if (!mongoUrl) {
            throw new Error('MongoDB connection string is not defined in environment variables (MONGODB_URI)');
        }
        await mongoose.connect(mongoUrl, {
            // useNewUrlParser and useUnifiedTopology are default in mongoose >= 6
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
