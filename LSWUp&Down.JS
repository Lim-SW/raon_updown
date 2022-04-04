function LoadLSWUpDown(id, divName){// 업다운로더 생성 함수
    LSWUpDownFileWaitList.prototype.wl = []; // 프로토타입으로 파일 오브젝트 보관
    LSWUpDownFileWaitList.prototype.IsIE = IsIE();
    var WaitList = new LSWUpDownFileWaitList();

    var width = '400';
    var height = '300';

    var up = LoadUI('Upload'); // 업로드 영역 UI 생성
    var dn = LoadUI('Download'); // 다운로드 영역 UI 생성
    
    var fileInput = AddB(up[1],'file','fileInput','파일추가'); // 업로드 영역 버튼+리스너
    fileInput.onchange = function(){Addfile(this,up[0]);}
    var exceptFile = AddB(up[1],'button','exceptFile','파일제외');
    exceptFile.onclick = function(){ControlFile(up[0],'except');}
    var clearList = AddB(up[1],'button','clearList','전부제외');
    clearList.onclick = function(){ClearList(up[0],'제외','',up[2]);}
    var startUpload = AddB(up[1],'button','startUpload','업로드시작');
    startUpload.onclick = function(){SendWaitList();}
    
    var refresh = AddB(dn[1],'button','refresh','불러오기'); // 다운로드영역 버튼+리스너
    refresh.onclick = function(){ListFiles(dn[0]);}
    var deleteFile = AddB(dn[1],'button','deleteFile','파일삭제');
    deleteFile.onclick = function(){ControlFile(dn[0],'delete')}
    var clearFiles = AddB(dn[1],'button','clearFiles','전부삭제');
    clearFiles.onclick = function(){ClearList(dn[0],'삭제','',dn[2]);}
    var startDownload = AddB(dn[1],'form','startDownload','다운로드시작');
    startDownload[1].onclick = function(){ControlFile(dn[0],'download')}

    // 여기부터 LoadLSWUpDown 에서만 사용할 함수들
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

        fileListDiv.ondrop = function(e){
            if(e.target.id=='UploadfileListDiv_'+id){DragDrop(e);}
            else{e.stopPropagation();e.preventDefault();}
        }
        fileListDiv.ondragover = function(e){e.stopPropagation();e.preventDefault();}
        fileListDiv.ondragleave = function(e){e.stopPropagation();e.preventDefault();}

        Place.addEventListener('load',function(){
            Place.contentDocument.body.appendChild(nameDiv);
            Place.contentDocument.body.appendChild(fileListDiv);
            Place.contentDocument.body.appendChild(modal);
            if(WaitList.IsIE){// IE용 사이즈 조절
            Place.contentDocument.body.style.marginRight = '0px';
            }
            Place.contentDocument.body.style.margin = '0';
            if(key=='Download'){ListFiles(fileListDiv);}
        })

        // modal 영역
        var modal = document.createElement('div');
        modal.id = 'modal';
        modal.className = 'modal-overlay';
        modal.style.display = 'none';

        var modalWindow = document.createElement('div');
        modalWindow.className = 'modal-window';

        var modalTitle = document.createElement('div');
        modalTitle.className = 'title';
        modalWindow.appendChild(modalTitle);
        var modalH2 = document.createElement('h2');
        modalH2.innerText = 'LSWUp&Down';
        modalTitle.appendChild(modalH2);

        var closeArea = document.createElement('div');
        closeArea.ir = 'closeArea';
        closeArea.className = 'close-area';
        closeArea.innerText = 'X';
        closeArea.onclick = function(){
            progressBar2.style.width = '0%';
            percent.innerText = '0%\n';
            modal.style.display = 'none';
        }
        modalWindow.appendChild(closeArea);

        // 진행바 영역
        var progressBar = document.createElement('div');
        progressBar.className = 'pregress-bar';
        progressBar.id = 'progressBar';
        var progressBar2 = document.createElement('div');
        progressBar2.className = 'progress-bar__bar';
        progressBar.appendChild(progressBar2);

        var percent = document.createElement('div');
        percent.id = 'percent';
        percent.innerText = '0%\n';
        
        modal.appendChild(modalWindow);
        modalWindow.appendChild(progressBar);
        modalWindow.appendChild(percent);

        // 모달 버튼
        CreateModalButton(modalWindow,'pauseB','실행취소');
        CreateModalButton(modalWindow,'no','아니오');
        CreateModalButton(modalWindow,'yes','예');

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
        
        return [fileListDiv, ButtonPlace_Div, modal];
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

    function AddB(where, buttonType, buttonId, buttonText){ // UI에 버튼추가
        var inputDiv = document.createElement('div');
        inputDiv.className = 'inputdiv';
        if(buttonType=='form'){
            var fileInput = document.createElement('form');
            fileInput.acceptCharset = "UTF-8";
            fileInput.method = 'post';
            fileInput.action = '/LSWUpDown/DownloadServlet';
            fileInput.target = '_self';
            fileInput.enctype = 'multipart/form-data'
        }
        else{var fileInput = document.createElement('input');
        fileInput.type = buttonType;}
        fileInput.id = buttonId;
        if(buttonType=='file'){fileInput.multiple = 'true';}
        var inputLabel = document.createElement('label');
        inputLabel.innerText = buttonText;
        inputLabel.htmlFor = buttonId;
        
        where.appendChild(inputDiv);
        inputDiv.appendChild(inputLabel);
        inputDiv.appendChild(fileInput);
        if(buttonType=='form'){
        return [fileInput,inputLabel]}

        return fileInput;
    }

    function BytesToSize(bytes) { // 파일크기 단위 변경
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
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
            var calSize = BytesToSize(tempF.size);
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
                WaitList.wl.push({'name':tempF.name, 'size':calSize, 'file':tempF, 'sizeN':tempF.size});
            }
        }
        same = '중복된 파일을 '+sameCount+same;
        if(th.files.length-sameCount != 0){
            same += ('\n중복되지 않은 '+(th.files.length-sameCount)+add);
        }
        if(sameCount>0){alert(same);}
        th.value = '';
    }

    function SendWaitList(again){ // 업로드 리스트에 있는 파일 업로드 시작
        var place = document.getElementById('UploadPlace_'+id);
        var modal = place.contentDocument.getElementById('modal');
        var pauseB = place.contentDocument.getElementById('pauseB');
        if(up[0].childNodes.length!=0){
            if(again != 'again'){
                ModalYesNo(modal,'파일을 업로드 하시겠습니까?\n(※리스트 전부 업로드 됩니다.※)',up[0]);
                modal.childNodes[0].childNodes[6].onclick = function(){
                    ResumeFunc(modal, pauseB);
                }
                modal.childNodes[0].childNodes[5].onclick = function(){
                    modal.style.display = 'none';
                }
            }
            else{
                ResumeFunc(modal, pauseB);
            }
        }
        else{
            alert('파일을 추가해주세요.');
        }
    }

    function DragDrop(e){ // 드래그 앤 드롭으로 업로드 리스트에 파일 추가
        e.preventDefault();
        Addfile(e.dataTransfer,up[0]);
    }

    function ListFiles(where){ // 다운로드 리스트에 파일 불러오기(새로고침)
        var req = new XMLHttpRequest();
        req.open('service','/LSWUpDown/RefreshServlet');
        req.send();
        
        req.onreadystatechange = function(){
            where.innerHTML = '';
            if (req.readyState == XMLHttpRequest.DONE&&req.status==200){
                var fileSplit = req.responseText.split('/');
                fileSplit.pop();
                for(var f=0;f<fileSplit.length;f+=2){
                    LoadFile(where, fileSplit[f], BytesToSize(fileSplit[f+1]));
                }
            }
            else if(req.status==500||req.status==404||req.status==403){
                alert("("+req.status+")오류가 발생하였습니다.");
            }
        }
    }

    function ControlFile(where, tag){ // 체크된 파일 컨트롤(제외,삭제,다운로드)
        var flag = 0;
        var controlList = [];
        var message = '';

        for(var u=0;u<where.childNodes.length;u++){
            if(where.childNodes[u].childNodes[0].checked){
                controlList.push(where.childNodes[u].childNodes[1].innerText);
                message += '\n>>> '+where.childNodes[u].childNodes[1].innerText;
                flag = 1;
            }
        }

        if(tag == 'download'){
            var LSW_RANDOM_NUMBER = Math.floor(Math.random() * 1000000);
            controlList.push(LSW_RANDOM_NUMBER);
        }
        
        if(flag==1){
            var yesorno = null;
            if(tag=='delete'){yesorno=confirm('체크된 항목을 삭제하시겠습니까?\n(※실제 서버에서 삭제됩니다.※)\n'+message);}
            else if(tag=='download'){yesorno=confirm('체크된 항목을 다운로드 하시겠습니까?\n'+message);}
            else if(tag=='except'){yesorno=confirm('체크된 항목을 제외하시겠습니까?\n'+message);}

            if(yesorno!=null&&yesorno){
                if(tag=='except'){
                    var place = document.getElementById('UploadPlace_'+id);
                    for(var l=0;l<WaitList.wl.length;l++){
                        for(var e=0;e<controlList.length;e++){
                            if(WaitList.wl[l].name == controlList[e]){
                                var ed = place.contentDocument.getElementById(WaitList.wl[l].name+' '+WaitList.wl[l].size);
                                where.removeChild(ed);
                                WaitList.wl.splice(l,1);
                                e--;l--;break;
                            }
                        }
                    }
                    alert('체크된 항목을 제외하였습니다.\n'+message);
                }
                else{
                    var place = document.getElementById('DownloadPlace_'+id);
                    var modal = place.contentDocument.getElementById('modal');
                    var pauseB = place.contentDocument.getElementById('pauseB');
                    var req = new XMLHttpRequest();
                    var formData = new FormData();
            
                    for(var w=0;w<controlList.length;w++){
                        formData.append('name'+w,controlList[w]);
                        var temptemp = document.createElement('input');
                        temptemp.type = 'hidden';
                        temptemp.name = 'name'+w;
                        temptemp.value = controlList[w];
                        startDownload[0].appendChild(temptemp);
                        }
                    
                    
                    if(tag=='delete'){req.open('service','/LSWUpDown/DeleteServlet');req.send(formData);}
                    else if(tag=='download'){
                        ModalOn(modal,dn[0],'down');
                        startDownload[0].submit();
                        var isZip = w>2;
                        var intv = setInterval(function(){
                            Percent(modal,isZip,LSW_RANDOM_NUMBER);
                            if(modal.childNodes[0].childNodes[3].innerText=="파일 다운로드가 완료되었습니다. 100.0%"){
                                clearInterval(intv);
                                startDownload[0].innerHTML = "";
                                ModalOff(modal,"파일 다운로드가 완료되었습니다. 100.0%",up[0]);
                                modal.childNodes[0].childNodes[2].childNodes[0].style.width = '100%';
                                ListFiles(dn[0]);
                            }},500);
                    }
                    pauseB.onclick = function(){
                        if(req.readyState != XMLHttpRequest.DONE){
                            req.abort();
                            clearInterval(intv);
                            ModalOff(modal,"파일 다운로드가 중단되었습니다.",up[0]);
                        }
                    }
                    req.onreadystatechange = function(){
                        if (req.readyState == XMLHttpRequest.DONE&&req.status==200){
                            ListFiles(dn[0]);
                            if(tag=='delete'){alert('체크된 항목을 삭제하였습니다.\n'+message);}
                        }
                        else if(req.status==500||req.status==404||req.status==403){
                            ModalOff(modal,"("+req.status+")오류가 발생하였습니다.",up[0]);
                        }
                    }
                }
            }
        }
        else{
            alert('체크된 항목이 없습니다.');
        }
    }

    function ClearList(where,str,yn,modal) { // 업로드, 다운로드 리스트 초기화
        if(where.childNodes.length!=0){
            if(yn!='no'){
                if(str=='제외'){ModalYesNo(modal,'전부 '+str+'하시겠습니까?',up[0]);}
                else{ModalYesNo(modal,'전부 '+str+'하시겠습니까?',dn[0]);}
                modal.childNodes[0].childNodes[6].onclick = function(){
                    if(str=='제외'){
                        where.innerHTML='';
                        WaitList.wl = [];
                        ModalOff(modal,"전부 제외되었습니다.",up[0]);
                    }
                    else if(str=='삭제'){
                        var req = new XMLHttpRequest();
                        var formData = new FormData();
    
                        for(var u=0;u<where.childNodes.length;u++){
                            formData.append('name'+u,where.childNodes[u].childNodes[1].innerText);
                        }
    
                        ModalOn(modal,dn[0]);
                        req.open('service','/LSWUpDown/DeleteServlet');
                        req.send(formData);
                        req.onreadystatechange = function(){
                            if (req.readyState == XMLHttpRequest.DONE&&req.status==200){
                                ModalOff(modal,"전부 삭제되었습니다.",dn[0]);
                                ListFiles(dn[0]);
                            }
                            else if(req.status==500||req.status==404||req.status==403){
                                ModalOff(modal,"("+req.status+")오류가 발생하였습니다.",dn[0]);
                            }
                        }
                    }
                }
                modal.childNodes[0].childNodes[5].onclick = function(){
                    modal.style.display = 'none';
                }
            }
            else{
                where.innerHTML='';
                WaitList.wl = [];
            }
        }
        else{
            alert(str+'할 항목이 없습니다.');
        }
    }
    
    function DownloadFiles(response,fn,isZip){ // response로 blob url 생성후 다운로드 (※브라우저에서 메모리 많이씀)
        if(isZip>1){
            fn = "LSWUp&Down_"
            var today = new Date();
            fn += today.toLocaleString();
            fn+=".zip";
            if(WaitList.IsIE){fn = encodeURI(fn);}
            else{
                fn = fn.replace('.','년');
                fn = fn.replace('.','월');
                fn = fn.replace('.','일');
            }
        }
        var blob = response;
        var element = document.createElement('a');
        element.href = window.URL.createObjectURL(blob);
        element.download = fn;
        document.body.appendChild(element);
        if(WaitList.IsIE){navigator.msSaveOrOpenBlob(blob,fn);}
        else{element.click();}
        document.body.removeChild(element);
    }

    function Percent(modal,isZip,LSW_RANDOM_NUMBER){ // 진행률 request 함수 interval로 사용
        var req2 = new XMLHttpRequest();
        req2.open('GET','/LSWUpDown/DownloadServlet?'+"num="+LSW_RANDOM_NUMBER);
        var percent = 0;
        req2.send();
        req2.onreadystatechange = function(){
            if (req2.readyState == XMLHttpRequest.DONE&&req2.status==200){
                percent = req2.responseText;
                if(isZip==true){modal.childNodes[0].childNodes[3].innerText = "서버에서 파일을 압축중입니다. "+percent+"%";}
                else{modal.childNodes[0].childNodes[3].innerText = percent+"%";}
                if(percent==100.0){modal.childNodes[0].childNodes[3].innerText = "파일 다운로드가 완료되었습니다. 100.0%";ListFiles(dn[0]);}
                modal.childNodes[0].childNodes[2].childNodes[0].style.width = percent+"%";
            }
        }
    }

    function CreateModalButton(modalWindow, id, innerText){ // modal에 필요한 버튼 생성
        var modalButton = document.createElement('button');
        modalButton.id = id;
        modalButton.innerText = innerText;
        modalButton.style.display = 'none';
        modalWindow.appendChild(modalButton);
    }

    function ModalYesNo(modal,message,where){ // 컨펌모달
        modal.childNodes[0].childNodes[3].innerText = message;
        modal.childNodes[0].childNodes[1].style.display ='none';
        modal.childNodes[0].childNodes[4].style.display ='none';
        modal.childNodes[0].childNodes[5].style.display ='flex';
        modal.childNodes[0].childNodes[6].style.display ='flex';
        modal.style.display = 'flex';
        if(WaitList.IsIE){where.parentNode.scrollTop = 0;}
        else{where.parentNode.scrollTo(0,0);}
    }

    function ModalOn(modal,where,down){ // 켜는모달
        modal.childNodes[0].childNodes[1].style.display ='none';
        if(down=='down'){modal.childNodes[0].childNodes[4].style.display ='none';}
        else{modal.childNodes[0].childNodes[4].style.display ='flex';}
        modal.childNodes[0].childNodes[5].style.display ='none';
        modal.childNodes[0].childNodes[6].style.display ='none';
        modal.style.display = 'flex';
        if(WaitList.IsIE){where.parentNode.scrollTop = 0;}
        else{where.parentNode.scrollTo(0,0);}
    }

    function ModalOff(modal,message,where){ // 끄는모달
        modal.childNodes[0].childNodes[3].innerText = message;
        modal.childNodes[0].childNodes[1].style.display ='flex';
        modal.childNodes[0].childNodes[4].style.display ='none';
        modal.childNodes[0].childNodes[5].style.display ='none';
        modal.childNodes[0].childNodes[6].style.display ='none';
        if(WaitList.IsIE){where.parentNode.scrollTop = 0;}
        else{where.parentNode.scrollTo(0,0);}
    }

    function ResumeFunc(modal, pauseB){ // 이어올리기 기능
        var filename = WaitList.wl[0].name;
        if (filename.length>12){filename = filename.substring(0,12)+"....";}
        var formData = new FormData();
        var checkForm = new FormData();
        formData.append('name',WaitList.wl[0].name);
        formData.append('size',WaitList.wl[0].size);
        formData.append(WaitList.wl[0].name+' size',WaitList.wl[0].sizeN);
        formData.append(WaitList.wl[0].name,WaitList.wl[0].file);
        checkForm.append('name',WaitList.wl[0].name);
        checkForm.append(WaitList.wl[0].name,WaitList.wl[0].sizeN);
    
        var checkReq = new XMLHttpRequest();
        checkReq.open("POST", '/LSWUpDown/CheckServlet');
        checkReq.send(checkForm);
        checkReq.onreadystatechange = function(){
            if(checkReq.readyState == XMLHttpRequest.DONE&&checkReq.status==200){
                if(checkReq.responseText!=""){
                    var res = checkReq.responseText.split('/');
                    if(res[0].length>12){res[0] = res[0].substring(0,12)+"....";}
                    var percent = '"'+res[0]+'" ☞ '+res[1]+"%";
                    ModalYesNo(modal,"이어서 올리시겠습니까?\n"+percent,up[0]);

                    modal.childNodes[0].childNodes[6].onclick = function(){
                        //이어올리기 해야됨
                        //2. 체크 한만큼 슬라이스
                        var start = res[2];
                        var chunk = WaitList.wl[0].file.slice(start, WaitList.wl[0].sizeN);
                        //3. 슬라이스 한걸 다시 보냄 (다른 서블릿에 해야할듯)
                        var resume = new XMLHttpRequest();
                        var resumeF = new FormData();
                        resumeF.append('name',WaitList.wl[0].name);
                        resumeF.append('chunk',chunk);
                        resumeF.append('size',WaitList.wl[0].sizeN);
                        ModalOn(modal,dn[0]);
                        resume.open('POST','/LSWUpDown/ResumeServlet');
                        resume.upload.onprogress = function(e){
                            var percentComplete = (e.loaded+Number(start)) / WaitList.wl[0].sizeN;
                            percentComplete *= 100;
                            percentComplete = percentComplete.toFixed(2);
                            modal.childNodes[0].childNodes[2].childNodes[0].style.width = percentComplete+"%";
                            modal.childNodes[0].childNodes[3].innerText = filename+" ☞ "+percentComplete+"%";
                        }
                        resume.send(resumeF);
                        pauseB.onclick = function(){
                            if(resume.readyState != XMLHttpRequest.DONE){
                                resume.abort();
                                ModalOff(modal,"파일 업로드가 중단되었습니다.",up[0]);
                            }
                        }
                        resume.onreadystatechange = function(){
                            if (resume.readyState == XMLHttpRequest.DONE&&resume.status==200){
                                if(WaitList.IsIE){var temp = modal.parentElement.childNodes[1].childNodes[0];temp.parentNode.removeChild(temp);}
                                else{modal.parentElement.childNodes[1].childNodes[0].remove();}
                                ListFiles(dn[0]);
                                modal.childNodes[0].childNodes[2].childNodes[0].style.width = '100%';
                                WaitList.wl.shift();
                                if(WaitList.wl.length!=0){
                                    SendWaitList('again');
                                }
                                else{
                                    ModalOff(modal,"파일 업로드가 완료되었습니다. 100.0%",up[0]);
                                }
                            }
                            else if(resume.status==500||resume.status==404||resume.status==403){
                                ModalOff(modal,"("+resume.status+")오류가 발생하였습니다.",up[0]);
                            }
                        }
                    }
                    modal.childNodes[0].childNodes[5].onclick = function(){
                        UploadFunc(modal,formData,pauseB);
                    }
                }
                else{
                    UploadFunc(modal,formData,pauseB);
                }
            }
        }
    }

    function UploadFunc(modal,formData,pauseB){ // 업로드 리퀘스트 및 프로세스 함수화
        ModalOn(modal,up[0]);
        var filename = WaitList.wl[0].name;
        if (filename.length>12){filename = filename.substring(0,12)+"....";}
        var req = new XMLHttpRequest();
        req.open("POST", '/LSWUpDown/UploadServlet');
        req.upload.onprogress = function(e){
            if (e.lengthComputable) {
                var percentComplete = e.loaded / e.total;
                percentComplete *= 100;
                percentComplete = percentComplete.toFixed(2);
                modal.childNodes[0].childNodes[2].childNodes[0].style.width = percentComplete+"%";
                modal.childNodes[0].childNodes[3].innerText = filename+" ☞ "+percentComplete+"%";
            }
        }
        req.send(formData);
        req.onreadystatechange = function(){
            if(req.readyState == XMLHttpRequest.DONE&&req.status==200){
                if(WaitList.IsIE){var temp = modal.parentElement.childNodes[1].childNodes[0];temp.parentNode.removeChild(temp);}
                else{modal.parentElement.childNodes[1].childNodes[0].remove();}
                ListFiles(dn[0]);
                modal.childNodes[0].childNodes[2].childNodes[0].style.width = '100%';
                WaitList.wl.shift();
                if(WaitList.wl.length!=0){
                    SendWaitList('again');
                }
                else{
                    ModalOff(modal,"파일 업로드가 완료되었습니다. 100.0%",up[0]);
                }
            }
            else if(req.status==500||req.status==404||req.status==403){
                ModalOff(modal,"("+req.status+")오류가 발생하였습니다.",up[0]);
            }
        }
        pauseB.onclick = function(){
            if(req.readyState != XMLHttpRequest.DONE){
                req.abort();
                ModalOff(modal,"파일 업로드가 중단되었습니다.",up[0]);
            }
        }
    }
}