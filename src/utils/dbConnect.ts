import mongoose from 'mongoose'

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env'
    )
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}
async function dbConnect(listen?: () => void) {
    if (cached.conn) {
        return cached.conn
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            maxPoolSize: 10,
            minPoolSize: 2,

        }).then((mongoose) => {
            listen();
            return mongoose
        })
    }
    cached.conn = await cached.promise
    return cached.conn
}

export default dbConnect