class Tracker{
    constructor(id, mediaId, status, progress = []) {
        this.id = id;
        this.mediaId = mediaId;
        this.status = status;
        this.progress = progress;
    }
}

let trackers = [
    new Tracker(1, 1, "Playing", [
        { value: 667.2, unit: "hours" }
    ]),
    new Tracker(2, 2, "Completed", [
        { value: 96, unit: "minutes" }
    ]),
    new Tracker(3, 3, "Watching", [
        { value: 15, total: 25, unit: "episodes" }
    ]),
    new Tracker(4, 4, "Completed", [
        { value: 139, total: 139, unit: "chapters" }
    ])
];

let nextId = 5;

const getTrackers = ()=>{
    return trackers;
};

const getTrackerByMediaId = (mediaId)=>{
    return trackers.find(t => t.mediaId === Number(mediaId));
};

const addTracker = (mediaId, status, progress)=>{
    const newTracker = new Tracker(nextId, Number(mediaId), status, progress);
    trackers.push(newTracker);
    nextId++;

    return newTracker;
};

const deleteTracker = (id)=>{
    const index = trackers.findIndex(t => t.id === Number(id));
    if(index === -1){
        return null;
    }

    return trackers.splice(index, 1)[0];
};

const updateTracker = (mediaId, status, progress)=>{
    const selectedTracker = getTrackerByMediaId(mediaId);
    if(!selectedTracker){
        return null;
    }
    
    selectedTracker.status = status;
    selectedTracker.progress = progress;
    return selectedTracker;
};

const importTrackers = (data)=>{
    trackers = data;
    nextId = Math.max(0, ...trackers.map(t => t.id)) + 1;
};

export default{
    Tracker,
    getTrackers,
    getTrackerByMediaId,
    addTracker,
    deleteTracker,
    updateTracker,
    importTrackers,
};
