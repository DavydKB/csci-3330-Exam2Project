class Media{
    constructor(id, title, category, description, entryDate, rating, coverImage, gallery, links) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.entryDate = entryDate;
        this.rating = rating;
        this.coverImage = coverImage;
        this.gallery = gallery || [];
        this.links = links;
    }
}

let mediaCollection = [ //test entries
    new Media(
        1,
        "Deadlock",
        "Game",
        "TEST GAME ENTRY",
        new Date("2026-11-16"),
        7,
        "/images/deadlock_logo.png",
        [],
        ["https://store.steampowered.com/app/1422450/Deadlock/"]
    ),
    new Media(
        2,
        "12 Angry Men",
        "Movie",
        "TEST MOVIE ENTRY",
        new Date("2026-11-16"),
        8,
        "/images/12angrymen_poster.jpg",
        [],
        ["https://www.imdb.com/title/tt0050083/?ref_=nv_sr_srsg_0_tt_8_nm_0_in_0_q_12+angry+men&_ssoLoop=1"]
    ),
    new Media(
        3,
        "Attack On Titan S1",
        "Anime",
        "TEST ANIME ENTRY",
        new Date("2026-11-16"),
        7.6,
        "/images/snk_s1.jpg",
        [],
        ["https://myanimelist.net/anime/16498/Shingeki_no_Kyojin?q=snk&cat=anime"]
    ),
    new Media(
        4,
        "Helck",
        "Manga",
        "TEST MANGA ENTRY",
        new Date("2026-11-16"),
        9,
        "/images/helck_vol1.jpg",
        [],
        ["https://myanimelist.net/manga/77637/Helck?q=helck&cat=manga"]
    )
];

const addMedia = (data)=>{
    const newMedia = new Media(
        mediaCollection.length + 1,
        data.title,
        data.category,
        data.description,
        new Date(),
        data.rating,
        data.coverImage,
        data.gallery,
        data.links
    );
    mediaCollection.push(newMedia);
    return newMedia;
};

const getMedia = ()=>{
    return mediaCollection;
};

const getMediaById = (id) => {
    return mediaCollection.find(media => media.id === Number(id));
};

const updateMedia = (id, data) => {
    const selectedMedia = getMediaById(id);
    if (!selectedMedia) {
        return null;
    }

    selectedMedia.title = data.title;
    selectedMedia.category = data.category;
    selectedMedia.description = data.description;
    selectedMedia.rating = data.rating;
    selectedMedia.coverImage = data.coverImage;
    selectedMedia.gallery = data.gallery;
    selectedMedia.links = data.links;

    return selectedMedia;
};

const deleteMedia = (id) => {
    const index = mediaCollection.findIndex(
        media => media.id === Number(id)
    );
    if (index === -1) {
        return null;
    }
    return mediaCollection.splice(index, 1)[0];
};
const importMedia = (data)=>{
    mediaCollection = data.map(item => new Media(
        item.id,
        item.title,
        item.category,
        item.description,
        new Date(item.entryDate),
        item.rating,
        item.coverImage,
        item.gallery,
        item.links
    ));
};
export default{
    Media,
    getMedia,
    addMedia,
    getMediaById,
    updateMedia,
    deleteMedia,
    importMedia,
}