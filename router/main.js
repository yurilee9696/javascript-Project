var mammoth = require("mammoth");
const multer = require('multer');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var hwp = require("node-hwp");
var uploadFilePath='';
var fileTitle='';
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());

module.exports = {
	'plainText': require('./plainText.js')
};

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

function readPdf(res){
    pdfUtil.pdfToText(uploadFilePath, function(err, data) {
    if (err) throw(err);
    console.log(data); //print all text  
    res.render('loadContent.ejs',{fileTitle:fileTitle,content:data.replace(/\n/g, '<br/>',)});
    });
}




//word문서 읽기
function readDoc(res){
  mammoth.extractRawText({path: uploadFilePath})
    .then(function(result){
        var text = result.value; // The raw text 
        console.log(text);
        res.render('loadContent.ejs',{fileTitle:fileTitle,content:text.replace(/\n/g, '<br/>',)});
    })
    .done();
}

//hwp문서 읽기
function readHwp(res){
    hwp.open(uploadFilePath, function(err, doc){
     //console.log(doc.toHML(true)); //hwp 내용이 HWPML로 출력
     let hwpContent=doc.convertTo(hwp.converter.plainText);
     console.log( hwpContent); //text만 출력
     res.render('loadContent.ejs',{fileTitle:fileTitle,content:hwpContent.replace(/\n/g, '<br/>',)});
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
        fileTitle=fileStr[0];
        uploadFilePath=req.file.path;
        console.log(fileEx+' and '+uploadFilePath);
        switch (fileEx) {
            case 'docx':
                readDoc(res);
                break;
            case 'pdf':
                readPdf(res);
                break;
            case 'hwp':
                readHwp(res);
                break;
            default:
                break;
        }
      });
}