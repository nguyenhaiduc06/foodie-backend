import express from "express";
import {
  createStorage,
  deleteStorage,
  getStorageDetails,
  getStorages,
  updateStorage,
} from "../controllers/storageController.js";
import {auth} from "../middleware/auth.js"

const storageRouter = express.Router();

storageRouter.post("/", auth, createStorage);
storageRouter.get("/", auth, getStorages);
storageRouter.get("/:id", auth, getStorageDetails);
storageRouter.put("/:id", auth, updateStorage);
storageRouter.delete("/:id", auth, deleteStorage);

export default storageRouter;
