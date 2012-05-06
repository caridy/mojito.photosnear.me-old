YUI.add('pnm-templates', function (Y) {

var Templates = Y.namespace('PNM').Templates = {};


    Templates['grid'] = Y.Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials;
  var buffer = "", stack1, stack2, foundHelper, tmp1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['grid-photo'], 'grid-photo', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;}

  buffer += "<ul class=\"layout\">\n";
  foundHelper = helpers.photos;
  stack1 = foundHelper || depth0.photos;
  stack2 = helpers.each;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n\n<p class=\"loading\"></p>\n";
  return buffer;});

    Templates['header'] = Y.Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <a href=\"/places/";
  foundHelper = helpers.place;
  stack1 = foundHelper || depth0.place;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.id);
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "place.id", { hash: {} }); }
  buffer += escapeExpression(stack1) + "/\">\n        Photos Near <span id=\"location\">";
  foundHelper = helpers.place;
  stack1 = foundHelper || depth0.place;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.text);
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "place.text", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</span>\n    </a>\n    ";
  return buffer;}

function program3(depth0,data) {
  
  
  return "\n    Photos Near <span id=\"location\">Me</span>\n    ";}

  buffer += "<h1>\n    <a href=\"/\" id=\"logo\">\n        <span class=\"pin-shadow\"></span>\n        <span class=\"pin\"></span>\n    </a>\n    ";
  foundHelper = helpers.place;
  stack1 = foundHelper || depth0.place;
  stack2 = helpers['if'];
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.program(3, program3, data);
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</h1>\n";
  return buffer;});

    Templates['lightbox'] = Y.Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n    <ul class=\"photo-nav layout\">\n        ";
  foundHelper = helpers.nav;
  stack1 = foundHelper || depth0.nav;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.prev);
  stack2 = helpers['if'];
  tmp1 = self.program(2, program2, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  foundHelper = helpers.nav;
  stack1 = foundHelper || depth0.nav;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.next);
  stack2 = helpers['if'];
  tmp1 = self.program(4, program4, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n    ";
  return buffer;}
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <li class=\"prev\"><a href=\"/photos/";
  foundHelper = helpers.nav;
  stack1 = foundHelper || depth0.nav;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.prev);
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "nav.prev", { hash: {} }); }
  buffer += escapeExpression(stack1) + "/\">« Previous</a></li>\n        ";
  return buffer;}

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <li class=\"next\"><a href=\"/photos/";
  foundHelper = helpers.nav;
  stack1 = foundHelper || depth0.nav;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.next);
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "nav.next", { hash: {} }); }
  buffer += escapeExpression(stack1) + "/\">Next »</a></li>\n        ";
  return buffer;}

  buffer += "<div class=\"photo\">\n    <img src=\"";
  foundHelper = helpers.photo;
  stack1 = foundHelper || depth0.photo;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.largeUrl);
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "photo.largeUrl", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" />\n\n    ";
  foundHelper = helpers.nav;
  stack1 = foundHelper || depth0.nav;
  stack2 = helpers['if'];
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n    <div class=\"photo-info\">\n        <h2 class=\"photo-title\">\n            <a href=\"";
  foundHelper = helpers.photo;
  stack1 = foundHelper || depth0.photo;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.pageUrl);
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "photo.pageUrl", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" title=\"View on Flickr\">";
  foundHelper = helpers.photo;
  stack1 = foundHelper || depth0.photo;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "photo.title", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a>\n        </h2>\n    </div>\n</div>\n";
  return buffer;});

    Templates['grid-photo'] = Y.Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<li class=\"photo\">\n    <a href=\"/photos/";
  foundHelper = helpers.id;
  stack1 = foundHelper || depth0.id;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
  buffer += escapeExpression(stack1) + "/\">\n        <img title=\"";
  foundHelper = helpers.title;
  stack1 = foundHelper || depth0.title;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" src=\"";
  foundHelper = helpers.thumbUrl;
  stack1 = foundHelper || depth0.thumbUrl;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "thumbUrl", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\"\n            alt=\"Thumbnail of a photo with title: ";
  foundHelper = helpers.title;
  stack1 = foundHelper || depth0.title;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" />\n    </a>\n</li>\n";
  return buffer;});

    Templates['no-location'] = Y.Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<p>Unable to determine your location :(</p>\n";});

    Templates['title'] = Y.Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    Photos Near: ";
  foundHelper = helpers.place;
  stack1 = foundHelper || depth0.place;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.text);
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "place.text", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n";
  return buffer;}

function program3(depth0,data) {
  
  
  return "\n    Photos Near Me\n";}

  foundHelper = helpers.place;
  stack1 = foundHelper || depth0.place;
  stack2 = helpers['if'];
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.program(3, program3, data);
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});


}, '0.5.0', {
    requires: ['handlebars-base']
});