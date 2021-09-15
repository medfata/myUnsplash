import express from 'express';
import imageController = require("../controllers/image.controller");





export const imageRouter = express.Router();

imageRouter.post('/uploadImage', imageController.uploadImage);

imageRouter.get('/getAll', imageController.getAllImagesOfOwner);

imageRouter.get('/getOne/:labelTerm', imageController.getImageByName);

imageRouter.post('/delete', imageController.deleteImage);