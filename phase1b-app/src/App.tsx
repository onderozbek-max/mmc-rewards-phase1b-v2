import { A11yAnnouncementProvider, A11yDevAssertions } from '@walmart/ld-kit';
import { useInitializeStore } from '@walmart/ld-kit/store';
import { useInitializeTheming } from '@walmart/ld-kit/theming';
import '@walmart/ld-kit/styles.css';
import CommunityHomePage from './pages/CommunityHomePage';

export default function App() {
  useInitializeTheming("Member's Mark", ["Member's Mark"] as const);
  useInitializeStore();

  return (
    <A11yAnnouncementProvider>
      <A11yDevAssertions />
      <CommunityHomePage />
    </A11yAnnouncementProvider>
  );
}
