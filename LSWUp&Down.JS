function LSWUpDownPrototype(divId,id,width,height,option,bp,loaded) { // 프로토타입 객체
    if(width!=undefined){this.option.width = width;}
    else{this.option.width = 400;}
    if(height!=undefined){this.option.height = height;}
    else{this.option.height = 300;}
    if(id!=undefined){this.option.id = id;}
    if(divId!=undefined){this.option.divId = divId;}
    if(option!=undefined){this.option.option = option;}
    else{this.option.option = 'both';}
    if(bp!=undefined){this.option.bp = bp;}
    else{this.option.bp = 0;}
    if(loaded!=undefined){this.option.loaded = loaded; this.eventList.OnIframeLoaded_LSW = loaded;}
    else{this.option.loaded = function(Iframe){ // 온로드 기본함수, 생성한 Iframe를 제공
        console.log("Default onload message id="+LSWUpDownPrototype.prototype.option.id+", option="+LSWUpDownPrototype.prototype.option.option);
        console.log(Iframe);
        }
        this.eventList.OnIframeLoaded_LSW = this.option.loaded;
    }

    var agent = navigator.userAgent.toLowerCase();
    this.option.isIE = (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1);
    
    if (LSWUpDownPrototype.prototype.option.wl==null){
        var map = new Map();
        LSWUpDownPrototype.prototype.option.wl = map;
    }
    LSWUpDownPrototype.prototype.option.wl.set(id,[]);

    if (LSWUpDownPrototype.prototype.option.result==null){
        var map = new Map();
        LSWUpDownPrototype.prototype.option.result = map;
    }
    LSWUpDownPrototype.prototype.option.result.set(id,[]);

    this.loadFunc.LoadLSWUpDown();

}

LSWUpDownPrototype.prototype.option = { // 객체의 옵션(정보) (유저가 설정 or 기본값)
    divId:"", // 붙힐 div의 id값(필수)
    id:"LSWUpDownDefaultID", // id값(필수)
    width:400, // 창 너비
    height:300, // 창 높이
    option:"both", // 생성하는 옵션 (업로드만, 다운로드만, 둘다)
    bp:0, // 0 = 버튼있이, 1 = 버튼없이(버튼은 알아서 커스텀)
    loaded:function(Iframe){ // 온로드 기본함수, 생성한 Iframe를 제공
        console.log("Default onload message id="+this.id+", option="+this.option);
        console.log(Iframe);
    },

    isIE:false, // IE인지 브라우저 체크
    wl:null, // 파일 업로드 대기목록 (각 id별로 독립된 리스트를 부여합니다.)
    result:null // event 함수용 return을 담는 목록 (각 id별로 독립된 리스트를 부여합니다.)
}

LSWUpDownPrototype.prototype.loadFunc = { // UI 생성 및 업&다운로드 기능 생성 (프로토타입 객체의 정보로 생성)
    LoadLSWUpDown : function () {
        // 프로토타입 객체의 설정값 가져오기

        var divId = LSWUpDownPrototype.prototype.option.divId;
        if(divId==undefined){
            alert("LSWUp&Down\n※Parameter에 divId는 필수 입력값 입니다.※\n");
            return 0;
        }
        var id = LSWUpDownPrototype.prototype.option.id;
        if(id==undefined){
            alert("LSWUp&Down\n※Parameter에 id는 필수 입력값 입니다.※\n");
            return 0;
        }
        var width = LSWUpDownPrototype.prototype.option.width;
        var height = LSWUpDownPrototype.prototype.option.height;
        var option = LSWUpDownPrototype.prototype.option.option;
        var bp = LSWUpDownPrototype.prototype.option.bp;

        if (option == 'Upload' || option == 'both') { // 업로드 영역 UI 생성
            if(document.getElementById("UploadDiv_"+id)!=undefined){
                alert("LSWUp&Down\n※중복된 id를 입력하셨습니다.※\nUploadDiv_"+id+"는 이미 존재합니다.\n※Error: ID="+id+"가 중복입니다.※");
                return 0;
            }
            var up = LoadUI('Upload', bp); 
            if(bp==0&&up!=0){
                var fileInput = AddB(up[1], 'file', 'fileInput', '파일추가'); // 업로드 영역 버튼+리스너
                fileInput.onchange = function () {LSWUpDownPrototype.prototype.funcList.Addfile(this, up[0],LSWUpDownPrototype.prototype.option.wl.get(id));}
                var exceptFile = AddB(up[1], 'button', 'exceptFile', '파일제외');
                exceptFile.onclick = function () { LSWUpDownPrototype.prototype.funcList.ControlFile(up[0], 'except', id, LSWUpDownPrototype.prototype.option.wl.get(id));}
                var clearList = AddB(up[1], 'button', 'clearList', '전부제외');
                clearList.onclick = function () { LSWUpDownPrototype.prototype.funcList.ClearList(up[0], '제외', '', up[2],id);}
                var startUpload = AddB(up[1], 'button', 'startUpload', '업로드시작');
                startUpload.onclick = function () { LSWUpDownPrototype.prototype.funcList.SendWaitList('',id,up[0],up[1],LSWUpDownPrototype.prototype.option.wl.get(id),LSWUpDownPrototype.prototype.option.result.get(id)); }
            }
        }

        if (option == 'Download' || option == 'both') { // 다운로드 영역 UI 생성
            if(document.getElementById("DownloadDiv_"+id)!=undefined){
                alert("LSWUp&Down\n※중복된 id를 입력하셨습니다.※\nDownloadDiv_"+id+"는 이미 존재합니다.\n※Error: ID="+id+"가 중복입니다.※");
                return 0;
            }
            var dn = LoadUI('Download', bp);
            if(bp==0&&dn!=0){
                var refresh = AddB(dn[1], 'button', 'refresh', '불러오기'); // 다운로드영역 버튼+리스너
                refresh.onclick = function () {
                    var postNum = prompt('게시글 번호를 입력해주세요');
                    if(postNum!=null&&postNum!=""&&postNum.indexOf('.')==-1){
                        //console.log(postNum);
                        LSWUpDownPrototype.prototype.funcList.ListFiles(dn[0], postNum);
                    }
                }
                var deleteFile = AddB(dn[1], 'button', 'deleteFile', '파일삭제');
                deleteFile.onclick = function () { LSWUpDownPrototype.prototype.funcList.ControlFile(dn[0], 'delete',id,LSWUpDownPrototype.prototype.option.wl.get(id),dn[1]); }
                var clearFiles = AddB(dn[1], 'button', 'clearFiles', '전부삭제');
                clearFiles.onclick = function () { LSWUpDownPrototype.prototype.funcList.ClearList(dn[0], '삭제', '', dn[2],id); }
                var startDownload = AddB(dn[1], 'form', 'startDownload', '다운로드시작');
                startDownload[1].onclick = function () {
                    LSWUpDownPrototype.prototype.funcList.ControlFile(dn[0],'download',id,LSWUpDownPrototype.prototype.option.wl.get(id),startDownload,dn[1]);
                }
            }
        }

        // 여기부터 LoadLSWUpDown 에서만 사용할 함수들
        function LoadUI(key, bp) {  // UI 불러오기
            // div
            var Div = document.createElement('div');
            Div.id = key + 'Div_' + id;
            Div.style.width = width + 'px';
            Div.style.height = height + 'px';
            Div.style.border = '2px solid gray';
            Div.style.overflow = 'hidden';
            Div.style.marginTop = '5px';
            var clientDiv = document.getElementById(divId);
            if(clientDiv == null){
                alert("LSWUp&Down\n※div를 찾을수 없습니다.※\n입력하신 divId = "+divId+"\n※Error: divId="+divId+"가 존재하지않아 Id="+id+" 생성 오류※");
                return 0;
            }
            clientDiv.appendChild(Div); // 받아온 div아래에 추가

            // 창
            var Place = document.createElement('iframe');
            Place.id = key + 'Place_' + id;
            Place.src = 'about:blank';
            Place.frameBorder = 0;
            Place.style.width = width + 'px';
            Place.style.height = height - 40 + 'px';

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
            fileListDiv.id = key + 'fileListDiv_' + id;
            fileListDiv.draggable = 'true';

            fileListDiv.ondrop = function (e) {
                if (e.target.id == 'UploadfileListDiv_' + id) { LSWUpDownPrototype.prototype.funcList.DragDrop(e,up[0],LSWUpDownPrototype.prototype.option.wl.get(id)); }
                else { e.stopPropagation(); e.preventDefault(); }
            };
            fileListDiv.ondragover = function (e) { e.stopPropagation(); e.preventDefault(); };
            fileListDiv.ondragleave = function (e) { e.stopPropagation(); e.preventDefault(); };

            Place.addEventListener('load', function () {
                Place.contentDocument.body.appendChild(nameDiv);
                Place.contentDocument.body.appendChild(fileListDiv);
                Place.contentDocument.body.appendChild(modal);
                if (LSWUpDownPrototype.prototype.option.isIE) { // IE용 사이즈 조절
                    Place.contentDocument.body.style.marginRight = '0px';
                }
                Place.contentDocument.body.style.margin = '0';
                //if (key == 'Download') { LSWUpDownPrototype.prototype.funcList.ListFiles(fileListDiv); }
                LSWUpDownPrototype.prototype.eventList.OnIframeLoaded_LSW(Place);
                LoadCSS(Place);
            });

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
            closeArea.onclick = function () {
                progressBar2.style.width = '0%';
                percent.innerText = '0%\n';
                modal.style.display = 'none';
            };
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
            CreateModalButton(modalWindow, 'pauseB', '실행취소');
            CreateModalButton(modalWindow, 'no', '아니오');
            CreateModalButton(modalWindow, 'yes', '예');

            Div.appendChild(Place);

            if(bp!=1){
                // 버튼영역
                var ButtonPlace = document.createElement('iframe');
                ButtonPlace.id = key + 'ButtonPlace_' + id;
                ButtonPlace.frameBorder = 0;
                ButtonPlace.style.height = '40px';
                ButtonPlace.style.width = width + 'px';
                ButtonPlace.style.background = '#31648c';
                ButtonPlace.style.paddingTop = '0';

                var ButtonPlace_Div = document.createElement('div');
                ButtonPlace_Div.id = key + 'ButtonPlace_Div_' + id;
                ButtonPlace_Div.className = key + 'ButtonPlace_Div';

                ButtonPlace.addEventListener('load', function () {
                    ButtonPlace.contentDocument.body.appendChild(ButtonPlace_Div);
                    ButtonPlace.contentDocument.body.style.overflow = 'hidden'; // 버튼영역 늘어남 방지
                    LoadCSS(ButtonPlace);
                });

                Div.appendChild(ButtonPlace);
            }
            else{
                Div.style.height = height-40 + 'px';
            }

            return [fileListDiv, ButtonPlace_Div, modal];
        }

        function LoadCSS(where) { // 해당영역의 iframe에 CSS 로드함수
            var cssLink = document.createElement("link");
            cssLink.href = "LSWUp&Down.css";
            cssLink.rel = "stylesheet";
            cssLink.type = "text/css";
            where.contentDocument.head.appendChild(cssLink);
        }

        function AddB(where, buttonType, buttonId, buttonText) { // UI에 버튼추가
            var inputDiv = document.createElement('div');
            inputDiv.className = 'inputdiv';
            if (buttonType == 'form') {
                var fileInput = document.createElement('form');
                fileInput.acceptCharset = "UTF-8";
                fileInput.method = 'post';
                fileInput.action = '/LSWUpDown/DownloadServlet';
                fileInput.target = '_self';
                fileInput.enctype = 'multipart/form-data';
            }
            else {
                var fileInput = document.createElement('input');
                fileInput.type = buttonType;
            }
            fileInput.id = buttonId;
            if (buttonType == 'file') { fileInput.multiple = 'true'; }
            var inputLabel = document.createElement('label');
            inputLabel.innerText = buttonText;
            inputLabel.htmlFor = buttonId;

            where.appendChild(inputDiv);
            inputDiv.appendChild(inputLabel);
            inputDiv.appendChild(fileInput);
            if (buttonType == 'form') {
                return [fileInput, inputLabel];
            }

            return fileInput;
        }

        function CreateModalButton(modalWindow, id, innerText) { // modal에 필요한 버튼 생성
            var modalButton = document.createElement('button');
            modalButton.id = id;
            modalButton.innerText = innerText;
            modalButton.style.display = 'none';
            modalWindow.appendChild(modalButton);
        }
    }
}

LSWUpDownPrototype.prototype.eventList = { // 유저가 사용할 이벤트 함수
    OnUpLoadDone_LSW : function (postNum,result) { // 업로드 완료시
        console.log("Default Message : 업로드가 완료되었습니다.");
        console.log("PostNum:"+postNum); // 업로드한 게시물 번호
        console.log(result); // result[] = 업로드가 완료된 파일 목록
    },

    OnStopUpload_LSW : function (postNum, result, uploaded) { // 업로드 중단시
        console.log("Default Message : 업로드가 중단되었습니다.");
        console.log("PostNum:"+postNum); // 업로드한 게시물 번호
        console.log(result); // result[] = 업로드가 중단된 파일의 이름 , 진행률
        console.log(uploaded); // uploaded[] = 이미 업로드가 완료된 파일들
    },

    OnDownLoadDone_LSW : function (result) { // 다운로드 완료시
        console.log("Default Message : 다운로드가 완료되었습니다.");
        console.log(result); // result[] = 다운로드가 완료된 파일 목록
    },

    OnError_LSW : function (result) { // 오류 발생시
        console.log("Default Message : 오류가 발생하였습니다.");
        console.log("ErrorCode : "+result); // result = 오류번호
    },

    OnDeleted_LSW : function (result) { // 파일 삭제시
        console.log("Default Message : 파일을 삭제하였습니다.");
        console.log(result); // result[] = 삭제가 완료된 파일 목록
    },
    
    OnIframeLoaded_LSW : function (Iframe) { // 온로드 되었을때 (사용자가 준함수 or 기본값 사용)
        LSWUpDownPrototype.prototype.option.loaded(Iframe); // Iframe = 생성된 창의 Iframe객체
    }
}

LSWUpDownPrototype.prototype.APIList = { // 유저가 사용할 API
    LswFileLoadAPI:function (id,fileList){ // 파일 리스트에 올리기
        try {
            var list = document.getElementById('UploadDiv_'+id);
            if(list==undefined){
                console.log("※LSWUpDown ERROR on @LswFileLoadAPI : \n해당 id로 생성된 Upload창이 없습니다.(id="+id+")");
                return 0;
            }
            var where = list.childNodes[0].contentDocument.body.childNodes[1];
            LSWUpDownPrototype.prototype.funcList.Addfile(fileList,where,LSWUpDownPrototype.prototype.option.wl.get(id));
        } catch (e) {
            if(e instanceof TypeError){
                console.log("※LSWUpDown ERROR on @LswFileLoadAPI : \nparameter의 id 오류(id="+id+")");
            }
            else if(e instanceof ReferenceError){
                console.log("※LSWUpDown ERROR on @LswFileLoadAPI : \nparameter의 fileList 오류(fileList="+fileList+")");
            }
            else{
                console.log(e);
            }
        }
    },
    
    LswFileUpAPI:function (id){ // 리스트에 있는 파일 업로드
        try {
            var list = document.getElementById('UploadDiv_'+id);
            if(list==undefined){
                console.log("※LSWUpDown ERROR on @LswFileUpAPI : \n해당 id로 생성된 Upload창이 없습니다.(id="+id+")");
                return 0;
            }
            //<div id="UploadfileListDiv_lsw0"
            //<div id="UploadButtonPlace_Div_lsw0" 
            var up0 = list.childNodes[0].contentDocument.body.childNodes[1];
            if(list.childNodes[1]!= undefined){
                var up1 = list.childNodes[1].contentDocument.body.childNodes[0];
            }
            else{var up1 = ''};
            
            LSWUpDownPrototype.prototype.funcList.SendWaitList('',id,up0,up1,
                LSWUpDownPrototype.prototype.option.wl.get(id),
                LSWUpDownPrototype.prototype.option.result.get(id));
        } catch (e) {
            if(e instanceof TypeError){
                console.log("※LSWUpDown ERROR on @LswFileUpAPI : \nparameter의 id 오류(id="+id+")");
            }
            else{
                console.log(e);
            }
        }

    },
    
    LswFileDownAPI:function (id){ // 리스트에 체크한 파일 다운로드
        try {
            var list = document.getElementById('DownloadDiv_'+id);
            if(list==undefined){
                console.log("※LSWUpDown ERROR on @LswFileDownAPI : \n해당 id로 생성된 Download창이 없습니다.(id="+id+")");
                return 0;
            }
            var tempForm = document.createElement('form');
            tempForm.style.display='none';
            tempForm.acceptCharset = "UTF-8";
            tempForm.method = 'post';
            tempForm.action = '/LSWUpDown/DownloadServlet';
            tempForm.target = '_self';
            tempForm.enctype = 'multipart/form-data';
            list.appendChild(tempForm);
            var formSend = [tempForm,];
            var where = list.childNodes[0].contentDocument.body.childNodes[1];
            if(list.childNodes[1].contentDocument!= undefined){
                var dn1 = list.childNodes[1].contentDocument.body.childNodes[0];
            }
            else{var dn1 = ''};
            LSWUpDownPrototype.prototype.funcList.ControlFile(where, 'download', id, 
                LSWUpDownPrototype.prototype.option.wl.get(id),formSend,dn1);
            list.removeChild(tempForm);
        } catch (e) {
            if(e instanceof TypeError){
                console.log("※LSWUpDown ERROR on @LswFileDownAPI : \nparameter의 id 오류(id="+id+")");
            }
            else{
                console.log(e);
            }
        }
    },

    LswRefreshAPI:function (id,postNum){ // 다운로드창의 다운로드 리스트를 최신화
        try {
            var list = document.getElementById('DownloadDiv_'+id);
            if(list==undefined){
                console.log("※LSWUpDown ERROR on @LswFileDownAPI : \n해당 id로 생성된 Download창이 없습니다.(id="+id+")");
                return 0;
            }
            var where = list.childNodes[0].contentDocument.body.childNodes[1];
            LSWUpDownPrototype.prototype.funcList.ListFiles(where,postNum);

        } catch (e) {
            if(e instanceof TypeError){
                console.log("※LSWUpDown ERROR on @LswFileDownOneAPI : \nparameter 오류(id="+id+", postNum="+postNum+")");
            }
            else{
                console.log(e);
            }
        }
    },

    LswGetPostListAPI:function (){
        var req = new XMLHttpRequest();
        req.open("GET", '/LSWUpDown/CheckServlet');
        req.send();
        req.onreadystatechange = function () {
            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                if (req.responseText == "") {
                    console.log(false);
                }
                else{
                    console.log(req.responseText);
                }
            }
        }
    }
}

LSWUpDownPrototype.prototype.funcList ={ // 기능 함수 모음
    LoadFile:function (where, fn, fs) { // 파일 리스트에 올리기
        var tempFileDiv = document.createElement('div');
        tempFileDiv.className = 'filelistselect';
        tempFileDiv.id = fn + ' ' + fs;
        var checkBox = document.createElement('input');
        checkBox.className = 'checkboxblock';
        checkBox.type = 'checkbox';
        checkBox.style.float = 'left';
        checkBox.style.overflow = 'auto';
        if (LSWUpDownPrototype.prototype.option.isIE) { checkBox.style.width = '17px'; }
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
    },

    BytesToSize:function (bytes) { // 파일크기 단위 변경
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0)
            return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },

    Addfile:function (th, where, wl) { // 파일추가 기능
        var same = '개 제외하였습니다.\n';
        var add = '개의 파일을 추가하였습니다.\n';
        var sameCount = 0;
        if(th.files){var files = th.files;}
        else{var files = th}
        for (var f = 0; f < files.length; f++) {
            var tempF = files[f];
            var calSize = LSWUpDownPrototype.prototype.funcList.BytesToSize(tempF.size);
            var flag = 0;
            for (var u = 0; u < where.childNodes.length; u++) {
                if (where.childNodes[u].childNodes[1].innerText == tempF.name && where.childNodes[u].childNodes[2].innerText == calSize) {
                    same += ('>>> ' + tempF.name + '\n');
                    sameCount += 1;
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) {
                add += ('>>> ' + tempF.name + '\n');
                LSWUpDownPrototype.prototype.funcList.LoadFile(where, tempF.name, calSize);
                wl.push({ 'name': tempF.name, 'size': calSize, 'file': tempF, 'sizeN': tempF.size });
            }
        }
        same = '중복된 파일을 ' + sameCount + same;
        if (files.length - sameCount != 0) {
            same += ('\n중복되지 않은 ' + (files.length - sameCount) + add);
        }
        if (sameCount > 0) { alert(same); }
        if(th.type=='file'){th.value = '';}
    },

    SendWaitList:function(postNum,id,up0,up1,wl,result,again) { // 업로드 리스트에 있는 파일 업로드 시작
        var place = document.getElementById('UploadPlace_' + id);
        var modal = place.contentDocument.getElementById('modal');
        var pauseB = place.contentDocument.getElementById('pauseB');
        if (up0.childNodes.length != 0) {
            if (again != 'again') {
                LSWUpDownPrototype.prototype.funcList.ModalYesNo(modal, '파일을 업로드 하시겠습니까?\n(※리스트 전부 업로드 됩니다.※)', up0);
                if(up1!=''){up1.style.display = 'none';}
                modal.childNodes[0].childNodes[6].onclick = function () {
                    var postNum = prompt('게시글 번호를 입력해주세요');
                    if(postNum!=null&&postNum!=""&&postNum.indexOf('.')==-1){
                        LSWUpDownPrototype.prototype.funcList.ResumeFunc(postNum, modal, pauseB, up0, up1, wl, id, result);
                    }
                    else{
                        alert("잘못 입력하셨습니다.");
                        modal.style.display = 'none';
                        if(up1!=''){up1.style.display = 'flex';}
                    }
                };
                modal.childNodes[0].childNodes[5].onclick = function () {
                    modal.style.display = 'none';
                    if(up1!=''){up1.style.display = 'flex';}
                };
            }
            else {
                LSWUpDownPrototype.prototype.funcList.ResumeFunc(postNum, modal, pauseB, up0, up1, wl, id, result);
            }
        }
        else {
            alert('파일을 추가해주세요.');
        }
    },

    DragDrop:function(e, up, wl) { // 드래그 앤 드롭으로 업로드 리스트에 파일 추가
        e.preventDefault();
        LSWUpDownPrototype.prototype.funcList.Addfile(e.dataTransfer, up, wl);
    },

    ListFiles:function(where, postNum) { // 다운로드 리스트에 파일 불러오기(새로고침)
        //if(postNum==undefined){alert('')}
        var req = new XMLHttpRequest();
        req.open('service', '/LSWUpDown/RefreshServlet?' + "postNum=" + postNum);
        req.send();

        req.onreadystatechange = function () {
            where.innerHTML = '';
            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                var fileSplit = req.responseText.split('/');
                fileSplit.pop();
                for (var f = 0; f < fileSplit.length; f += 2) {
                    LSWUpDownPrototype.prototype.funcList.LoadFile(where, fileSplit[f], LSWUpDownPrototype.prototype.funcList.BytesToSize(fileSplit[f + 1]));
                }
                where.value = postNum;
            }
            else if (req.status == 500 || req.status == 404 || req.status == 403) {
                alert("(" + req.status + ")오류가 발생하였습니다.");
                LSWUpDownPrototype.prototype.eventList.OnError_LSW(req.status);
            }
        }
    },

    ControlFile:function(where, tag, id, wl, startDownload, dn1) { // 체크된 파일 컨트롤(제외,삭제,다운로드)
        var flag = 0;
        var controlList = [];
        var message = '';

        for (var u = 0; u < where.childNodes.length; u++) {
            if (where.childNodes[u].childNodes[0].checked) {
                controlList.push(where.childNodes[u].childNodes[1].innerText);
                message += '\n>>> ' + where.childNodes[u].childNodes[1].innerText;
                flag = 1;
            }
        }

        if (tag == 'download') {
            var LSW_RANDOM_NUMBER = Math.floor(Math.random() * 1000000);
            controlList.push(LSW_RANDOM_NUMBER);
        }

        if (flag == 1) {
            var yesorno = null;
            if (tag == 'delete') { yesorno = confirm('체크된 항목을 삭제하시겠습니까?\n(※실제 서버에서 삭제됩니다.※)\n' + message); }
            else if (tag == 'download') { yesorno = confirm('체크된 항목을 다운로드 하시겠습니까?\n' + message); }
            else if (tag == 'except') { yesorno = confirm('체크된 항목을 제외하시겠습니까?\n' + message); }

            if (yesorno != null && yesorno) {
                if (tag == 'except') {
                    var place = document.getElementById('UploadPlace_' + id);
                    for (var l = 0; l < wl.length; l++) {
                        for (var e = 0; e < controlList.length; e++) {
                            if (wl[l].name == controlList[e]) {
                                var ed = place.contentDocument.getElementById(wl[l].name + ' ' + wl[l].size);
                                where.removeChild(ed);
                                wl.splice(l, 1);
                                e--; l--; break;
                            }
                        }
                    }
                    alert('체크된 항목을 제외하였습니다.\n' + message);
                }
                else {
                    var place = document.getElementById('DownloadPlace_' + id);
                    var modal = place.contentDocument.getElementById('modal');
                    //var pauseB = place.contentDocument.getElementById('pauseB');
                    var req = new XMLHttpRequest();
                    var formData = new FormData();

                    for (var w = 0; w < controlList.length; w++) {
                        formData.append('name' + w, controlList[w]);
                        var temptemp = document.createElement('input');
                        temptemp.type = 'hidden';
                        if(w!=controlList.length-1){temptemp.name = 'name' + w;}
                        else{temptemp.name = "randomNumber";}
                        temptemp.value = controlList[w];
                        if(tag == 'download'){startDownload[0].appendChild(temptemp)};
                    }

                    if (tag == 'delete') { req.open('service', '/LSWUpDown/DeleteServlet'); req.send(formData); }
                    else if (tag == 'download') {
                        if(dn1!=''){dn1.style.display = 'none';}
                        LSWUpDownPrototype.prototype.funcList.ModalOn(modal, where, 'down');
                        var temptemp = document.createElement('input');
                        temptemp.type = 'hidden';
                        temptemp.name = 'postNum';
                        temptemp.value = where.value;
                        startDownload[0].appendChild(temptemp);
                        startDownload[0].submit();
                        var isZip = w > 2;
                        var intv = setInterval(function () {
                            LSWUpDownPrototype.prototype.funcList.Percent(modal, isZip, LSW_RANDOM_NUMBER, dn1);
                            if (modal.childNodes[0].childNodes[3].innerText == "파일 다운로드가 완료되었습니다. 100.0%") {
                                clearInterval(intv);
                                startDownload[0].innerHTML = "";
                                LSWUpDownPrototype.prototype.funcList.ModalOff(modal, "파일 다운로드가 완료되었습니다. 100.0%", where);
                                modal.childNodes[0].childNodes[2].childNodes[0].style.width = '100%';
                                //LSWUpDownPrototype.prototype.funcList.ListFiles(where);
                                if(dn1!=''){dn1.style.display = 'flex';}
                                controlList.pop();
                                LSWUpDownPrototype.prototype.eventList.OnDownLoadDone_LSW(controlList);
                            }
                        }, 500);
                    }
                    req.onreadystatechange = function () {
                        if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                            //LSWUpDownPrototype.prototype.funcList.ListFiles(where);
                            if (tag == 'delete') {
                                alert('체크된 항목을 삭제하였습니다.\n' + message);
                                LSWUpDownPrototype.prototype.eventList.OnDeleted_LSW(controlList);
                                LSWUpDownPrototype.prototype.funcList.ListFiles(where, where.value);
                            }
                            
                        }
                        else if (req.status == 500 || req.status == 404 || req.status == 403) {
                            LSWUpDownPrototype.prototype.funcList.ModalOff(modal, "(" + req.status + ")오류가 발생하였습니다.", where);
                            if(dn1!=''){dn1.style.display = 'flex';}
                            LSWUpDownPrototype.prototype.eventList.OnError_LSW(req.status);
                        }
                    };
                }
            }
        }
        else {
            alert('체크된 항목이 없습니다.');
        }
    },

    ClearList:function(where, str, yn, modal,id) { // 업로드, 다운로드 리스트 초기화
        if (where.childNodes.length != 0) {
            if (yn != 'no') {
                if (str == '제외') {
                    var ex = confirm('전부 ' + str + '하시겠습니까?');
                    if(ex){
                        where.innerHTML = '';
                        LSWUpDownPrototype.prototype.option.wl.set(id,[]);
                        alert("전부 제외되었습니다.");
                    }
                }
                else { LSWUpDownPrototype.prototype.funcList.ModalYesNo(modal, '전부 ' + str + '하시겠습니까?', where); }
                modal.childNodes[0].childNodes[6].onclick = function () {
                    if (str == '삭제') {
                        var req = new XMLHttpRequest();
                        var formData = new FormData();

                        for (var u = 0; u < where.childNodes.length; u++) {
                            formData.append('name' + u, where.childNodes[u].childNodes[1].innerText);
                            LSWUpDownPrototype.prototype.option.result.get(id).push(where.childNodes[u].childNodes[1].innerText);
                        }

                        formData.append("postNum",where.value);

                        LSWUpDownPrototype.prototype.funcList.ModalOn(modal, where);
                        req.open('service', '/LSWUpDown/DeleteServlet');
                        req.send(formData);
                        req.onreadystatechange = function () {
                            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                                LSWUpDownPrototype.prototype.funcList.ModalOff(modal, "전부 삭제되었습니다.", where);
                                //LSWUpDownPrototype.prototype.funcList.ListFiles(where);
                                LSWUpDownPrototype.prototype.eventList.OnDeleted_LSW(LSWUpDownPrototype.prototype.option.result.get(id));
                                LSWUpDownPrototype.prototype.option.result.set(id,[]);
                                LSWUpDownPrototype.prototype.funcList.ListFiles(where, where.value);
                            }
                            else if (req.status == 500 || req.status == 404 || req.status == 403) {
                                LSWUpDownPrototype.prototype.funcList.ModalOff(modal, "(" + req.status + ")오류가 발생하였습니다.", where);
                                LSWUpDownPrototype.prototype.eventList.OnError_LSW(req.status);
                            }
                        };
                    }
                };
                modal.childNodes[0].childNodes[5].onclick = function () {
                    modal.style.display = 'none';
                };
            }
            else {
                where.innerHTML = '';
                LSWUpDownPrototype.prototype.option.wl.set(id,[]);s
            }
        }
        else {
            alert(str + '할 항목이 없습니다.');
        }
    },

    DownloadFiles:function(response, fn, isZip) { // blob url 생성후 다운로드 방식 (※브라우저에서 메모리 많이써서 폐기)
        if (isZip > 1) {
            fn = "LSWUp&Down_";
            var today = new Date();
            fn += today.toLocaleString();
            fn += ".zip";
            if (LSWUpDownPrototype.prototype.option.isIE) { fn = encodeURI(fn); }
            else {
                fn = fn.replace('.', '년');
                fn = fn.replace('.', '월');
                fn = fn.replace('.', '일');
            }
        }
        var blob = response;
        var element = document.createElement('a');
        element.href = window.URL.createObjectURL(blob);
        element.download = fn;
        document.body.appendChild(element);
        if (LSWUpDownPrototype.prototype.option.isIE) { navigator.msSaveOrOpenBlob(blob, fn); }
        else { element.click(); }
        document.body.removeChild(element);
    },

    Percent:function(modal, isZip, LSW_RANDOM_NUMBER, dn1) { // 진행률 request 함수 interval로 사용
        var req2 = new XMLHttpRequest();
        req2.open('GET', '/LSWUpDown/DownloadServlet?' + "num=" + LSW_RANDOM_NUMBER);
        var percent = 0;
        req2.send();
        req2.onreadystatechange = function () {
            if (req2.readyState == XMLHttpRequest.DONE && req2.status == 200) {
                percent = req2.responseText;
                if (isZip == true) { modal.childNodes[0].childNodes[3].innerText = "서버에서 파일을 압축중입니다. " + percent + "%"; }
                else { modal.childNodes[0].childNodes[3].innerText = percent + "%"; }
                if (percent == 100.0) {
                    modal.childNodes[0].childNodes[3].innerText = "파일 다운로드가 완료되었습니다. 100.0%";
                    if(dn1!=''){dn1.style.display = 'flex';}
                }
                modal.childNodes[0].childNodes[2].childNodes[0].style.width = percent + "%";
            }
        };
    },

    ModalYesNo:function(modal, message, where) { // 컨펌모달
        modal.childNodes[0].childNodes[3].innerText = message;
        modal.childNodes[0].childNodes[1].style.display = 'none';
        modal.childNodes[0].childNodes[4].style.display = 'none';
        modal.childNodes[0].childNodes[5].style.display = 'flex';
        modal.childNodes[0].childNodes[6].style.display = 'flex';
        modal.style.display = 'flex';
        if (LSWUpDownPrototype.prototype.option.isIE) { where.parentNode.scrollTop = 0; }
        else { where.parentNode.scrollTo(0, 0); }
    },

    ModalOn:function(modal, where, down) { // 켜는모달
        modal.childNodes[0].childNodes[1].style.display = 'none';
        if (down == 'down') {
            modal.childNodes[0].childNodes[4].style.display = 'none';
            modal.childNodes[0].childNodes[3].innerText = '0%';
        }
        else { modal.childNodes[0].childNodes[4].style.display = 'flex'; }
        modal.childNodes[0].childNodes[5].style.display = 'none';
        modal.childNodes[0].childNodes[6].style.display = 'none';
        modal.style.display = 'flex';
        if (LSWUpDownPrototype.prototype.option.isIE) { where.parentNode.scrollTop = 0; }
        else { where.parentNode.scrollTo(0, 0); }
    },

    ModalOff:function(modal, message, where) { // 끄는모달
        modal.childNodes[0].childNodes[3].innerText = message;
        modal.childNodes[0].childNodes[1].style.display = 'flex';
        modal.childNodes[0].childNodes[4].style.display = 'none';
        modal.childNodes[0].childNodes[5].style.display = 'none';
        modal.childNodes[0].childNodes[6].style.display = 'none';
        if (LSWUpDownPrototype.prototype.option.isIE) { where.parentNode.scrollTop = 0; }
        else { where.parentNode.scrollTo(0, 0); }
    },

    ResumeFunc:function(postNum, modal, pauseB, up0, up1, wl, id, result) { // 이어올리기 기능
        var filename = wl[0].name;
        if (filename.length > 12) { filename = filename.substring(0, 12) + "...."; }
        var checkForm = new FormData();
        checkForm.append('name', wl[0].name);
        checkForm.append(wl[0].name, wl[0].sizeN);
        checkForm.append('postNum', postNum);

        var checkReq = new XMLHttpRequest();
        checkReq.open("POST", '/LSWUpDown/CheckServlet');
        checkReq.send(checkForm);
        checkReq.onreadystatechange = function () {
            if (checkReq.readyState == XMLHttpRequest.DONE && checkReq.status == 200) {
                if (checkReq.responseText != "") {
                    var res = checkReq.responseText.split('/');
                    if (res[0].length > 12) { res[0] = res[0].substring(0, 12) + "...."; }
                    var percent = '"' + res[0] + '" ☞ ' + res[1] + "%";
                    LSWUpDownPrototype.prototype.funcList.ModalYesNo(modal, "이어서 올리시겠습니까?\n" + percent, up0);

                    modal.childNodes[0].childNodes[6].onclick = function () {
                        LSWUpDownPrototype.prototype.funcList.UploadFunc(postNum, modal, pauseB, res[2], up0, up1, wl, id, result, 'YES');
                    };
                    modal.childNodes[0].childNodes[5].onclick = function () {
                        LSWUpDownPrototype.prototype.funcList.UploadFunc(postNum, modal, pauseB, 0, up0, up1, wl, id, result, 'NO');
                    };
                }
                else {
                    LSWUpDownPrototype.prototype.funcList.UploadFunc(postNum, modal, pauseB, 0, up0, up1, wl, id, result, 'NO');
                }
            }
        }
    },

    UploadFunc:function(postNum, modal, pauseB, offset, up0, up1, wl, id, result, yesno) { // 업로드 리퀘스트 및 프로세스 함수화
        offset = Number(offset);
        LSWUpDownPrototype.prototype.funcList.ModalOn(modal, up0);
        var filename = wl[0].name; // formData.get('name');
        var fullsize = wl[0].sizeN; // formData.get(formData.get('name')+' size');
        if (filename.length > 12) { filename = filename.substring(0, 12) + "...."; }
        var term = 1024 * 1024 * 100;
        if(term > fullsize-offset){term = fullsize-offset;}
        var chunk = wl[0].file.slice(offset, offset + term);

        var formData = new FormData();
        formData.append('name', wl[0].name);
        formData.append('size', wl[0].size);
        formData.append(wl[0].name + ' size', wl[0].sizeN);
        formData.append(wl[0].name, chunk);
        formData.append('yesno', yesno);
        formData.append('postNum', postNum);

        var req = new XMLHttpRequest();
        req.open("POST", '/LSWUpDown/UploadServlet');
        var percentComplete = 0;
        req.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                percentComplete = (e.loaded + Number(offset)) / fullsize;
                percentComplete *= 100;
                if (percentComplete >= 100) { percentComplete = 100.00; }
                percentComplete = percentComplete.toFixed(2);
                modal.childNodes[0].childNodes[2].childNodes[0].style.width = percentComplete + "%";
                modal.childNodes[0].childNodes[3].innerText = filename + " ☞ " + percentComplete + "%";
            }
        };
        req.send(formData);
        req.onreadystatechange = function () {
            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                if ((offset + term != fullsize) && (offset + term < fullsize)) {
                    offset += term;
                    LSWUpDownPrototype.prototype.funcList.UploadFunc(postNum, modal, pauseB, offset, up0, up1, wl, id, result);
                }
                else {
                    if (LSWUpDownPrototype.prototype.option.isIE) { var temp = modal.parentElement.childNodes[1].childNodes[0]; temp.parentNode.removeChild(temp); }
                    else { modal.parentElement.childNodes[1].childNodes[0].remove(); }
                    //var isDn = document.getElementById('DownloadPlace_'+id);
                    //if(isDn != null){LSWUpDownPrototype.prototype.funcList.ListFiles(isDn.contentDocument.body.childNodes[1])};
                    modal.childNodes[0].childNodes[2].childNodes[0].style.width = '100%';
                    result.push(wl.shift());
                    if (wl.length != 0) {
                        LSWUpDownPrototype.prototype.funcList.SendWaitList(postNum,id,up0,up1,wl,result,'again');
                    }
                    else {
                        LSWUpDownPrototype.prototype.funcList.ModalOff(modal, "파일 업로드가 완료되었습니다. 100.0%", up0);
                        if(up1!=''){up1.style.display = 'flex';}
                        LSWUpDownPrototype.prototype.eventList.OnUpLoadDone_LSW(postNum, result);
                        LSWUpDownPrototype.prototype.option.result.set(id,[]);
                    }
                }
            }
            else if (req.status == 500 || req.status == 404 || req.status == 403) {
                ModalOff(modal, "(" + req.status + ")오류가 발생하였습니다.", up0);
                if(up1!=''){up1.style.display = 'flex';}
                LSWUpDownPrototype.prototype.eventList.OnError_LSW(req.status);
                LSWUpDownPrototype.prototype.option.result.set(id,[]);
            }
        };
        pauseB.onclick = function () {
            if (req.readyState != XMLHttpRequest.DONE) {
                req.abort();
                LSWUpDownPrototype.prototype.funcList.ModalOff(modal, "파일 업로드가 중단되었습니다.", up0);
                if(up1!=''){up1.style.display = 'flex';}
                LSWUpDownPrototype.prototype.eventList.OnStopUpload_LSW(postNum,[wl[0],percentComplete+"%"],result);
                LSWUpDownPrototype.prototype.option.result.set(id,[]);
                return 0;
            }
        }
    }
}