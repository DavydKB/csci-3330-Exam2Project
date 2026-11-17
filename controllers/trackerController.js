import trackers from "../services/trackerServices.js";

const addTracker = (req, res)=>{
    const { status } = req.body;
    let values = req.body.values || [];
    let totals = req.body.totals || [];
    let units = req.body.units || [];
    if(!Array.isArray(values)){
        values = [values];
        totals = [totals];
        units = [units];
    }
    let progress = [];
    for(let i = 0; i < values.length; i++){
        if(values[i] === "" || !units[i] || units[i].trim() === ""){
            continue;
        }
        let entry = {
            value: Number(values[i]),
            unit: units[i]
        };
        if(totals[i] !== "" && totals[i] !== undefined){
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
    addTracker,
    updateTracker
};