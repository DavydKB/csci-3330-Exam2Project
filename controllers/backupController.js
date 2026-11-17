import media from "../services/mediaServices.js";
import trackers from "../services/trackerServices.js";
import reviews from "../services/reviewsServices.js";
import tags from "../services/tagServices.js";
import collections from "../services/collectionsServices.js";

const exportData = (req, res)=>{
    const data = {
        media: media.getMedia(),
        trackers: trackers.getTrackers(),
        reviews: reviews.getAllReviews(),
        tags: tags.getTags(),
        collections: collections.getCollections()
    };

    res.setHeader("Content-Disposition", "attachment; filename=media-tracker.json");
    res.setHeader("Content-Type", "application/json");
    res.json(data);
};

const importData = (req, res)=>{
    try{
        if(!req.file){
            return res.status(400).send("Please select a JSON file.");
        }

        const data = JSON.parse(req.file.buffer.toString("utf8"));

        if(!data.media || !Array.isArray(data.media) ||
            !data.trackers || !Array.isArray(data.trackers) ||
            !data.reviews || !Array.isArray(data.reviews) ||
            !data.tags || !Array.isArray(data.tags) ||
            !data.collections || !Array.isArray(data.collections)){
            return res.status(400).send("Invalid backup file.");
        }

        media.importMedia(data.media);
        trackers.importTrackers(data.trackers);
        reviews.importReviews(data.reviews);
        tags.importTags(data.tags);
        collections.importCollections(data.collections);

        res.redirect("/collections");
    } catch(error){
        res.status(400).send("Could not import file. Make sure it is a valid JSON backup.");
    }
};

export default{
    exportData,
    importData
};