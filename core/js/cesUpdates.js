var currentPatch = "0.3.0";

chrome.storage.local.get("disable-patch-notes", function(response){
  
  // Note: never ever change this to a different name, you'll bypass the setting
  if (!!response["disable-patch-notes"]) {
    return;
  }
  else {
    chrome.storage.local.get("0.3.0-patch-notes", function(response){
      if (!!!response[currentPatch + "-patch-notes"]) {
        init();
      }
    })
  }
})

function init(){
  var notes = `<ul>
                <li>On-hover profile previews while<br>browsing Pens or Posts</li>
                <li>Inline Lint button in JavaScript editor</li>
                <li>Fixed some bugs</li>
                <li>Added some bugs</li>
              </ul>
              <p>
                <a target="_blank" href="https://github.com/alexzaworski/CodePen-Enhancement-Suite#new-profile-previews">See what's new</a>
              </p>
              <div class="ces__update__actions ces__clearfix">
                <button id="ces__hide-forever" class="ces__text-like-button">Never show patch notes</button>
                <button id="ces__dismiss" class="ces__update__dismiss button button-medium green">Dismiss</button>
              </div>`;
  var template = `<div id="ces__updates" class="ces__update-modal">
                    <h3 class="ces__update__title">CodePen Enhancement Suite ${currentPatch}</h3>
                    <div class="ces__update__notes">
                      ${notes}
                    </div>
                  </div>`

var modal = document.createElement("div");
modal.innerHTML = template;
modal = modal.firstChild;
document.body.appendChild(modal);

  var dismissButton = document.getElementById("ces__dismiss");
  var modal = document.getElementById("ces__updates");
  dismissButton.addEventListener("click", function(){
    modal.parentNode.removeChild(modal);
    chrome.storage.local.set({"0.3.0-patch-notes":true});
  });

  var hideForever = document.getElementById("ces__hide-forever");
  hideForever.addEventListener("click", function(){
    modal.parentNode.removeChild(modal);
     chrome.storage.local.set({"disable-patch-notes":true});
  });
}
