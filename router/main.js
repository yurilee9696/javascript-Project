var mammoth = require("mammoth");
const multer = require('multer');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var hwp = require("node-hwp");
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());

module.exports = {
	'plainText': require('./plainText.js')
};

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
//     }
//     filename: function (req, file, cb) {
//       cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
//     }
//   })
// var upload = multer({ storage:storage });
var upload = multer({ dest: 'uploads/' });
//app.use(express.bodyParser());


//pdf문서 읽기
// var pdftohtml = require('pdftohtmljs');
// var converter = new pdftohtml('test.pdf', "sample.html");

// function readPdf(){
//     converter.convert('ipad').then(function() {
//         console.log("Success");
//     }).catch(function(err) {
//         console.error("Conversion error: " + err);
//     });
// }

//word문서 읽기
function readDoc(){
  mammoth.extractRawText({path: "./hello.docx"})
    .then(function(result){
        var text = result.value; // The raw text 
        console.log(text);
        docText = text;
    })
    .done();
}

//hwp문서 읽기
function readHwp(){
    hwp.open('hello.hwp', function(err, doc){
     //console.log(doc.toHML(true)); //hwp 내용이 HWPML로 출력
     console.log( doc.convertTo(hwp.converter.plainText)); //text만 출력
    });
}

module.exports = function(app)
{
     app.get('/',function(req,res){
        res.render('index.html')
     });
     app.post('/choose', upload.single('fileName'), function(req, res){
        //res.send('Uploaded! : '+req.file.originalname); // object를 리턴함
        
        console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
        
        var fileStr=req.file.originalname.split('.');
        var fileEx=fileStr[1]; //파일 확장자명
        console.log(fileEx);
        switch (fileEx) {
            case 'doc': case 'docx':
                readDoc();
                break;
            case 'pdf':
                //readPdf();
                break;
            case 'hwp':
                readHwp();
                break;
            default:
                break;
        }
        res.render('loadContent.html');
      });
}