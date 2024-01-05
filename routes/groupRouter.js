import express from "express";
import {
  createGroup,
  deleteGroup,
  getGroupDetails,
  getGroups,
  updateGroup,
} from "../controllers/groupController.js";

const groupRouter = express.Router();

groupRouter.post("/", createGroup);
groupRouter.get("/", getGroups);
groupRouter.get("/:id", getGroupDetails);
groupRouter.put("/:id", updateGroup);
groupRouter.delete("/:id", deleteGroup);

export default groupRouter;
