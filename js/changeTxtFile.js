function checkExtension(){
    var thumbext = document.getElementById('uploadFile').value; //파일을 추가한 input 박스의 값

    thumbext = thumbext.slice(thumbext.indexOf(".") + 1).toLowerCase(); //파일 확장자를 잘라내고, 비교를 위해 소문자로 만듭니다.

    if(thumbext != "docx" && thumbext != "hwp" &&  thumbext != "pdf"){ //확장자를 확인합니다.
        alert("시나리오 업로드는 (docx, hwp, pdf))만 업로드 가능합니다.");
        return;
    }
    else{
        switch(thumbext){
            case "docx":
                docxToTxt();
                break;
            case "hwp":
                hwpToTxt();
                break;
            case "pdf":
                pdfToTxt();
                break;

        }
    }
}
function docxToTxt(){
    var mammoth = require("mammoth");

mammoth.extractRawText({path: "./hello.docx"})
    .then(function(result){
        var text = result.value; // The raw text 
        console.log(text);
        var messages = result.messages;
    })
    .done();
}