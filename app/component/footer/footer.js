
var vAppFooter = new Vue({
    el: '#footer',
    data: {
    },
    methods:{
        choiseLang: function(lang) {
            setCookie("lang", lang, "/", 5) 
            location.reload()
        },
        choiseTheme: function(theme) {
            setCookie("theme", theme, "/", 300) 
            location.reload()
        },
    }
})

