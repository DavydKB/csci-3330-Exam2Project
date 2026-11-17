import media from "../services/mediaServices.js";

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

    media.addMedia({
        title,
        category,
        description,
        rating: Number(rating),
        coverImage,
        gallery,
        links
    });
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

export default {
    addMedia,
    updateMedia,
    deleteMedia
};