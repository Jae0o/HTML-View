import { ViewerBody } from "@views/containers/viewer";
import { ViewerLayout } from "@views/layouts";

import { useRestoreFolders } from "./hooks";

/** 뷰어 화면 */
const ViewerPage = () => {
  useRestoreFolders();

  return (
    <ViewerLayout>
      <ViewerBody />
    </ViewerLayout>
  );
};

export default ViewerPage;
