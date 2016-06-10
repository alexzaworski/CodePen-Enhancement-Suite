/*
* Okay so.... addmitedly this should probably be a module. It's tough 'cause
* I need access to the storage API in order to check for initialization stuff.
* If someone wants to take a crack at reorganizing this please do.
*/

var customThemeHandler = (function(){

  var styleEl = document.createElement("style"),
      ogTheme = document.querySelector("[href*='assets/editor/themes']"),
      pageWrap = document.getElementsByClassName("page-wrap")[0],
      isLightTheme = false;

  
  // If CodePen's not loading a theme, we don't need to either.
  if (!ogTheme) {
    return;
  }

  // CSS ripped from the default custom theme
  var defaultCSS = ".box,.editor .top-boxes,.CodeMirror-gutter-wrapper{background:#272825} .CodeMirror-cursor{border-left-color:#ffffff} .box pre,.editor .top-boxes pre,.CodeMirror-gutter-wrapper pre{color:#ffffff} .cm-keyword{color:#FA2D7D} .cm-atom{color:#ae81ff} .box-html .cm-atom{color:#ae81ff} .cm-def{color:#F79900} .cm-variable{color:#71D7D0} .cm-variable-2{color:#AE81FF} .cm-variable-3{color:#a6e22e} .cm-header{color:#FA2D7D} .cm-number{color:#B78CFF} .cm-property{color:#71D7D0} .cm-attribute{color:#a6e22e} .cm-builtin{color:#a6e22e} .cm-qualifier{color:#a6e22e} .cm-operator{color:#FA2D7D} .cm-meta{color:#FA2D7D} .cm-string{color:#E9E07F} .cm-string-2{color:#E9E07F} .cm-tag{color:#FA2D7D} .box-css .cm-tag{color:#f92672} .cm-tag.cm-bracket{color:#ffffff} .CodeMirror-linenumber{color:#575344} .CodeMirror-guttermarker-subtle{color:#575344} .cm-comment{color:#575344} .CodeMirror-focused .CodeMirror-selected, .CodeMirror-selected{background-color:#3c3c3c}";
  
  // CSS ripped from a light theme on CodePen. Updates CodePen's UI to accommodate light themes.
  var lightCSS = ".editor-title-button svg{fill:silver}.editor-title-button:focus svg,.editor-title-button:hover svg{fill:#919191}.console-command-line{color:#555;background:#F6F6F6;border-bottom:1px solid #ccc;border-top:1px solid #ccc}.console-command-line-input{color:#222}body.room-editor .main-header,body.room-pres .main-header{border-bottom-color:#fff;box-shadow:0 1px 2px rgba(0,0,0,.1)}body.room-editor .editor-footer,body.room-editor .main-header,body.room-pres .editor-footer,body.room-pres .main-header{background:#fff;color:#000}body.room-editor .pen-title-area .icon-codepen-box,body.room-pres .pen-title-area .icon-codepen-box{fill:#000}body.room-editor .pen-title-area .by .pen-owner-link,body.room-pres .pen-title-area .by .pen-owner-link{color:#000}body.room-editor .editor-footer .button,body.room-editor .primary-actions .button,body.room-pres .editor-footer .button,body.room-pres .primary-actions .button{background:#fff;border-color:#ccc;color:#555}body.room-editor .editor-footer .button>svg,body.room-editor .primary-actions .button>svg,body.room-pres .editor-footer .button>svg,body.room-pres .primary-actions .button>svg{fill:#444}body.room-editor .editor-footer .button:focus,body.room-editor .editor-footer .button:hover,body.room-editor .primary-actions .button:focus,body.room-editor .primary-actions .button:hover,body.room-pres .editor-footer .button:focus,body.room-pres .editor-footer .button:hover,body.room-pres .primary-actions .button:focus,body.room-pres .primary-actions .button:hover{background:#eee}body.room-editor .editor-footer,body.room-pres .editor-footer{border-top-color:#ccc}body.room-editor .collections-select,body.room-pres .collections-select{background:url(https://assets.codepen.io/assets/buttons/arrow-tiny-down-white-35adf71dfb348f6977df19b0243e1dbe.png) 93% 7px no-repeat,#fff!important}body.room-editor .editor-resizer,body.room-editor .editor-resizer-console,body.room-pres .editor-resizer,body.room-pres .editor-resizer-console{background:#CACACA}body.room-editor .result,body.room-pres .result{background:#fff}body.room-editor .loading-text,body.room-pres .loading-text{color:#222}body.room-editor.layout-side .resizer,body.room-pres.layout-side .resizer{background:#fff;box-shadow:-1px 0 1px rgba(0,0,0,.1),1px 0 1px rgba(0,0,0,.1)}body.room-editor.layout-top .resizer,body.room-editor.layout-top .top-boxes .editor-resizer,body.room-pres.layout-top .resizer,body.room-pres.layout-top .top-boxes .editor-resizer{background:#fff;border:0;box-shadow:0 -1px 1px rgba(0,0,0,.1),0 1px 1px rgba(0,0,0,.1)}.CodeMirror-simplescroll-horizontal div,.CodeMirror-simplescroll-vertical div{background:#ccc}.CodeMirror-simplescroll-horizontal,.CodeMirror-simplescroll-vertical{background:#eee}.box-title{color:#555}.powers button{background:#999}.powers{background:#E6E6E6}.powers button:focus,.powers button:hover{background:#635C48}"
  
  // Checks for user-set CSS, and if it doesn't exist just grabs my own personal theme
  chrome.storage.local.get("cmCSS", function(response){
    var css = response.cmCSS || defaultCSS;
    styleEl.innerHTML = css;

    // Appends additional styles for light themes as needed
    chrome.storage.local.get("cmIsLightTheme", function(response){
      if (response.cmIsLightTheme) {
        styleEl.innerHTML += lightCSS;
        isLightTheme = true;
        // This class needs to be added since the resize bar appended by the preview resize module looks rediculous
        // if it's left dark when the theme is light
      }

      init();
    })
  })

  // Listens for messages from the theme toggle script (core/js/customThemeToggle.js)
  function setRuntimeListeners() {
    chrome.runtime.onMessage.addListener(function(message){
      if (message.method === "enable-custom-theme") {
        enableTheme();
      }
      if (message.method === "disable-custom-theme" ) {
        disableTheme();
      }
    });
  }

  // The reason we're removing the old style tag here is that if 
  // the user has CodePen's settings set to use a light theme but the custom
  // theme is a dark theme, all the light styles bleed through.
  //
  //It's not reallly
  // practical to overwrite all of them. Ideally we wouldn't need to do this,
  // it's maybe possible to first check if they're using a light theme by default and
  // adjust accordingly but that seems kinda bad too.
  //
  // This is responsible for an annoying white flicker while the styles swap which
  // suuuuucks but hopefully people aren't toggling themes much...
  function enableTheme() {
    document.head.appendChild(styleEl);
    pageWrap.classList.toggle("ces-light-theme", isLightTheme);
    ogTheme.remove();
  }

  function disableTheme() {
    styleEl.remove();
    document.head.appendChild(ogTheme);
    pageWrap.classList.toggle("ces-light-theme", false);
  }

  function init() {
    setRuntimeListeners();
    chrome.storage.local.get("cmCustomThemeEnabled", function(response){
      if (response.cmCustomThemeEnabled) {
        enableTheme();
      }
    })
  }
})();
