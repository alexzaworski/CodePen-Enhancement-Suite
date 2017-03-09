import ResizablePreviews from '../modules/resizablePreviews';
import RecentPensTypeahead from '../modules/recentPensTypeahead';
import HideProfileCSS from '../modules/HideProfileCSS';
import CES from '../modules/core/CES';

CES.registerModule(ResizablePreviews);
CES.registerModule(RecentPensTypeahead);
CES.registerModule(HideProfileCSS);
CES.initModules();
