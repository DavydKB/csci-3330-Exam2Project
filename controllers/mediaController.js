import media from "../services/mediaServices.js";
import trackers from "../services/trackerServices.js";
import reviews from "../services/reviewsServices.js";
import tags from "../services/tagServices.js";

const addMedia = (req, res)=>{
    const { title, category, description, rating } = req.body;
    // et the cover image
    let coverImage = "";
    if(req.files.coverImage && req.files.coverImage.length > 0){
        coverImage = `/images/uploads/${req.files.coverImage[0].filename}`;
    }

    // Get gallery images
    let gallery = [];
    if(req.files.galleryImages){
        req.files.galleryImages.forEach(file=>{
            gallery.push(`/images/uploads/${file.filename}`);
        });
    }

    // Get external links
    let links = [];
    const submittedLinks = req.body.links;
    if(submittedLinks){
        if(Array.isArray(submittedLinks)){
            links = submittedLinks;
        }else{
            links = [submittedLinks];
        }
    }

    const newMedia = media.addMedia({
            title,
            category,
            description,
            rating: Number(rating),
            coverImage,
            gallery,
            links
    });

    const { status } = req.body;
    let values = req.body.values;
    let totals = req.body.totals;
    let units = req.body.units;
    if(!Array.isArray(values)){
        values = [values];
        totals = [totals];
        units = [units];
    }

    let progress = [];
    for(let i = 0; i < values.length; i++){
        let entry = {
            value: Number(values[i]),
            unit: units[i]
        };
        if(totals[i] !== ""){
            entry.total = Number(totals[i]);
        }
        progress.push(entry);
    }

    trackers.addTracker(newMedia.id, status, progress);
    res.redirect("/collections");
};


const updateMedia = (req, res)=>{
    const selectedMedia = media.getMediaById(req.params.id);
    if(!selectedMedia){
        return res.status(404).send("Media not found.");
    }
    const { title, category, description, rating } = req.body;

    // Keep the current cover unless a new one is uploaded
    let coverImage = selectedMedia.coverImage;
    if(req.files.coverImage && req.files.coverImage.length > 0){
        coverImage = `/images/uploads/${req.files.coverImage[0].filename}`;
    }

    // Get existing gallery images
    let gallery = [...selectedMedia.gallery || []];
    // Remove checked gallery images
    let imagesToRemove = req.body.removeGalleryImages;
    if(imagesToRemove){
        if(!Array.isArray(imagesToRemove)){
            imagesToRemove = [imagesToRemove];
        }

        gallery = gallery.filter(image => !imagesToRemove.includes(image));
    }

    // Add newly uploaded gallery images
    if(req.files.galleryImages){
        req.files.galleryImages.forEach(file=>{
            gallery.push(`/images/uploads/${file.filename}`);
        });
    }

    // Get external links
    let links = [];
    const submittedLinks = req.body.links;

    if(submittedLinks){
        if(Array.isArray(submittedLinks)){
            links = submittedLinks;
        }else{
            links = [submittedLinks];
        }
    }
    media.updateMedia(req.params.id, {
        title,
        category,
        description,
        rating: Number(rating),
        coverImage,
        gallery,
        links
    });
    res.redirect(`/details/${req.params.id}`);
};


const deleteMedia = (req, res)=>{
    const deletedMedia = media.deleteMedia(req.params.id);
    if(!deletedMedia){
        return res.status(404).send("Media not found.");
    }

    res.redirect("/collections");
};

const addTracker = (req, res)=>{
    const { status } = req.body;
    let values = req.body.values;
    let totals = req.body.totals;
    let units = req.body.units;
    if(!Array.isArray(values)){
        values = [values];
        totals = [totals];
        units = [units];
    }

    let progress = [];
    for(let i = 0; i < values.length; i++){
        let entry = {
            value: Number(values[i]),
            unit: units[i]
        };
        if(totals[i] !== ""){
            entry.total = Number(totals[i]);
        }
        progress.push(entry);
    }

    trackers.addTracker(req.params.id, status, progress);
    res.redirect(`/details/${req.params.id}`);
};

const updateTracker = (req, res)=>{
    const { status } = req.body;
    let values = req.body.values;
    let totals = req.body.totals;
    let units = req.body.units;
    if(!Array.isArray(values)){
        values = [values];
        totals = [totals];
        units = [units];
    }

    let progress = [];
    for(let i = 0; i < values.length; i++){
        let entry = {
            value: Number(values[i]),
            unit: units[i]
        };
        if(totals[i] !== ""){
            entry.total = Number(totals[i]);
        }
        progress.push(entry);
    }

    const updatedTracker = trackers.updateTracker(
        req.params.id,
        status,
        progress
    );
    if(!updatedTracker){
        return res.status(404).send("Tracker not found.");
    }

    res.redirect(`/details/${req.params.id}`);
};

const addReview = (req, res)=>{
    const { bodyText } = req.body;
    const mediaId = req.params.id;

    //Check that the media exists
    const selectedMedia = media.getMediaById(mediaId);

    if(!selectedMedia){
        return res.status(404).send("Media not found.");
    }

    //Validate review
    if(!bodyText || bodyText.trim() === ""){
        return res.status(400).send("Review cannot be empty.");
    }

    reviews.addReview(mediaId, bodyText.trim());
    res.redirect(`/details/${mediaId}`);
};

const updateReview = (req, res)=>{
    const { bodyText } = req.body;
    const mediaId = req.params.id;
    const reviewId = req.params.reviewId;
    const review = reviews.getReviewById(reviewId);

    //Check that the review belongs to this media
    if(!review || review.mediaId !== Number(mediaId)){
        return res.status(404).send("Review not found.");
    }
    //Validate review
    if(!bodyText || bodyText.trim() === ""){
        return res.status(400).send("Review cannot be empty.");
    }

    reviews.updateReview(reviewId, bodyText.trim());
    res.redirect(`/details/${mediaId}`);
};

const deleteReview = (req, res)=>{
    const mediaId = req.params.id;
    const reviewId = req.params.reviewId;
    const review = reviews.getReviewById(reviewId);

    //Check that the review belongs to this media
    if(!review || review.mediaId !== Number(mediaId)){
        return res.status(404).send("Review not found.");
    }

    reviews.deleteReview(reviewId);
    res.redirect(`/details/${mediaId}`);
};

const addTag = (req, res)=>{
    const { name } = req.body;
    //Validate tag name
    if(!name || name.trim() === ""){
        return res.status(400).send("Tag name cannot be empty.");
    }

    tags.addTag(name.trim());
    res.redirect("/collections");
};

const updateMediaTags = (req, res)=>{
    const mediaId = req.params.id;
    let { tagIds } = req.body;

    //Check that the media exists
    const selectedMedia = media.getMediaById(mediaId);
    if(!selectedMedia){
        return res.status(404).send("Media not found.");
    }
    //Handle no selected tags
    if(!tagIds){
        tagIds = [];
    } else if(!Array.isArray(tagIds)){
        tagIds = [tagIds];
    }

    tags.updateMediaTags(mediaId, tagIds);
    res.redirect(`/details/${mediaId}`);
};

const updateTag = (req, res)=>{
    const { name } = req.body;
    const tagId = req.params.id;
    if(!name || name.trim() === ""){
        return res.status(400).send("Tag name cannot be empty.");
    }

    const updatedTag = tags.updateTag(tagId, name.trim());
    if(!updatedTag){
        return res.status(404).send("Tag not found.");
    }

    res.redirect("/collections");
};

const deleteTag = (req, res)=>{
    const tagId = req.params.id;
    const deletedTag = tags.deleteTag(tagId);
    if(!deletedTag){
        return res.status(404).send("Tag not found.");
    }

    res.redirect("/collections");
};

export default {
    addMedia,
    updateMedia,
    deleteMedia,
    addTracker,
    updateTracker,
    addReview,
    updateReview,
    deleteReview,
    addTag,
    updateMediaTags,
    updateTag,
    deleteTag,
};