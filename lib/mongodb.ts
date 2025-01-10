import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGO environment variable");
}

async function connectToDatabase() {
    if (mongoose.connection.readyState === 1) {
        return mongoose;
    }
    const opts = {
        bufferCommands: false,
    };
    try {
        await mongoose.connect(MONGODB_URI!, opts);
        return mongoose;
    } catch (error) {
        if (error instanceof mongoose.Error) {
            console.error("Mongoose-specific error:", error.message);
        } else {
            console.error("General error:", error);
        }
        throw new Error("Could not connect to MongoDB. Please check your connection settings.");
    }
}

export default connectToDatabase;