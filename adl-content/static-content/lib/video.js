const fs = require("fs");

module.exports = {
    handleVideo: (root, path, stat, req, res, next) => {

        console.log(path, stat)

        const fileSize = stat.size
        const range = req.headers.range
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1] ?
                parseInt(parts[1], 10) :
                fileSize - 1
            const chunkSize = (end - start) + 1
            const file = fs.createReadStream(root + path, {
                start,
                end
            })
            const head = {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunkSize,
                "Content-Type": "video/mp4",
            }

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                "Content-Length": fileSize,
                "Content-Type": "video/mp4",
            }
            res.writeHead(200, head)
            fs.createReadStream(root + path).pipe(res)
        }
    },

    isVideo: (path) => { 
        return path.toLowerCase().endsWith(".mp4") 
    }
}