class Media{
    constructor(id, title, category, description, entryDate, rating, images, links) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.entryDate = entryDate;
        this.rating = rating;
        this.images = images;
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
        ["https://myanimelist.net/manga/77637/Helck?q=helck&cat=manga"]
    )
];

const addMedia = (data)=>{
    const media = new Media(
        mediaCollection.length ? Math.max(...mediaCollection.map((media) => media.id)) + 1 : 1,
        data.title,
        data.category,
        data.description,
        new Date(),
        data.rating,
        data.images,
        data.links
    );
    mediaCollection.push(media);
    return media;
};

const getMedia = ()=>{
    return mediaCollection;
};

const getMediaById = (id) => {
    return mediaCollection.find(media => media.id === Number(id));
};

export default{
    Media,
    getMedia,
    addMedia,
    getMediaById,
}