var mammoth = require("mammoth");
const multer = require('multer');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var hwp = require("node-hwp");
var content='기본';
var uploadFilePath='';
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
// var pdfreader = require('pdfreader');
 
// var rows = {}; // indexed by y-position
 
// function printRows() {
//   Object.keys(rows) // => array of y-positions (type: float)
//     .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
//     .forEach((y) => console.log((rows[y] || []).join('')));
// }

// function readPdf(){
//     new pdfreader.PdfReader().parseFileItems('ss.pdf', function(err, item){
//     if (!item || item.page) {
//         // end of file, or page
//         printRows();
//         //console.log('PAGE:', item.page);
//         rows = {}; // clear rows for next page
//     }
//     else if (item.text) {
//         // accumulate text items into rows object, per line
//         (rows[item.y] = rows[item.y] || []).push(item.text);
//     }
//     });
// }

var pdfUtil = require('pdf-to-text');

function readPdf(){
    pdfUtil.pdfToText(uploadFilePath, function(err, data) {
    if (err) throw(err);
    console.log(data); //print all text  
    res.render('loadContent.ejs',{content:data});
    });
}




//word문서 읽기
function readDoc(res){
  mammoth.extractRawText({path: uploadFilePath})
    .then(function(result){
        var text = result.value; // The raw text 
        console.log(text);
        res.render('loadContent.ejs',{content:text});
    })
    .done();
}

//hwp문서 읽기
function readHwp(res){
    hwp.open(uploadFilePath, function(err, doc){
     //console.log(doc.toHML(true)); //hwp 내용이 HWPML로 출력
     console.log( doc.convertTo(hwp.converter.plainText)); //text만 출력
     res.render('loadContent.ejs',{content:doc.convertTo(hwp.converter.plainText)});
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
        uploadFilePath=req.file.path;
        console.log(fileEx+' and '+uploadFilePath);
        switch (fileEx) {
            case 'doc': case 'docx':
                readDoc(res);
                break;
            case 'pdf':
                readPdf();
                break;
            case 'hwp':
                readHwp();
                break;
            default:
                break;
        }
      });
}