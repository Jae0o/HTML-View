// 폴더 선택 · 읽기 권한 확인은 아직 TypeScript 기본 타입에 없다. 쓰는 것만 선언한다

interface FileSystemHandlePermissionDescriptor {
  mode?: "read" | "readwrite";
}

interface FileSystemHandle {
  queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
  requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
}

interface FileSystemDirectoryHandle {
  values(): AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle>;
}

interface Window {
  showDirectoryPicker(options?: FileSystemHandlePermissionDescriptor): Promise<FileSystemDirectoryHandle>;
}
