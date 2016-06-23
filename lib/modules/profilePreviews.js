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
  var profileLinks;
  var init = (function() {
    profileLinks = $(".user a");

    // Checks if page is finished building yet. If it is,
    // add event listeners now 'cause the grid-changed event isn't
    // going to fire.
    if (profileLinks.length) {
      addListeners();
    }
    subscribeToGrid();
  })();

  // Listens for an event fired by CodePen whenever
  // the grid updates. This fires on pagination and also
  // if the page itself is slow to load e.g. codepen.io/pens
  function subscribeToGrid(){
    Hub.sub("grid-changed", function(){

      // The unbind handles static profile links on the page,
      // e.g. Picked Posts while paginating Picked Pens on the home page.
      //
      // Without it, you end up appending extra listeners on each page load.
      // Since we're not dealing with a lot of elements, it's ok to be a little
      // inneficient with adding/removing listeners. 
      profileLinks.unbind();

      // Remove all existing profile previews and clear any timeouts
      $(".ces__profile-preview").remove();
      var id = window.setTimeout(function() {}, 0);
      while (id--) {
          window.clearTimeout(id);
      }

      profileLinks = $(".user a");
      addListeners();
    })
  }

  function addListeners() {
    profileLinks.one("mouseenter", function(){
      var profilePreview = new preview($(this));
    })
  }

  // Object that contains the entire profile preview 
  function preview(profileLink){
    var _this = this;
    _this.profileLink = profileLink;
    _this.baseURL = location.protocol + "//codepen.io" + _this.profileLink.attr("href");

    // Grabs a blank template to fill with profile info. Since the template is
    // stored locally, there isn't any problem with making a new AJAX request
    // for the same file repeatedly.
    _this.getTemplate = function(callback){
      u_requestExtensionUrl("lib/html/profile-preview.html", function(response){
       $.get(response, function(response){
         _this.template = $(response);
         callback();
       });
     })
    }

    // Grabs an entire profile page. It would be great to make a smaller request
    // but until CodePen publishes an API this is all we can do.
    _this.getProfileData = function(callback){
      $.ajax({
        "url": _this.baseURL,
        "success": function(response) {
          _this.parseProfileData($(response));
          callback();
        }
      })
    }

    _this.parseProfileData = function(page){
      var profile = {};
      profile.name = page.find("#profile-name-header").text().trim();
      profile.username = page.find("#profile-username").text().trim();
      profile.isPro = !!profile.name.match(/PRO$/);
      if (profile.isPro) {
        profile.name = profile.name.replace(/PRO$/, "").trim();
      }
      profile.avatar = page.find("#profile-image").attr('src');
      profile.followers = page.find("#followers-count").text();
      profile.following = page.find("#following-count").text();
      profile.isFollowing = ( page.find("#follow-this-user").css("display") === "none" );
      _this.profile = profile;
    }

    // Grabs popular Pens via the user's RSS feed (provided by CodePen)
    _this.getPenData = function(callback){
      $.ajax({
        "url" : _this.baseURL + "/popular/feed",
        "success": function(data){
          var pens = _this.parsePenData(data);
          callback();
        }
      });
    }

    _this.parsePenData = function(data){
      var $data = $(data),
          pens = [];

      $data.find("item").each(function(){
        if (pens.length == 3) { return false; } // bail after 3rd Pen

        var
          pen = {},
          $this = $(this);

        pen.title = $this.find("title").text();
        pen.url = $this.find("link").text();
        pen.slug = pen.url.substr(pen.url.lastIndexOf('/') + 1);
        pen.iframe = $("<iframe>");
        pen.iframe.attr("src", location.protocol + "//s.codepen.io/derekjp/fullcpgrid/" + pen.slug);
        pen.iframe.attr("data-title", pen.title);
        pen.iframe.attr("sandbox", initData.__CPDATA.iframe_sandbox);
        pen.iframe.attr("scrolling", "no");
        pen.iframe.attr("frameborder", "0");
        pen.iframe.attr("allowtransparency", "true");
        pen.iframe.addClass("ces__iframe");
        pens.push(pen);
      });

      _this.pens = pens;
    }

    // Responsible for rendering Pens to the preview
    _this.addProfileToPreview = function(){
      var profile = _this.profile,
          template = _this.template,
          name =  template.find(".ces__profile__name");

      name.html(u_escapeHTML(profile.name) + " ");
      if (profile.isPro) {
        name.append($("<span class='ces__pro-badge badge badge-pro'>Pro</span>"));
      }
      template.find(".ces__profile__link").attr("href", _this.baseURL);
      template.find(".ces__profile__username").html(u_escapeHTML(profile.username));
      template.find(".ces__profile__avatar").attr("src", profile.avatar);
      template.find(".ces__profile__followers-stat").html(profile.followers);
      template.find(".ces__profile__followers-link").attr("href", _this.baseURL + "/followers");
      template.find(".ces__profile__following-stat").html(profile.following);
      template.find(".ces__profile__following-link").attr("href", _this.baseURL + "/following");
      handleFollowEvents(profile.isFollowing);

      // Controls toggling of follow/unfollow state
      function handleFollowEvents(initialState) {
        var username = _this.profile.username.substring(1) //removes @
        
        // Strip away follow buttons if it's the user's own profile
        if ( username === initData.__user.username) {
          template.find(".ces__profile__follow-buttons").remove();
          return;
        }

        var state = initialState,
            followButtons = template.find(".ces__profile__follow-buttons"),
            followBaseURL = location.protocol + "//codepen.io/follow/user/" + username,
            followersEl = template.find(".ces__profile__followers-stat"),
            followersNum = parseInt(followersEl.html());

        followButtons.toggleClass("ces__isFollowing", state);
        followButtons.click(function(){
          state = !state;
          $(this).toggleClass("ces__isFollowing", state);
        });

        template.find(".ces__follow-user").click(function(){
          u_CP(followBaseURL + "/follow");
          followersNum++;
          followersEl.html(followersNum);

        });

        template.find(".ces__unfollow-user").click(function(){
          u_CP(followBaseURL + "/unfollow");
          followersNum--;
          followersEl.html(followersNum);
        });
      }
    }

    // Responsible for rendering Pens to the preview
    _this.addPensToPreview = function() {
      var pens = _this.pens,
          pensWrapper = _this.template.find(".ces__profile__pens");

      for ( var i=0; i < pens.length; i++ ) {
        var penWrapper = $("<div class='ces__pen'>");
        var iframeWrapper = $("<div class='ces__iframe-wrap'>");
        var titleWrapper = $("<div class='ces__pen__title'>");
        var penLink = $("<a class='ces__pen__link'>");
        penLink.attr("href", pens[i].url);
        iframeWrapper.append(pens[i].iframe);
        titleWrapper.html(u_escapeHTML(pens[i].title));
        penWrapper
          .append(penLink)
          .append(iframeWrapper)
          .append(titleWrapper);
        
        pensWrapper.append(penWrapper);
      }
    }

    _this.display = function() {
      _this.position();
      _this.template.addClass("active");
    }

    _this.hide = function() {
      _this.template.removeClass("active");
    }

    _this.position = function() {
      var
        offset = _this.profileLink.offset(),
        height = _this.profileLink.height();

      _this.template.css("left", offset.left);
      _this.template.css("top", offset.top + height);
    }

    _this.addListeners = function(){
      var timer;
      _this.profileLink.mouseenter(function(){
        _this.startDisplayTimer();
      })

      // We need to wait until neither the profile link *nor* the
      // preview is hovered to  hide everything.
      //
      // By adding a 0ms timeout we prevent the preview
      // from instantly collapsing when the user moves 
      // their cursor from the link to the preview.
      _this.profileLink.add(_this.template).mouseenter(function(){
        if (timer) {
          clearTimeout(timer);
        }
      }).mouseleave(function(){
        timer = setTimeout(function(){
          _this.stopDisplayTimer();
          _this.hide();
        }, 0)
      })
    }

    _this.startDisplayTimer = function(){
      _this.displayTimer = setTimeout(function(){
        _this.display();
      },1000)
    }

    _this.stopDisplayTimer = function(){
      if (_this.displayTimer) {
        clearTimeout(_this.displayTimer);
      }
    }

    _this.fillTemplate = function(){
      // Holy callback hell
      _this.getProfileData(function(){
        _this.getPenData(function(){
          _this.addProfileToPreview();
          _this.addPensToPreview();
          $("body").append(_this.template);
        })
      })
    }

    _this.init = (function(){
      _this.getTemplate(function(){
        _this.addListeners();
        _this.startDisplayTimer();
        _this.fillTemplate();
      })
    })();
  }
})();
