var http = require("http");
var pdftohtml = require('pdftohtmljs'); //pdf를 html로
var converter = new pdftohtml('ss.pdf', "index.html");
converter.convert('ipad').then(function() {
    console.log("Success");
}).catch(function(err) {
    console.error("Conversion error: " + err);
});

var mammoth = require("mammoth");
let textYuri ="";
mammoth.extractRawText({path: "./hello.docx"})
    .then(function(result){
        var text = result.value; // The raw text 
        console.log(text);
        var messages = result.messages;
        textYuri = text;
    })
    .done();

http.createServer(function(request, response){
    /* 
        HTTP 헤더 전송
        HTTP Status: 200 : OK
        Content Type: text/plain
    */
    response.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
    
    /*
        Response Body 를 "Hello World" 로 설정
    */
    response.end(`${textYuri}`);
}).listen(8081);



console.log("Server running at http://127.0.0.1:8081");





    