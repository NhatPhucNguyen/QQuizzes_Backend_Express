import express, { Request } from "express";
import verifyJWT from "../middleware/verifyJWT";
import * as collectionController from "../controllers/collection"
const collectionRouter = express.Router();

collectionRouter.use(verifyJWT);

collectionRouter.post("/create",collectionController.handleCollectionCreate);

export default collectionRouter;
