import mongoose, { ConnectOptions } from 'mongoose';

// Define the connection interface to extend the mongoose connection with our cache
interface IMongoConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const globalWithMongoose = global as typeof globalThis & {
  mongoose: IMongoConnection;
};

const cached: IMongoConnection = globalWithMongoose.mongoose || { conn: null, promise: null };

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Caches the connection in development to prevent multiple connections.
 * 
 * @returns {Promise<typeof mongoose>} Mongoose instance
 */
async function connectToDatabase(): Promise<typeof mongoose> {
  // Return cached connection if available
  if (cached.conn) {
    if (isDev) {
      console.log('Using existing database connection');
    }
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const options: ConnectOptions = {
      // Remove deprecated options
      bufferCommands: false,
      autoIndex: true,
    };

    if (isDev) {
      // Enable debug mode in development
      mongoose.set('debug', true);
      
      // Log connection events
      mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
      });

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });
    }

    // Create connection promise
    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset cache on error to allow retries
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase; 