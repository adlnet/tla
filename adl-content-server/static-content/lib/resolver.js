const fs = require("fs");
const config = require("../config")
const video = require("./video")

module.exports = {
    resolve: function(base, req, res, next) {
        
        let check = this.checkPath;
        let handle = this.handleDirectory;

        // Pull from our content parent folder
        let urlParsed = decodeURIComponent(req.url)
        let query = (urlParsed.includes("?")) ? "?" + urlParsed.split("?")[1] : "";
        let path = (urlParsed.includes("?")) ? urlParsed.split("?")[0] : urlParsed;
        let root = base + "/files"

        // Check if we've somehow requested an EJS file manually.  If this happens, then the 
        // browser doesn't natively know how to handle that.
        //
        // We can either specify that in a response header or change the path here.
        //
        if (path.toLowerCase().endsWith(".ejs"))
            path = path.substr(0, path.length - 4)
        
        // The first pass below will be checking whether or not a valid EJS file exists
        // for the request.
        let pathEJS = (path.endsWith("/")) ? path + "index.ejs" : path + ".ejs";
        let pathDefault = (path.endsWith("/")) ? path + "index.html" : path;
        let pathRenderEJS = pathEJS.substr(1, pathEJS.length - 1);

        // The rest is straightforward.  We're just checking if a file exists here and rendering
        // any EJS we find.
        fs.exists(root + pathEJS, function (exists) {
            if (exists) {
                res.render(pathRenderEJS);
            } else {
                check(root, pathDefault, query, req, res, next, handle);
            }
        });
    },

    checkPath: function(root, path, query, req, res, next, handle) {

        fs.exists(root + path, function (exists) {
            if (exists) {
    
                // If something exists at this path, we will first need to know
                // whether we're dealing with a regular file or a directory.
                //
                // If it's a directory, then we have a special handler for that situation,
                // whereas files can be returned as-is.
                //
                fs.stat(root + path, function(err, stats){
                    if (stats.isDirectory()) {
                        handle(root, path, query, res, next);
                    }
                    else if (video.isVideo(path)) {
                        video.handleVideo(root, path, stats, req, res, next);
                    }
                    else {
                        res.sendFile(root + path);
                    }
                });
            }
            else {
                next();
            }
        })
    },

    handleDirectory: function(root, path, query, res, next) {

        // If we thought this was a directory but aren't using a closing / at the end,
        // then relative resources won't be returned correctly.
        //
        if (path.endsWith("/") == false) {
            res.redirect(path + "/" + query)
            return;
        }
        
        // Here, we'll check to see if anything matches the index.* format we're allowing
        // with the extensions. 
        //
        fs.readdir(root + path, function(err, files){
            
            let found = false;
            for (let ext in config.exts) {
                if (files.includes("index" + ext)) {
                    res.sendfile(root + path + "index" + ext + query)
                    return;
                }
            }
            if (found == false)
                next();
        });
    }
}