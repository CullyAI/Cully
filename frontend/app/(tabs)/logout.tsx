import { Button, View, StyleSheet } from "react-native";
import { logout } from "@/lib/supabase"

export default function LogoutScreen() {
    return (
        <View style={styles.container}>
            <Button title="Log Out" onPress={logout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});