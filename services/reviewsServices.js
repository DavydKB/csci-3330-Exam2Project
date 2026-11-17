//business logic, what is stored
class Review{
    constructor(id, mediaId, bodyText, date) {
        this.id = id;
        this.mediaId = mediaId;
        this.bodyText = bodyText;
        this.date = date;
    }
}

let reviews = [];
let nextId = 1;


const addReview = (mediaId, bodyText)=>{
    const newReview = new Review(
        nextId++,
        Number(mediaId),
        bodyText,
        new Date()
    );

    reviews.push(newReview);
    return newReview;
};


const getReviewsByMediaId = (mediaId)=>{
    return reviews.filter(r => r.mediaId === Number(mediaId));
};

const getReviewById = (id)=>{
    return reviews.find(r => r.id === Number(id));
};

const updateReview = (id, bodyText)=>{
    const review = getReviewById(id);

    if(!review){
        return null;
    }

    review.bodyText = bodyText;
    return review;
};


const deleteReview = (id)=>{
    const index = reviews.findIndex(r => r.id === Number(id));

    if(index === -1){
        return null;
    }

    return reviews.splice(index, 1)[0];
};

const getAllReviews = ()=>{
    return reviews;
};

const importReviews = (data)=>{
    reviews = data;
    nextId = Math.max(0, ...reviews.map(r => r.id)) + 1;
};
export default{
    Review,
    addReview,
    getReviewsByMediaId,
    getReviewById,
    updateReview,
    deleteReview,
    getAllReviews,
    importReviews,
};
