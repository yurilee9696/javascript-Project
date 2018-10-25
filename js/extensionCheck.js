var thumbext='';
function check(){
    if(!thumbext){
        alert("파일을 선택해주세요");
        return false;
    }
    else{
        var extension = thumbext.slice(thumbext.indexOf(".") + 1).toLowerCase(); //파일 확장자를 잘라내고, 비교를 위해 소문자로 만듭니다.
        if(extension != "docx" && extension != "doc" &&  extension != "pdf" && extension != "hwp"){ //확장자를 확인합니다.
            document.getElementById('upload-submit').disabled = true;
            document.getElementById('select-file-name').innerHTML='';
            alert("업로드는 (docx, doc, hwp, pdf))만 가능합니다.");
            return false;
        }
        else{
            return true;
        }
    }
}
function fileSelect(){
    thumbext = document.getElementById('uploadFile').value; //파일을 추가한 input 박스의 값
    var fileName = thumbext.slice(thumbext.lastIndexOf("\\") + 1); //파일명과 확장자 출력
    document.getElementById('select-file-name').innerHTML=fileName;
    document.getElementById('upload-submit').disabled = false;
    
}