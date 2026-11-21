// 틀에 글자로 넣은 문서(srcDoc)의 링크는 이 앱의 주소를 기준으로 풀린다 — 그대로 두면 같은 문서 안 이동(#…)까지 틀 안에 이 앱을 연다.
// 문서 끝에 붙이는 스크립트가 링크 누름을 대신 처리한다:
// 같은 문서 안 이동(#…)은 그 자리로 스크롤하고, 바깥 주소(http · https)는 새 탭으로 열고, 나머지 링크는 막는다
const LINK_GUARD = `<script>document.addEventListener("click",function(e){var a=e.target.closest?e.target.closest("a[href]"):null;if(!a)return;var h=a.getAttribute("href");e.preventDefault();if(h.charAt(0)==="#"){var id=decodeURIComponent(h.slice(1));var t=id?document.getElementById(id)||document.getElementsByName(id)[0]:document.documentElement;if(t)t.scrollIntoView();return}if(/^https?:/i.test(h))window.open(h,"_blank","noopener")},true)</script>`;

/** 문서 HTML 뒤에 링크 지킴 스크립트를 붙인다 */
export const withLinkGuard = (html: string): string => html + LINK_GUARD;
