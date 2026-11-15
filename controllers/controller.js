//request response

const home = (req, res) => {
    res.render("home");
};

const collection = (req, res) => {
    res.render("collection");
};

const details = (req, res) => {
    const id = req.params.id;
    res.render("details", { id: id });
};

export default {
    home,
    collection,
    details,
}