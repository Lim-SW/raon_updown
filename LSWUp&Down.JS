function LoadLSWUpDown(id, width, height, divName){// 에디터 생성 함수
    LSWUpDownFileWaitList.prototype.wl = []; // 프로토타입으로 파일 오브젝트 보관
    LSWUpDownFileWaitList.prototype.IsIE = IsIE();
    var WaitList = new LSWUpDownFileWaitList();

    var up = LoadUI('Upload');
    var dn = LoadUI('Download');

    var fileInput = AddB(up[1],'file','fileInput','파일추가');
    fileInput.onchange = function(){Addfile(this,up[0]);}
    var exceptFile = AddB(up[1],'button','exceptFile','파일제외');
    exceptFile.onclick = function(){ExceptFile(up[0]);}
    var startUpload = AddB(up[1],'button','startUpload','업로드시작');
    startUpload.onclick = function(){SendWaitList();}
    
    var refresh = AddB(dn[1],'button','refresh','불러오기');
    refresh.onclick = function(){ListFiles(dn[0]);}
    var deleteFile = AddB(dn[1],'button','deleteFile','파일삭제');
    deleteFile.onclick = function(){DeleteFile(dn[0])}
    var startDownload = AddB(dn[1],'button','startDownload','다운로드시작');
    startDownload.onclick = function(){/*함수 추가해야함*/}

    function LSWUpDownFileWaitList() {// 파일 오브젝트 프로토타입용 함수
    }

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
        fileListDiv.draggable = 'true';
        
        fileListDiv.ondrop = function(e){DragDrop(e);}
        fileListDiv.ondragover = function(e){e.stopPropagation();e.preventDefault();}
        fileListDiv.ondragleave = function(e){e.stopPropagation();e.preventDefault();}

        Place.addEventListener('load',function(){
            Place.contentDocument.body.appendChild(nameDiv);
            Place.contentDocument.body.appendChild(fileListDiv);
            if(WaitList.IsIE){// IE용 사이즈 조절
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
        
        return [fileListDiv, ButtonPlace_Div];
    }

    function IsIE() { // 브라우저 IE 체크 함수
        var agent = navigator.userAgent.toLowerCase();
        return (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1);
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
        tempFileDiv.id = fn+' '+fs;
        var checkBox = document.createElement('input');
        checkBox.className = 'checkboxblock';
        checkBox.type = 'checkbox';
        checkBox.style.float = 'left';
        checkBox.style.overflow = 'auto';
        if(WaitList.IsIE){checkBox.style.width = '17px';}
        checkBox.style.marginTop = '2px';
        tempFileDiv.appendChild(checkBox);
        var span = document.createElement('span');
        span.className = 'nameblock';
        span.innerText = fn;
        tempFileDiv.appendChild(span);
        var fileSize = document.createElement('span');
        fileSize.className = 'sizeblock';
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

    function Addfile(th, where){ // 파일추가 기능
        var same = '개 제외하였습니다.\n';
        var add = '개의 파일을 추가하였습니다.\n';
        var sameCount = 0;
        for(var f=0;f<th.files.length;f++){
            var tempF = th.files[f];
            var calSize = bytesToSize(tempF.size);
            var flag = 0;
            for(var u=0;u<where.childNodes.length;u++){
                if(where.childNodes[u].childNodes[1].innerText == tempF.name && where.childNodes[u].childNodes[2].innerText == calSize){
                    same += ('>>> '+tempF.name+'\n');
                    sameCount += 1;
                    flag = 1;
                    break;
                }
            }
            if(flag == 0){
                add+=('>>> '+tempF.name+'\n');
                LoadFile(where, tempF.name, calSize);
                WaitList.wl.push({'name':tempF.name, 'size':calSize, 'file':tempF});
            }
        }
        same = '중복된 파일을 '+sameCount+same;
        if(th.files.length-sameCount != 0){
            same += ('\n중복되지 않은 '+(th.files.length-sameCount)+add);
        }
        if(sameCount>0){alert(same);}
        th.value = '';
    }

    function ExceptFile(where){ // 파일제외 기능
        var place = document.getElementById('UploadPlace_'+id);
        var flag = 0;
        var exceptList = [];
        var message = '';
        for(var u=0;u<where.childNodes.length;u++){
            if(where.childNodes[u].childNodes[0].checked){
                exceptList.push(where.childNodes[u].childNodes[1].innerText);
                message += '\n>>> '+where.childNodes[u].childNodes[1].innerText;
                flag = 1;
            }
        }
        
        if(flag==1){
            var yesorno = confirm('체크된 항목을 제외하시겠습니까?'+message);
            if(yesorno){
                for(var l=0;l<WaitList.wl.length;l++){
                    for(var e=0;e<exceptList.length;e++){
                        if(WaitList.wl[l].name == exceptList[e]){
                            var ed = place.contentDocument.getElementById(WaitList.wl[l].name+' '+WaitList.wl[l].size);
                            where.removeChild(ed);
                            WaitList.wl.splice(l,1);
                            e--;l--;break;
                        }
                    }
                }
                alert('체크된 항목을 제외하였습니다.'+message);
            }
        }
        else{
            alert('체크된 항목이 없습니다.');
        }
    }

    function SendWaitList(){
        var req = new XMLHttpRequest();
        var formData = new FormData();
        var yesorno = confirm('파일을 업로드 하시겠습니까?\n(※리스트에 존재하는 모든 파일들이 업로드 됩니다.※)');
        if(yesorno){
            for(var w=0;w<WaitList.wl.length;w++){
                formData.append('name'+w,WaitList.wl[w].name);
                formData.append('size'+w,WaitList.wl[w].size);
                formData.append(WaitList.wl[w].name,WaitList.wl[w].file);
            }
    
            if(w!=0){
                req.open("POST", '/LSWUpDown/UploadServlet');
                req.send(formData);
            }
    
            req.onreadystatechange = function(){
                if (req.readyState == XMLHttpRequest.DONE&&req.status==200&&dn[0].childNodes.length!=0){
                    ListFiles(dn[0]);
                }
                if(req.readyState == XMLHttpRequest.DONE&&req.status==200){
                    alert('파일 업로드가 완료되었습니다.');
                }
            }
        }

        // req.onreadystatechange = callbackFunction; 응답수행
        // 프로그래스 바 연결 받아서 띄워야 하나?? 그럼 계속 연결 하고 있어야 할듯??
        // 프로그래스 바를 여기서 처리해야되나 저기서 해야되나?
        // 성공응답 받으면 알림띄우기

    }

    function DragDrop(e){
        e.preventDefault();
        Addfile(e.dataTransfer);
    }

    function ListFiles(where){
        var req = new XMLHttpRequest();
        req.open('service','/LSWUpDown/RefreshServlet');
        req.send();
        
        req.onreadystatechange = function(){
            where.innerHTML = '';
            if (req.readyState == XMLHttpRequest.DONE&&req.status==200){
                var fileSplit = req.responseText.split('/');
                fileSplit.pop();
                for(var f=0;f<fileSplit.length;f+=2){
                    LoadFile(where, fileSplit[f], bytesToSize(fileSplit[f+1]));
                }
            }
        }
    }

    function DeleteFile(where){
        var flag = 0;
        var deleteList = [];
        var message = '';
        for(var u=0;u<where.childNodes.length;u++){
            if(where.childNodes[u].childNodes[0].checked){
                deleteList.push(where.childNodes[u].childNodes[1].innerText);
                message += '\n>>> '+where.childNodes[u].childNodes[1].innerText;
                flag = 1;
            }
        }
        
        if(flag==1){
            var yesorno = confirm('체크된 항목을 삭제하시겠습니까?\n(※실제 서버에서 삭제됩니다.※)\n'+message);
            if(yesorno){
                var req = new XMLHttpRequest();
                var formData = new FormData();
        
                for(var w=0;w<deleteList.length;w++){
                    formData.append('name'+w,deleteList[w]);
                }

                req.open('service','/LSWUpDown/DeleteServlet');
                req.send(formData);
                req.onreadystatechange = function(){
                    if (req.readyState == XMLHttpRequest.DONE&&req.status==200){
                        ListFiles(dn[0]);
                        alert('체크된 항목을 삭제하였습니다.'+message);
                    }
                }
            }
        }
        else{
            alert('체크된 항목이 없습니다.');
        }
    }
}