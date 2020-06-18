import * as express from "express";
import path from "path";
import {Express} from "express";

const fileServer = (app: Express) => {
    app.use(express.static(path.join(__dirname, '../build')));
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../build', 'index.html'));
    });
};
export default fileServer;
