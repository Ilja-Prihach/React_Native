import { StatusBar } from 'expo-status-bar';
import ProfileCard from './components/ProfileCard';

const sampleProfile = {
  name: 'Ilja Prihach',
  bio: 'React Native developer learning TypeScript and Expo. Building cool apps one step at a time.',
  avatarUrl: 'https://i.pravatar.cc/300',
};

export default function App() {
  return (
    <>
      <ProfileCard
        profile={sampleProfile}
        onEdit={() => console.log('Save pressed')}
      />
      <StatusBar style="auto" />
    </>
  );
}
