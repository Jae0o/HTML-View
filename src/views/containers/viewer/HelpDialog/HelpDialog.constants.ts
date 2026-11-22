/** 도움말 창 문구 — 결정 HP-A5 · A6 · A7 (2026-11-22) 글자 그대로. 「0Docs」 자리는 로고로 그린다(글자에 넣지 않는다) */
export const HELP_COPY = {
  title: "도움말",
  aboutTitle: "는",
  about:
    "내 컴퓨터 폴더에 쌓인 HTML 문서를 한곳에서 골라 보는 뷰어입니다. 서버 없이 이 브라우저 안에서만 동작하고, 파일을 올리거나 다른 곳으로 보내지 않습니다.",
  howTitle: "사용 방법",
  steps: [
    { title: "폴더 추가", description: "목록의 폴더 추가 버튼으로 HTML 문서가 든 폴더를 고릅니다." },
    { title: "문서 열기", description: "목록에서 문서를 누르면 본문에 열립니다. 보던 문서는 다음에 다시 열립니다." },
    { title: "찾기 · 즐겨찾기", description: "검색 칸으로 폴더와 문서 이름을 찾고, 별을 눌러 즐겨찾기에 모읍니다." },
    { title: "정리", description: "폴더 줄의 더보기 메뉴에서 이름을 바꾸거나 등록을 해제합니다." },
    { title: "내려받기", description: "오른쪽 위 다운로드 버튼으로 열린 문서를 내려받습니다." },
  ],
  note: "브라우저를 다시 열면 폴더 연결이 끊길 수 있습니다. 다시 연결을 눌러 주세요.",
  copyright: "© 2026",
  contactLabel: "문의",
  contactEmail: "leey153@naver.com",
} as const;
