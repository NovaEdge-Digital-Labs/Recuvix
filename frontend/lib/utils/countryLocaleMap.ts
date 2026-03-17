export type LocaleData = {
    locale: string;
    hreflang: string;
    currency: string;
};

export const countryLocaleMap: Record<string, LocaleData> = {
    usa: { locale: 'en_US', hreflang: 'en-us', currency: 'USD' },
    uk: { locale: 'en_GB', hreflang: 'en-gb', currency: 'GBP' },
    india: { locale: 'en_IN', hreflang: 'en-in', currency: 'INR' },
    australia: { locale: 'en_AU', hreflang: 'en-au', currency: 'AUD' },
    canada: { locale: 'en_CA', hreflang: 'en-ca', currency: 'CAD' },
    uae: { locale: 'ar_AE', hreflang: 'en-ae', currency: 'AED' },
    singapore: { locale: 'en_SG', hreflang: 'en-sg', currency: 'SGD' },
};

export function getLocaleData(country: string): LocaleData {
    const normalizedCountry = country.toLowerCase().trim();
    return countryLocaleMap[normalizedCountry] || countryLocaleMap['usa'];
}
