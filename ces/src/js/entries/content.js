import '../../css/content.scss';
import ResizablePreviews from '../modules/resizablePreviews';
import RecentPensTypeahead from '../modules/recentPensTypeahead';
import HideProfileCSS from '../modules/hideProfileCSS';
import DistractionFreeMode from '../modules/distractionFreeMode';
import CES from '../modules/core/CES';

CES.registerModule(ResizablePreviews);
CES.registerModule(RecentPensTypeahead);
CES.registerModule(HideProfileCSS);
CES.registerModule(DistractionFreeMode);
CES.initModules();
