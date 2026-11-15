//http requests

import express from "express";
import controller from "../controllers/controller.js"

const router = express.Router();

router.get("/", controller.home);
router.get("/collections", controller.collection);
router.get("/details/:id", controller.details);

export default router;