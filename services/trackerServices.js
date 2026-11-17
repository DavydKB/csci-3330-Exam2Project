class Tracker{
    constructor(id, mediaId, status, progress) {
        this.id = id;
        this.mediaId = mediaId;
        this.status = status;
        this.progress = progress;
    }
}

let trackers = [    
    new Tracker(1, 1, "Playing", { value: 667.2, unit: "hours" }),
    new Tracker(2, 2, "Completed", { value: 96, unit: "minutes" }),
    new Tracker(3, 3, "Watching", { value: 15, total: 25, unit: "episodes" }),
    new Tracker(4, 4, "Completed", { value: 139, total: 139, unit: "chapters" })
];

const getTrackers = ()=>{
    return trackers;
};

export default{
    Tracker,
    getTrackers,
}