//http requests
import multer from "multer"; //file upload
import path from "path";
import express from "express";
import pageController from "../controllers/pageController.js";
import mediaController from "../controllers/mediaController.js";
import backupController from "../controllers/backupController.js";
import trackerController from "../controllers/trackerController.js";
import reviewsController from "../controllers/reviewsController.js";
import tagController from "../controllers/tagController.js";
import collectionController from "../controllers/collectionController.js";


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

const importUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
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
router.post("/media/:id/tracking/add", trackerController.addTracker);
router.post("/media/:id/tracking/edit", trackerController.updateTracker);

router.post("/media/:id/reviews/add", reviewsController.addReview);
router.post("/media/:id/reviews/:reviewId/edit", reviewsController.updateReview);
router.post("/media/:id/reviews/:reviewId/delete", reviewsController.deleteReview);

router.post("/tags/add", tagController.addTag);
router.post("/media/:id/tags/update", tagController.updateMediaTags);
router.post("/tags/:id/edit", tagController.updateTag);
router.post("/tags/:id/delete", tagController.deleteTag);

router.post("/collections/add", collectionController.addCollection);
router.post("/collections/:id/edit", collectionController.updateCollection);
router.post("/collections/:id/delete", collectionController.deleteCollection);
router.post("/collections/:id/media/add", collectionController.addMediaToCollection);
router.post("/collections/:id/media/remove", collectionController.removeMediaFromCollection);
router.post("/media/:id/collections/update", collectionController.updateMediaCollections);
router.post("/collections/:id/media/update", collectionController.updateCollectionMedia);

router.get("/export", backupController.exportData);
router.post("/import", importUpload.single("dataFile"), backupController.importData);
export default router;