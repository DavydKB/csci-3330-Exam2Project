import media from "../services/mediaServices.js";
import collections from "../services/collectionsServices.js";

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
    addCollection,
    updateCollection,
    deleteCollection,
    addMediaToCollection,
    removeMediaFromCollection,
    updateMediaCollections,
    updateCollectionMedia
};