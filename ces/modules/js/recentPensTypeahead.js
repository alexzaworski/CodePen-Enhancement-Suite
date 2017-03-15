/*
* ---
* RECENT PENS TYPEAHEAD MODULE
* ---
*
* Adds a user's recent Pens to the external resource typeaheads
*
*/

(function () {
  'use strict';

  var pens = [];
  var $document = $(document);

  // We need this data basically right away, we can't wait
  // until the userinitiates a typeahead because the
  // dataFilter function needs to be synchronous
  $.get(location.protocol + '//codepen.io/' + CES.initData.__user.username + '/public/feed', function (response) {
    parsePenData(response);
  });

  function parsePenData (data) {
    var $data = $(data);
    $data.find('item').each(function () {
      var pen = {};
      var $this = $(this);
      pen.name = $this.find('title').html().toLowerCase().replace(/\s/g, '-');
      pen.value = $this.find('link').text();
      pen.tokens = ['::']; // adds a cute 'lil shortcut to filter out Pens
      pens.push(pen);
    });
  }

  $document.ajaxSend(function (event, jqxhr, settings) {
    if (settings.url.match(/(cdncss_data|cdnjs_data)/)) {
      settings.dataFilter = addPensToData;
    }
  });

  function addPensToData (data) {
    data = JSON.parse(data);
    if (pens) {
      $.each(pens, function () {
        data.push(this);
      });
    }
    return JSON.stringify(data);
  }
})();
