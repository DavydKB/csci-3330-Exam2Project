//business logic, what is stored
class Review{
    constructor(id, mediaId, rating, bodyText, date) {
        this.id = id;
        this.mediaId = mediaId;
        this.rating = rating;
        this.bodyText = bodyText;
        this.date = date;
    }
}


let reviews = [];

export default{
    Review,
}
