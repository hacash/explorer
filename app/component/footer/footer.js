

;VueCreateAppCommon('footer', {}, {
    choiseLang(lang) {
        setCookie("lang", lang, "/", 5) 
        location.reload()
    },
    choiseTheme(theme) {
        setCookie("theme", theme, "/", 300) 
        location.reload()
    },
});

