//request response
import media from "../services/mediaServices.js";
import trackers from "../services/trackerServices.js";

const home = (req, res) => {
    res.render("home", {
    media: media.getMedia(),
    trackers: trackers.getTrackers(),
    tagsByMediaId: {}
});
};

const collection = (req, res) => {
    res.render("collection");
};

const details = (req, res) => {
    const id = req.params.id;
    res.render("details", { id: id });
};

export default {
    home,
    collection,
    details,
}