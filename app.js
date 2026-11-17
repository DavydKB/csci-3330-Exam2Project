import express from "express";
import router from "./routes/routes.js";
import helmet from "helmet";
import requestLogger from "./middleware/middleware.js";

const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", router);

app.use((req, res, next)=>{
    const error = new Error("The page or resource you requested could not be found.");
    error.status = 404;
    next(error);
});

const errorHandler = (err, req, res, next)=>{
    console.error(err);
    const status = err.status || 500;
    let message = err.message || "Internal Server Error.";

    if(status === 500){
        message = "An unexpected error occurred.";
    }
    res.status(status).render("error", {
        status,
        message
    });
};

app.use(errorHandler);
export default app;
