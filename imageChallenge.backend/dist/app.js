"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
var app = express_1.default();
var port = process.env.PORT; // default port to listen
app.use(body_parser_1.default.json());
app.use(cors_1.default());
app.use(morgan_1.default('dev'));
// define a route handler for the default home page
app.get("/", function (req, res) {
    res.send("Hello a!");
});
// start the Express server
app.listen(port, function () {
    console.log("server started at http://localhost:" + port);
});
