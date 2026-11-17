//request response
import media from "../services/mediaServices.js";
import trackers from "../services/trackerServices.js";
import tags from "../services/tagServices.js"
import reviews from "../services/reviewsServices.js";

const home = (req, res) => {
    const allMedia = media.getMedia();
    const allTrackers = trackers.getTrackers();
    const totalMedia = allMedia.length;
    const inProgress = allTrackers.filter(
        t => ["Playing", "Watching", "Reading"].includes(t.status)
    ).length;

    const completed = allTrackers.filter(
        t => t.status === "Completed"
    ).length;

    const recentMedia = [...allMedia]
        .sort((a, b) => b.entryDate - a.entryDate)
        .slice(0, 3);

    res.render("home", {
        totalMedia,
        inProgress,
        completed,
        recentMedia,
        trackers: allTrackers,
        tags: tags.getTags()
    });
};

const collection = (req, res)=>{
    res.render("collections",{
        media: media.getMedia(),
        tags: tags.getTags(),
        trackers: trackers.getTrackers()
    });
};

const details = (req, res)=>{
    const selectedMedia = media.getMediaById(req.params.id);

    res.render("details", {
        media: selectedMedia,
        tracker: trackers.getTrackerByMediaId(req.params.id),
        tags: tags.getTags().filter(t => t.mediaIds.includes(Number(req.params.id))),
        allTags: tags.getTags(),
        reviews: reviews.getReviewsByMediaId(req.params.id)
    });
};


export default{
    home,
    collection,
    details,
}