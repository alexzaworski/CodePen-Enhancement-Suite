/*
* ---
* CUSTOM PEN SLUGS MODULE
* ---
*
* Creates an additional input in the Pen Settings modal that allows users to
* manually set the slug of their Pen.
*
* The CES Save module (cesSave.js) handles the actual sending of all data
* to CodePen as well as input validation.
*
*/

var ces__customPenSlugs = (function(){
  var penSettings = initData.__pen;
  var initialSlug = penSettings.slug_hash;
  var div = $("<div>");
  u_requestExtensionUrl("lib/html/pen-slug.html", function(response){
    div.load(response, function(){
      $("#pen-details-title").parent().after(div);
      $("#pen-details-slug").val(penSettings.slug_hash);
      if (initialSlug === "") {
        $("#pen-details-slug").addClass("disabled");
        $("#pen-slug-instructions").html("Custom slugs are only available for Pens that have been saved at least once.");
      }
    });
  });
})();