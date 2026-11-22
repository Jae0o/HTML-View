/** 문서 파일을 원래 파일 이름 그대로 내려받는다 — 저장 위치 · 묻기 여부는 브라우저 설정을 따른다 */
export const downloadDocument = async (handle: FileSystemFileHandle): Promise<void> => {
  const file = await handle.getFile();
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = file.name;
  link.click();

  // 내려받기가 시작된 뒤에 주소를 푼다
  setTimeout(() => URL.revokeObjectURL(url));
};
