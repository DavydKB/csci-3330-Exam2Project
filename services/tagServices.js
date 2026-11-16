class Tag{
    constructor(id, name, mediaIds = []) {
        this.id = id;
        this.name = name;
        this.mediaIds = mediaIds;
    }
}

let tags = [];

export default{
    Tag,
}