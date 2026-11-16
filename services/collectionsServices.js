class Collection{
    constructor(id, name, mediaIds = []) {
        this.id = id;
        this.name = name;
        this.mediaIds = mediaIds;
    }
}


let collections = [];

export default{
    Collection,
}