
import { useFlyoutContext } from '@/app/members/flyout-context';
import { FlyoutProvider } from '@/app/members/flyout-context';
import ProfileSidebar from './profile-sidebar';
import ProfileBody from './profile-body';

export const metadata = {
  title: 'Profile - Mosaic',
  description: 'Page description',
};


function ProfileContent() {
  return (
    <div className="relative flex">
      {/* Profile sidebar */}
      <ProfileSidebar />

      {/* Profile body */}
      <ProfileBody />
    </div>
  );
}

export default function Profile() {
  return (
    <FlyoutProvider>
      <ProfileContent />
    </FlyoutProvider>
  );
}
