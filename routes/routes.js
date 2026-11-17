//http requests
import multer from "multer"; //file upload
import path from "path";
import express from "express";
import pageController from "../controllers/pageController.js";
import mediaController from "../controllers/mediaController.js";


const router = express.Router();
const storage = multer.diskStorage({
    destination: "public/images/uploads",

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG, PNG, WEBP, and GIF images are allowed."));
        }
    }
});

router.get("/", pageController.home);
router.get("/collections", pageController.collection);
router.get("/details/:id", pageController.details);

router.post("/media/add", upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 }
]), mediaController.addMedia);

router.post("/media/:id/edit", upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 }
]), mediaController.updateMedia);

router.post("/media/:id/delete", mediaController.deleteMedia);
router.post("/media/:id/tracking/add", mediaController.addTracker);
router.post("/media/:id/tracking/edit", mediaController.updateTracker);

router.post("/media/:id/reviews/add", mediaController.addReview);
router.post("/media/:id/reviews/:reviewId/edit", mediaController.updateReview);
router.post("/media/:id/reviews/:reviewId/delete", mediaController.deleteReview);

router.post("/tags/add", mediaController.addTag);
router.post("/media/:id/tags/update", mediaController.updateMediaTags);
router.post("/tags/:id/edit", mediaController.updateTag);
router.post("/tags/:id/delete", mediaController.deleteTag);

export default router;