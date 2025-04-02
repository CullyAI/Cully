import { Button } from "react-native";
import { logout } from "@/lib/supabase"

export default function LogoutScreen() {
    return (
        <Button title="Log Out" onPress={logout} />
    );
}