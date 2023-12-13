import express from "express";
import {
  createStorage,
  deleteStorage,
  getStorageDetails,
  getStorages,
  updateStorage,
} from "../controllers/storageController";

const storageRouter = express.Router();

storageRouter.post("/", createStorage);
storageRouter.get("/", getStorages);
storageRouter.get("/:id", getStorageDetails);
storageRouter.put("/:id", updateStorage);
storageRouter.delete("/:id", deleteStorage);

export default storageRouter;
