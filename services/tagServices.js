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

const addTag = (name)=>{
    const newTag = new Tag(
        tags.length + 1,
        name,
        []
    );

    tags.push(newTag);
    return newTag;
};

const updateMediaTags = (mediaId, tagIds)=>{
    mediaId = Number(mediaId);

    //Remove this media from every tag
    tags.forEach(tag=>{
        tag.mediaIds = tag.mediaIds.filter(id => id !== mediaId);
    });

    //Assign the selected tags to this media
    tagIds.forEach(tagId=>{
        const tag = tags.find(t => t.id === Number(tagId));

        if(tag){
            tag.mediaIds.push(mediaId);
        }
    });
};

const updateTag = (id, name)=>{
    const tag = tags.find(t => t.id === Number(id));
    if(!tag){
        return null;
    }

    tag.name = name;
    return tag;
};

const deleteTag = (id)=>{
    const index = tags.findIndex(t => t.id === Number(id));
    if(index === -1){
        return null;
    }
    return tags.splice(index, 1)[0];
};

export default{
    Tag,
    getTags,
    addTag,
    updateMediaTags,
    updateTag,
    deleteTag,
}