export const dataforseoLocationMap: Record<string, { location_name: string; language_name: string }> = {
    india: { location_name: "India", language_name: "English" },
    usa: { location_name: "United States", language_name: "English" },
    uk: { location_name: "United Kingdom", language_name: "English" },
    australia: { location_name: "Australia", language_name: "English" },
    canada: { location_name: "Canada", language_name: "English" },
    uae: { location_name: "United Arab Emirates", language_name: "English" },
    singapore: { location_name: "Singapore", language_name: "English" },
};

export function getDataForSeoLocation(country: string) {
    const normalized = country.toLowerCase().trim();
    return dataforseoLocationMap[normalized] || dataforseoLocationMap["usa"];
}
