import express, { Request } from "express";
import verifyJWT from "../middleware/verifyJWT";
import * as collectionController from "../controllers/collection";
import { verifyUser } from "../middleware/verifyUser";
const collectionRouter = express.Router();

collectionRouter.use(verifyJWT);
collectionRouter.use(verifyUser);
collectionRouter.post("/create", collectionController.collectionCreate);
collectionRouter.get("/get/:name", collectionController.getSingleCollection);
collectionRouter.get(
    "/myCollection/getAll",
    collectionController.getOwnedCollections
);
collectionRouter.patch("/update/:name", collectionController.updateCollection);
export default collectionRouter;
