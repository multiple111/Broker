function googleTranslateElementInit() {
    new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');

    setTimeout(() => {
        let savedLang = localStorage.getItem("selectedLanguage");

        if (savedLang) {
            applyGoogleTranslate(savedLang); // Apply saved language
        } else {
            let browserLang = detectBrowserLanguage();
            applyGoogleTranslate(browserLang); // Apply detected language
        }
    }, 1000);
}

// Function to detect the user's browser language
function detectBrowserLanguage() {
    let lang = navigator.language || navigator.userLanguage;
    lang = lang.split('-')[0]; // Extract main language code

    let supportedLangs = ["en", "fr", "es", "de", "zh", "ar", "hi", "ru", "pt", "it"];
    return supportedLangs.includes(lang) ? lang : "en"; // Default to English if not supported
}

// Function to apply a language selection
function applyGoogleTranslate(lang) {
    let select = document.querySelector(".goog-te-combo");
    if (select) {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
    }
}

// Load Google Translate Script dynamically
(function () {
    let script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
})();

// Ensure button toggles translate dropdown AFTER TranslateElement loads
document.addEventListener("DOMContentLoaded", function () {
    let translateBtn = document.getElementById("translate-btn");

    // Wait for TranslateElement to load before adding click event
    let checkExist = setInterval(() => {
        let translateElement = document.getElementById("google_translate_element");

        if (translateElement) {
            clearInterval(checkExist); // Stop checking

            // Ensure it's hidden initially
            translateElement.style.display = "none";

            // Toggle visibility on button click
            translateBtn.addEventListener("click", function (event) {
                translateElement.style.display = translateElement.style.display === "block" ? "none" : "block";
                event.stopPropagation(); // Prevent click from propagating
            });

            // Close dropdown when clicking outside
            document.addEventListener("click", function (event) {
                if (
                    translateElement.style.display === "block" &&
                    !translateElement.contains(event.target) &&
                    event.target !== translateBtn
                ) {
                    translateElement.style.display = "none";
                }
            });

            // Listen for language change, store selection, and close dropdown
            setTimeout(() => {
                let select = document.querySelector(".goog-te-combo");
                if (select) {
                    select.addEventListener("change", function () {
                        localStorage.setItem("selectedLanguage", select.value);
                        translateElement.style.display = "none"; // Close after selection
                    });
                }
            }, 1000);
        }
    }, 500); // Check every 500ms until found
});
