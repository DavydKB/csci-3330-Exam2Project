//request response
import media from "../services/mediaServices.js";
import trackers from "../services/trackerServices.js";
import tags from "../services/tagServices.js"
import reviews from "../services/reviewsServices.js";
import collections from "../services/collectionsServices.js";

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
    const selectedCollectionId = req.query.collection;
    let selectedCollection = null;
    let displayedMedia = media.getMedia();
    //Filter media if a collection was selected
    if(selectedCollectionId){
        selectedCollection = collections.getCollectionById(selectedCollectionId);
        if(!selectedCollection){
            return res.status(404).send("Collection not found.");
        }
        displayedMedia = selectedCollection.mediaIds
            .map(id => media.getMediaById(id))
            .filter(item => item !== undefined);
    }

    res.render("collections",{
        media: displayedMedia,
        allMedia: media.getMedia(),
        tags: tags.getTags(),
        trackers: trackers.getTrackers(),
        collections: collections.getCollections(),
        selectedCollection
    });
};

const details = (req, res)=>{
    const selectedMedia = media.getMediaById(req.params.id);

    res.render("details", {
        media: selectedMedia,
        tracker: trackers.getTrackerByMediaId(req.params.id),
        tags: tags.getTags().filter(t => t.mediaIds.includes(Number(req.params.id))),
        allTags: tags.getTags(),
        reviews: reviews.getReviewsByMediaId(req.params.id),
        allCollections: collections.getCollections()
    });
};


export default{
    home,
    collection,
    details,
}