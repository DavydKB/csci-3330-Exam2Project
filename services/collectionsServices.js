class Collection{
    constructor(id, name, mediaIds = []) {
        this.id = id;
        this.name = name;
        this.mediaIds = mediaIds;
    }
}


let collections = [];

let nextId = 1;

const addCollection = (name)=>{
    const newCollection = new Collection(
        nextId++,
        name,
        []
    );

    collections.push(newCollection);
    return newCollection;
};

const getCollections = ()=>{
    return collections;
};

const getCollectionById = (id)=>{
    return collections.find(c => c.id === Number(id));
};

const addMediaToCollection = (collectionId, mediaId)=>{
    const collection = getCollectionById(collectionId);
    if(!collection){
        return null;
    }
    mediaId = Number(mediaId);
    //Prevent duplicate media entries
    if(collection.mediaIds.includes(mediaId)){
        return collection;
    }

    collection.mediaIds.push(mediaId);
    return collection;
};

const removeMediaFromCollection = (collectionId, mediaId)=>{
    const collection = getCollectionById(collectionId);
    if(!collection){
        return null;
    }
    collection.mediaIds = collection.mediaIds.filter(
        id => id !== Number(mediaId)
    );

    return collection;
};

const updateCollection = (id, name)=>{
    const collection = getCollectionById(id);
    if(!collection){
        return null;
    }

    collection.name = name;
    return collection;
};

const deleteCollection = (id)=>{
    const index = collections.findIndex(c => c.id === Number(id));
    if(index === -1){
        return null;
    }

    return collections.splice(index, 1)[0];
};

const importCollections = (data)=>{
    collections = data;
    nextId = Math.max(0, ...collections.map(c => c.id)) + 1;
};

export default{
    Collection,
    addCollection,
    getCollections,
    getCollectionById,
    addMediaToCollection,
    removeMediaFromCollection,
    updateCollection,
    deleteCollection,
    importCollections,
}