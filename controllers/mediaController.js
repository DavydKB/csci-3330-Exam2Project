import media from "../services/mediaServices.js";
import trackers from "../services/trackerServices.js";
import reviews from "../services/reviewsServices.js";
import tags from "../services/tagServices.js";
import collections from "../services/collectionsServices.js";

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

const addCollection = (req, res)=>{
    const { name } = req.body;
    //Validate collection name
    if(!name || name.trim() === ""){
        return res.status(400).send("Collection name cannot be empty.");
    }

    collections.addCollection(name.trim());
    res.redirect("/collections");
};

const updateCollection = (req, res)=>{
    const { name } = req.body;
    const collectionId = req.params.id;
    //Validate collection name
    if(!name || name.trim() === ""){
        return res.status(400).send("Collection name cannot be empty.");
    }
    const updatedCollection = collections.updateCollection(
        collectionId,
        name.trim()
    );
    if(!updatedCollection){
        return res.status(404).send("Collection not found.");
    }

    res.redirect("/collections");
};

const deleteCollection = (req, res)=>{
    const collectionId = req.params.id;
    const deletedCollection = collections.deleteCollection(collectionId);
    if(!deletedCollection){
        return res.status(404).send("Collection not found.");
    }

    res.redirect("/collections");
};

const addMediaToCollection = (req, res)=>{
    const collectionId = req.params.id;
    const { mediaId } = req.body;

    //Check that the collection exists
    const selectedCollection = collections.getCollectionById(collectionId);

    if(!selectedCollection){
        return res.status(404).send("Collection not found.");
    }

    //Check that the media exists
    const selectedMedia = media.getMediaById(mediaId);

    if(!selectedMedia){
        return res.status(404).send("Media not found.");
    }

    collections.addMediaToCollection(collectionId, mediaId);

    res.redirect("/collections");
};

const removeMediaFromCollection = (req, res)=>{
    const collectionId = req.params.id;
    const { mediaId } = req.body;

    //Check that the collection exists
    const selectedCollection = collections.getCollectionById(collectionId);

    if(!selectedCollection){
        return res.status(404).send("Collection not found.");
    }

    //Check that the media exists
    const selectedMedia = media.getMediaById(mediaId);

    if(!selectedMedia){
        return res.status(404).send("Media not found.");
    }

    collections.removeMediaFromCollection(collectionId, mediaId);

    res.redirect("/collections");
};

const updateMediaCollections = (req, res)=>{
    const mediaId = req.params.id;
    let { collectionIds } = req.body;
    //Check that the media exists
    const selectedMedia = media.getMediaById(mediaId);

    if(!selectedMedia){
        return res.status(404).send("Media not found.");
    }
    //Handle no selected collections
    if(!collectionIds){
        collectionIds = [];
    } else if(!Array.isArray(collectionIds)){
        collectionIds = [collectionIds];
    }
    //Update the media's collection assignments
    collections.getCollections().forEach(collection=>{
        if(collectionIds.includes(String(collection.id))){
            collections.addMediaToCollection(collection.id, mediaId);
        } else {
            collections.removeMediaFromCollection(collection.id, mediaId);
        }
    });
    res.redirect(`/details/${mediaId}`);
};

const updateCollectionMedia = (req, res)=>{
    const collectionId = req.params.id;
    let { mediaIds } = req.body;
    //Check that the collection exists
    const selectedCollection = collections.getCollectionById(collectionId);

    if(!selectedCollection){
        return res.status(404).send("Collection not found.");
    }

    //Handle no selected media
    if(!mediaIds){
        mediaIds = [];
    } else if(!Array.isArray(mediaIds)){
        mediaIds = [mediaIds];
    }

    //Update media assignments
    media.getMedia().forEach(item=>{
        if(mediaIds.includes(String(item.id))){
            collections.addMediaToCollection(collectionId, item.id);
        } else {
            collections.removeMediaFromCollection(collectionId, item.id);
        }
    });

    res.redirect(`/collections?collection=${collectionId}`);
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
    addCollection,
    updateCollection,
    deleteCollection,
    addMediaToCollection,
    removeMediaFromCollection,
    updateMediaCollections,
    updateCollectionMedia,
};