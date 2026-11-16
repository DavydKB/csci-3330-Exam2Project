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
        "",
        []
    ),
    new Media(
        2,
        "12 Angry Men",
        "Movie",
        "TEST MOVIE ENTRY",
        new Date("2026-11-16"),
        8,
        "",
        []
    ),
    new Media(
        3,
        "Attack On Titan S1",
        "Anime",
        "TEST ANIME ENTRY",
        new Date("2026-11-16"),
        7.6,
        "",
        []
    ),
    new Media(
        4,
        "Attack On Titan",
        "Manga",
        "TEST MANGA ENTRY",
        new Date("2026-11-16"),
        8,
        "",
        []
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

export default{
    Media,
    getMedia,
    addMedia,
}