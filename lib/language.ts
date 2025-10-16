/**
 * Language utilities for managing user language preferences
 */

export const LANGUAGE_STORAGE_KEY = "babyfoot-booking-language";

/**
 * Get the user's preferred language from localStorage (client-side only)
 */
export function getPreferredLanguage(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    console.warn(
      "Failed to read language preference from localStorage:",
      error
    );
    return null;
  }
}

/**
 * Set the user's preferred language in localStorage (client-side only)
 */
export function setPreferredLanguage(language: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.warn("Failed to save language preference to localStorage:", error);
  }
}

/**
 * Get the default language based on browser preferences or fallback
 */
export function getDefaultLanguage(): string {
  if (typeof window === "undefined") {
    return "fr"; // Server-side default
  }

  // Try to get from localStorage first
  const savedLanguage = getPreferredLanguage();
  if (savedLanguage) {
    return savedLanguage;
  }

  // Fallback to browser language
  const browserLanguage = navigator.language.split("-")[0];
  return ["fr", "en"].includes(browserLanguage) ? browserLanguage : "fr";
}
