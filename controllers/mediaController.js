import media from "../services/mediaServices.js";
import trackers from "../services/trackerServices.js";

const addMedia = (req, res)=>{
    const { title, category, description, rating } = req.body;
    // et the cover image
    let coverImage = "";
    if(req.files.coverImage && req.files.coverImage.length > 0){
        coverImage = `/images/uploads/${req.files.coverImage[0].filename}`;
    }

    // Get gallery images
    let gallery = [];
    if(req.files.galleryImages){
        req.files.galleryImages.forEach(file=>{
            gallery.push(`/images/uploads/${file.filename}`);
        });
    }

    // Get external links
    let links = [];
    const submittedLinks = req.body.links;
    if(submittedLinks){
        if(Array.isArray(submittedLinks)){
            links = submittedLinks;
        }else{
            links = [submittedLinks];
        }
    }

    const newMedia = media.addMedia({
            title,
            category,
            description,
            rating: Number(rating),
            coverImage,
            gallery,
            links
    });

    const { status } = req.body;
    let values = req.body.values;
    let totals = req.body.totals;
    let units = req.body.units;
    if(!Array.isArray(values)){
        values = [values];
        totals = [totals];
        units = [units];
    }

    let progress = [];
    for(let i = 0; i < values.length; i++){
        let entry = {
            value: Number(values[i]),
            unit: units[i]
        };
        if(totals[i] !== ""){
            entry.total = Number(totals[i]);
        }
        progress.push(entry);
    }

    trackers.addTracker(newMedia.id, status, progress);
    res.redirect("/collections");
};


const updateMedia = (req, res)=>{
    const selectedMedia = media.getMediaById(req.params.id);
    if(!selectedMedia){
        return res.status(404).send("Media not found.");
    }
    const { title, category, description, rating } = req.body;

    // Keep the current cover unless a new one is uploaded
    let coverImage = selectedMedia.coverImage;
    if(req.files.coverImage && req.files.coverImage.length > 0){
        coverImage = `/images/uploads/${req.files.coverImage[0].filename}`;
    }

    // Get existing gallery images
    let gallery = [...selectedMedia.gallery || []];
    // Remove checked gallery images
    let imagesToRemove = req.body.removeGalleryImages;
    if(imagesToRemove){
        if(!Array.isArray(imagesToRemove)){
            imagesToRemove = [imagesToRemove];
        }

        gallery = gallery.filter(image => !imagesToRemove.includes(image));
    }

    // Add newly uploaded gallery images
    if(req.files.galleryImages){
        req.files.galleryImages.forEach(file=>{
            gallery.push(`/images/uploads/${file.filename}`);
        });
    }

    // Get external links
    let links = [];
    const submittedLinks = req.body.links;

    if(submittedLinks){
        if(Array.isArray(submittedLinks)){
            links = submittedLinks;
        }else{
            links = [submittedLinks];
        }
    }
    media.updateMedia(req.params.id, {
        title,
        category,
        description,
        rating: Number(rating),
        coverImage,
        gallery,
        links
    });
    res.redirect(`/details/${req.params.id}`);
};


const deleteMedia = (req, res)=>{
    const deletedMedia = media.deleteMedia(req.params.id);
    if(!deletedMedia){
        return res.status(404).send("Media not found.");
    }

    res.redirect("/collections");
};

const addTracker = (req, res)=>{
    const { status } = req.body;
    let values = req.body.values;
    let totals = req.body.totals;
    let units = req.body.units;
    if(!Array.isArray(values)){
        values = [values];
        totals = [totals];
        units = [units];
    }

    let progress = [];
    for(let i = 0; i < values.length; i++){
        let entry = {
            value: Number(values[i]),
            unit: units[i]
        };
        if(totals[i] !== ""){
            entry.total = Number(totals[i]);
        }
        progress.push(entry);
    }

    trackers.addTracker(req.params.id, status, progress);
    res.redirect(`/details/${req.params.id}`);
};

const updateTracker = (req, res)=>{
    const { status } = req.body;
    let values = req.body.values;
    let totals = req.body.totals;
    let units = req.body.units;
    if(!Array.isArray(values)){
        values = [values];
        totals = [totals];
        units = [units];
    }

    let progress = [];
    for(let i = 0; i < values.length; i++){
        let entry = {
            value: Number(values[i]),
            unit: units[i]
        };
        if(totals[i] !== ""){
            entry.total = Number(totals[i]);
        }
        progress.push(entry);
    }

    const updatedTracker = trackers.updateTracker(
        req.params.id,
        status,
        progress
    );
    if(!updatedTracker){
        return res.status(404).send("Tracker not found.");
    }

    res.redirect(`/details/${req.params.id}`);
};

export default {
    addMedia,
    updateMedia,
    deleteMedia,
    addTracker,
    updateTracker,
};