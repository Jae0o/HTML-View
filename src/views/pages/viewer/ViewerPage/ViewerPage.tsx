import { DocumentList, ViewerBody } from "@views/containers/viewer";
import { ViewerLayout } from "@views/layouts";

import { useFolderAutoRefresh, useRestoreFolders } from "./hooks";

/** 뷰어 화면 */
const ViewerPage = () => {
  useRestoreFolders();
  useFolderAutoRefresh();

  return (
    <ViewerLayout floating={<DocumentList />}>
      <ViewerBody />
    </ViewerLayout>
  );
};

export default ViewerPage;
