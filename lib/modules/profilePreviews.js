/*
* ---
* PROFILE PREVIEWS MODULE
* ---
*
* Opens up an inline preview of a user profile on hover
*
*/

var ces__inlineProfiles = (function(){
  "use strict";

  var profileLinks = $(".user a");

  var init = (function() {
    if (!profileLinks.length) {
      var waitForLinks = new MutationObserver(function(mutations, observer){
        profileLinks = $(".user a");
        if (profileLinks.length) {
          addListeners();
          observer.disconnect();
          return;
        }
      });
      waitForLinks.observe(document, {
        childList:true,
        subtree: true
      });
    }
    else {
      addListeners();
    }

    Hub.sub("grid-changed", function(){
      console.log(1);
      profileLinks = $(".user a");
      profileLinks.off("mouseover");
      addListeners();
    })
  })();


  function addListeners() {
    profileLinks.mouseover(function(e){
      profileLinks.off("mouseover");
      setupPreview($(this), e.pageX, e.pageY);
    });
  }
  
  function handlePens(pensUrl) {
    $.ajax({
      "url" : pensUrl,
      "success": function(data){
        var pens = parsePens(data);
        addPensToPreview(pens);
      }
    });
  }

  function handleProfile(url) {
    $.ajax({
      "url": url,
      "success": function(data) {
        var profile = parseProfile($(data));
      }
    })
  }

  function parseProfile(page) {
    var profile = {};
    profile.name = page.find("#profile-name-header").text().trim();
    profile.username = page.find("#profile-username").text().trim();
    profile.isPro = !!profile.name.match(/PRO$/);
    if (profile.isPro) {
      profile.name = profile.name.replace(/PRO$/, "").trim();
    }
    profile.baseURL = "/" + profile.username.replace("@", "");
    profile.avatar = page.find("#profile-image").attr('src');
    profile.followers = page.find("#followers-count").text();
    profile.following = page.find("#following-count").text();
    addProfileToPreview(profile);
  
  }
  function addPensToPreview(pens) {
    var pensWrapper = $("#ces__profile__pens");
    for ( var i=0; i < pens.length; i++ ) {
      var penWrapper = $("<div class='ces__pen'>");
      var iframeWrapper = $("<div class='ces__iframe-wrap'>");
      var titleWrapper = $("<div class='ces__pen__title'>");
      var penLink = $("<a class='ces__pen__link'>");
      penLink.attr("href", pens[i].url);
      iframeWrapper.append(pens[i].iframe);
      titleWrapper.html(u_escapeHTML(pens[i].title));
      penWrapper
        .append(iframeWrapper)
        .append(titleWrapper)
        .append(penLink);
      pensWrapper.append(penWrapper);
    }
  }

  function addProfileToPreview(profile) {
    var name =  $("#ces__profile__name");
    name.html(u_escapeHTML(profile.name) + " ");
    if (profile.isPro) {
      var proBadge = $("<span class='badge badge-pro'>Pro</span>");
      name.append(proBadge);
    }
    $("#ces__profile__link").attr("href", profile.baseURL);
    $("#ces__profile__username").html(u_escapeHTML(profile.username));
    $("#ces__profile__avatar").attr("src", profile.avatar);
    $("#ces__profile__followers").html(profile.followers);
    $("#ces__profile__followers-link").attr("href", profile.baseURL + "/followers");
    $("#ces__profile__following").html(profile.following);
    $("#ces__profile__following-link").attr("href", profile.baseURL + "/following");

  }

  function setupPreview(profileLink, mouseX, mouseY) {
    
    var url = profileLink.attr("href");
    var pensUrl = url + "/popular/feed";

    u_requestExtensionUrl("lib/html/profile-preview.html", function(response){
      $.get(response, function(response){
        var preview = $(response);
        $("body").append(preview);
        preview.css("left", mouseX);
        preview.css("top", mouseY);
        handlePens(pensUrl);
        handleProfile(url);
      })
    });
  }

  function parsePens(data) {
    var $data = $(data);
    var pens = [];
    $data.find("item").each(function(){
      if (pens.length == 3) {
        return false;
      }
      var pen = {};
      var $this = $(this);
      pen.title = $this.find("title").text();
      pen.url = $this.find("link").text();
      pen.slug = pen.url.substr(pen.url.lastIndexOf('/') + 1);
      pen.iframe = buildIframe(pen.slug, pen.title);
      pens.push(pen);
    });
    return pens;
  }

  function buildIframe(slug, title) {
    var iframe = $("<iframe>");
    iframe.attr("src", location.protocol + "//s.codepen.io/derekjp/fullcpgrid/" + slug);
    iframe.attr("data-title", title);
    iframe.attr("sandbox", initData.__CPDATA.iframe_sandbox);
    iframe.attr("scrolling", "no");
    iframe.attr("frameborder", "0");
    iframe.attr("allowtransparency", "true");
    iframe.addClass("ces__iframe");
    return iframe;
  }
})();



