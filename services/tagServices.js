class Tag{
    constructor(id, name, mediaIds = []) {
        this.id = id;
        this.name = name;
        this.mediaIds = mediaIds;
    }
}

let tags = [
    new Tag(1,"Favorites", [1,4]),
    new Tag(2,"Online",[1]),
];

const getTags =()=>{
    return tags;
}
export default{
    Tag,
    getTags,
}