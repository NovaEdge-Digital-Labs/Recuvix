"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countryLocaleMap = void 0;
exports.getLocaleData = getLocaleData;
exports.countryLocaleMap = {
    usa: { locale: 'en_US', hreflang: 'en-us', currency: 'USD' },
    uk: { locale: 'en_GB', hreflang: 'en-gb', currency: 'GBP' },
    india: { locale: 'en_IN', hreflang: 'en-in', currency: 'INR' },
    australia: { locale: 'en_AU', hreflang: 'en-au', currency: 'AUD' },
    canada: { locale: 'en_CA', hreflang: 'en-ca', currency: 'CAD' },
    uae: { locale: 'ar_AE', hreflang: 'en-ae', currency: 'AED' },
    singapore: { locale: 'en_SG', hreflang: 'en-sg', currency: 'SGD' },
};
function getLocaleData(country) {
    const normalizedCountry = country.toLowerCase().trim();
    return exports.countryLocaleMap[normalizedCountry] || exports.countryLocaleMap['usa'];
}
