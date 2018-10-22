var http = require('http');
var fs = require('fs');
var url = require('url');
var mammoth = require("mammoth");
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
let docText ="";

function readDoc(){
  //word문서 읽기
  mammoth.extractRawText({path: "./hello.docx"})
    .then(function(result){
        var text = result.value; // The raw text 
        console.log(text);
        docText = text;
    })
    .done();
}
http.createServer(function(request,response){
    var _url = request.url;
    var pathname = url.parse(_url, true).pathname;
    app.use(bodyParser.urlencoded({ extended:false}));
    app.use(bodyParser.json());
    //app.use(express.bodyParser());
    if(pathname === '/'){
      fs.readFile('index.html', function(err, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
      });
    } else if(pathname === '/choose'){
      readDoc();
      response.end('read');
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
}).listen(3000);
