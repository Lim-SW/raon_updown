function LoadLSWUpDown(id, width, height, divName){// 에디터 생성 함수
    LSW = [];

    var upBP = LoadUI('Upload');
    var dnBP = LoadUI('Download');

    var fileInput = AddB(upBP,'file','fileInput','파일추가');
    fileInput.onchange = function(e){Addfile(this);}
    var fileInput = AddB(upBP,'button','exceptFile','파일제외');
    fileInput.onchange = function(e){/*함수 추가해야함*/}
    var fileInput = AddB(upBP,'button','startUpload','업로드시작');
    fileInput.onchange = function(e){/*함수 추가해야함*/}

    
    var fileInput = AddB(dnBP,'button','refresh','불러오기');
    fileInput.onchange = function(e){/*함수 추가해야함*/}
    var fileInput = AddB(dnBP,'button','deleteFile','파일삭제');
    fileInput.onchange = function(e){/*함수 추가해야함*/}
    var fileInput = AddB(dnBP,'button','startDownload','다운로드시작');
    fileInput.onchange = function(e){/*함수 추가해야함*/}

    //var formData = new FormData();

    function LoadUI(key){ // UI 불러오기
        // div
        var Div = document.createElement('div');
        Div.id = key+'Div_'+id;
        Div.style.width = width+'px';
        Div.style.height = height+'px';
        Div.style.border = '2px solid gray';
        Div.style.overflow = 'hidden';
        Div.style.marginTop = '5px';
        var clientDiv = document.getElementById(divName);
        clientDiv.appendChild(Div); // 받아온 div아래에 추가

        // 창
        var Place = document.createElement('iframe');
        Place.id = key+'Place_'+id;
        Place.src = 'about:blank';
        Place.frameBorder = 0;
        Place.style.width = width+'px';
        Place.style.height = height-40+'px';

        // 윗부분
        var nameDiv = document.createElement('div');
        nameDiv.className = 'nameLabel';
        nameDiv.innerText = key;
        var label = document.createElement('span');
        label.className = 'createLabel';
        label.innerText = 'LSWUp&Down';
        nameDiv.appendChild(label);

        // 파일부분
        var fileListDiv = document.createElement('div');
        fileListDiv.className = 'fileList';
        fileListDiv.id = key+'fileListDiv_'+id;

        Place.addEventListener('load',function(){
            Place.contentDocument.body.appendChild(nameDiv);
            Place.contentDocument.body.appendChild(fileListDiv);
            if(IsIE()){// IE용 사이즈 조절
            Place.contentDocument.body.style.marginRight = '0px';
            }
            Place.contentDocument.body.style.margin = '0';
        })

        // 버튼영역
        var ButtonPlace = document.createElement('iframe');
        ButtonPlace.id = key+'ButtonPlace_'+id;
        ButtonPlace.frameBorder = 0;
        ButtonPlace.style.height = '40px';
        ButtonPlace.style.width = width+'px';
        ButtonPlace.style.background = '#31648c';
        ButtonPlace.style.paddingTop = '0';

        var ButtonPlace_Div = document.createElement('div');
        ButtonPlace_Div.id = key+'ButtonPlace_Div_'+id;
        ButtonPlace_Div.className = key+'ButtonPlace_Div';
        
        ButtonPlace.addEventListener('load',function(){
            ButtonPlace.contentDocument.body.appendChild(ButtonPlace_Div);
            ButtonPlace.contentDocument.body.style.overflow = 'hidden'; // 버튼영역 늘어남 방지

            LoadCSS(Place);
            LoadCSS(ButtonPlace);
        })

        // 붙히기
        Div.appendChild(Place);
        Div.appendChild(ButtonPlace);

        return ButtonPlace_Div;
    }

    function IsIE() { // 브라우저 IE 체크 함수
        return document.all || (!!window.MSInputMethodContext && !!document.documentMode);
    }

    function LoadCSS(where){ // 해당영역의 iframe에 CSS 로드함수
        var cssLink = document.createElement("link");
        cssLink.href = "LSWUp&Down.css";  
        cssLink.rel = "stylesheet";
        cssLink.type = "text/css"; 
        where.contentDocument.head.appendChild(cssLink);
    }
    
    function LoadFile(where, fn, fs){ // 파일 리스트에 올리기
        var tempFileDiv = document.createElement('div');
        tempFileDiv.className = 'filelistselect';
        var checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.style.float = 'left';
        checkBox.style.overflow = 'auto';
        if(IsIE()){checkBox.style.width = '17px';}
        checkBox.style.marginTop = '2px';
        tempFileDiv.appendChild(checkBox);
        var span = document.createElement('span');
        span.innerText = fn;
        tempFileDiv.appendChild(span);
        var fileSize = document.createElement('span');
        fileSize.innerText = fs;
        fileSize.style.float = 'right';
        tempFileDiv.appendChild(fileSize);

        where.appendChild(tempFileDiv);
    }

    function AddB(where, buttonType, buttonId, buttonText){ // 버튼추가
        var inputDiv = document.createElement('div');
        inputDiv.className = 'inputdiv';
        var fileInput = document.createElement('input');
        fileInput.type = buttonType;
        fileInput.id = buttonId;
        if(buttonType=='file'){fileInput.multiple = 'true';}
        var inputLabel = document.createElement('label');
        inputLabel.innerText = buttonText;
        inputLabel.htmlFor = buttonId;
        
        where.appendChild(inputDiv);
        inputDiv.appendChild(inputLabel);
        inputDiv.appendChild(fileInput);

        return fileInput;
    }

    function bytesToSize(bytes) { // 파일크기 단위 변경
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    function Addfile(th){
        var place = document.getElementById('UploadPlace_'+id);
        var upFL = place.contentDocument.getElementById('UploadfileListDiv_'+id);
        var same = '개 제외하였습니다.\n';
        var add = '개의 파일을 추가하였습니다.\n';
        var sameCount = 0;
        for(var f=0;f<th.files.length;f++){
            var tempF = th.files[f];
            var calSize = bytesToSize(tempF.size);
            var flag = 0;
            for(var u=0;u<upFL.childNodes.length;u++){
                if(upFL.childNodes[u].childNodes[1].innerText == tempF.name && upFL.childNodes[u].childNodes[2].innerText == calSize){
                    same += ('>>> '+tempF.name+'\n');
                    sameCount += 1;
                    flag = 1;
                    break;
                }
            }
            if(flag == 0){
                add+=('>>> '+tempF.name+'\n');
                LoadFile(upFL, tempF.name, calSize);
                // 여기서 파일객체를 어디다 매달아야되는데 음.... 그걸 FormData 형식으로 해서 전송하면 되나?
                LSW.push({'name':tempF.name, 'size':calSize, 'file':tempF}); // 이렇게?
            }
        }
        same = '중복된 파일을 '+sameCount+same;
        if(th.files.length-sameCount != 0){
            same += ('\n중복되지 않은 '+(th.files.length-sameCount)+add);
        }
        if(sameCount>0){alert(same);}
        th.value = '';
    }
}