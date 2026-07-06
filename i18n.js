const translations = {
    es: {
        "login_lbl_user": "USUARIO",
        "login_lbl_pass": "CONTRASEÑA",
        "login_forgot": "¿Olvidaste tu contraseña?",
        "login_btn_enter": "ENTRAR",
        "login_ph_user": "Ej: admin",
        "login_ph_pass": "••••••••",
        // Currency texts
        "currency_label": "Símbolo de Moneda",
        "currency_save": "Guardar Moneda"
    },
    en: {
        "login_lbl_user": "USERNAME",
        "login_lbl_pass": "PASSWORD",
        "login_forgot": "Forgot your password?",
        "login_btn_enter": "LOGIN",
        "login_ph_user": "E.g. admin",
        "login_ph_pass": "••••••••",
        // Currency texts
        "currency_label": "Currency Symbol",
        "currency_save": "Save Currency"
    }
};

let currentLang = localStorage.getItem('bh_lang_app') || 'es';

function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('bh_lang_app', lang);
    applyTranslations();
}

function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[currentLang][key];
            } else {
                el.innerHTML = translations[currentLang][key];
            }
        }
    });

    const langSelector = document.getElementById('lang-selector-app');
    if (langSelector) {
        langSelector.value = currentLang;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
});
