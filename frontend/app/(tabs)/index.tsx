import { useAuth } from '@/context/authcontext';
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href={'/(tabs)/recipe'} />;
}