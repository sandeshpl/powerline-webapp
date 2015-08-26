angular.module('app.directives').directive("ddSelect", function(){
return {
  scope: {
    values: "&ddSelect",
    text: "@text",
    value: "@value",
    acronym : "@acronym",
    icon:"@icon",
    highlight: "=?highlight",
    click: "=?click",
    id: "@id"
  },

  link: function (scope, element) {
    var applyToScope = function(element, scopeFn){
      var selectedValue = angular.element(element).children("a").children("input[type=hidden]").attr("value");
      angular.forEach(scope.values, function(value){
        //console.log(1);
        if (value[scope.value] == selectedValue) {
          scope.$apply(function() {
            scopeFn(value);
          });
          //debugger;
        }
      });
    };

    var buildSelectElement = function () {
      element.empty();
      angular.forEach(scope.values, function(item) {

        item[scope.text] = item[scope.acronym] || item[scope.text];

        element.append($("<option data-imagesrc='"+item[scope.icon]+"' value='" + item[scope.value] + "'>" + item[scope.text] +"</option>"));
      });
    };

    var rebuildDdslick = function (fn) {
      element.ddslick('destroy');
      if (fn())
      {
        element.ddslick();
      }
    };

    var addHandlers = function() {
      angular.element("#" + scope.id).children("ul").children("li")
        .mouseover(function(e) {
          applyToScope(this, function(value) { scope.highlight = value; });
        })
        .click(function(e){
          applyToScope(this, function(value) { scope.click = value; });
        });
    };

    scope.$watchCollection(scope.values, function(newValues){
      scope.values = newValues;
      
      rebuildDdslick(function() {
        if (!angular.isArray(scope.values) || scope.values.length === 0) return false;

        buildSelectElement();
        return true;
      });

      addHandlers();
    });
  }
};
});