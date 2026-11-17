import media from "../services/mediaServices.js";
import reviews from "../services/reviewsServices.js";

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

export default {
    addReview,
    updateReview,
    deleteReview
};