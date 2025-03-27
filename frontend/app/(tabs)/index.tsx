import { useAuth } from '@/context/authcontext';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isLoggedIn } = useAuth();

  return <Redirect href={'/(tabs)/placeholder'} />;
}