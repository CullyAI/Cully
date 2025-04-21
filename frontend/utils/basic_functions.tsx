export const cleanAndParseJSON = (raw: string) => {
    try {
        // Remove any outer whitespace
        const trimmed = raw.trim();
    
        // Parse it — most models output valid JSON strings directly
        const parsed = JSON.parse(trimmed);
        return parsed;
    } catch (err) {
        console.error("❌ Failed to parse JSON:", err);
        return null;
    }
};