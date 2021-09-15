import express from "express";
import dotenv from "dotenv";
import bodyparser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import  mongoose from "mongoose";
import { userRouter } from "./routes/user.Router";
import {imageRouter} from "./routes/image.Router"
import path from 'path';

export const imagesPath = path.resolve(__dirname, "images");



dotenv.config();

const app = express();

const port = process.env.PORT; // default port to listen
const mongodb_uri = process.env.MONGODB_URI || '';

mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyparser.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/user', userRouter );
app.use('/image', imageRouter);
// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello mohamed" );
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );