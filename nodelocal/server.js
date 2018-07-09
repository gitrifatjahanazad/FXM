var http = require('http');

function loadFile (file){
    var fs = require('fs')
    return fs.readFileSync(file, 'utf-8');
}
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(loadFile('./public/index.html'));
}).listen(process.env.PORT);  