﻿# raon_updown (LSWUp&Down)

테스트 페이지   
http://112.136.138.139:6522/LSWUpDown/LSWUp&Down.html      

(O) 지원 브라우저는 IE10이상, Chrome을 대상으로 한다   
(O) 업로드 기능 제공 (한번에&하나씩)   
(O) 다운로드 기능 제공   
(O) Drag&Drop을 통해 파일 추가 구현   
(O) 업로드, 다운로드 시 Progress Bar 구현   
(O) 전송중 취소 기능 구현   
(O) 이어올리기 기능 구현      

(+) 다중 업로드 처리 완료   
(+) 다중 다운로드시 ZIP파일로 압축하여 제공   
(+) 대용량 파일 처리 완료   
(+) 무결성 검증 이상 없음(기존파일, 업로드, 다운로드, 압축해제후)   
(+) 다운로드시 브라우저 메모리에 쓰는 현상 개선   
(+) 다운로드마다 IP+난수(~100만) 생성하여 브라우저간, 여러 창 충돌 개선      

(O) 분할 업로드 방식으로 변경   
(O) 분할 업로드로 변경 후 이어 올리기 적용   
(+) 업로드 중단시 예외처리   
(+) 업로드 or 다운로드 중 버튼영역 비활성화      

(O) 프로토타입화 + 이벤트함수 생성하여 제공   
(O) 업로드와 다운로드 분할하여 따로 생성 가능하도록 제공   
(O) 중복된 아이디로 생성, 잘못된 파라미터 받을시 예외처리   
(O) Id와 divId 필수로 받도록 개선      

(O) API 함수 생성하여 제공   
(+) 파일 등록 API (LswFileLoadAPI)   
(+) 파일 업로드 API (LswFileUpAPI)   
(+) 파일 다운로드 API (LswFileDownAPI)   
(+) 전체 게시물 번호 출력 (LswGetPostListAPI)      

(O) 게시물 번호별로 독립된 다운로드 페이지 구성   