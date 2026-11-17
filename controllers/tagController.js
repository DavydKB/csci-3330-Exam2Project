import media from "../services/mediaServices.js";
import tags from "../services/tagServices.js";

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

export default {
    addTag,
    updateMediaTags,
    updateTag,
    deleteTag
};