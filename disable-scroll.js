(function(factory) {
  var ngModule = factory(this.angular);
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = ngModule;
  }
})(function(angular) {

  return angular.module("ngDisableScroll", []).directive("ngDisableScroll", [
    "$document",
    function($document) {
      var lastElementToDisableScroll = null;
      $document.find("head").append(
        "<style type='text/css'>.ng-disable-scroll{overflow:hidden !important;}</style>"
      );
      return {
        restrict: "A",
        link: function($scope, $element, $attrs) {
          var rootHtmlElement = angular.element($document[0].documentElement);

          $scope.$watch($attrs.ngDisableScroll, function(shouldDisable) {
            if (shouldDisable) {
              lastElementToDisableScroll = $element;
              rootHtmlElement.addClass("ng-disable-scroll");
              $document.bind("touchmove", touchHandler);
            } else {
              unbindHandler();
            }
          });

          $scope.$on("$destroy", unbindHandler);

          function unbindHandler() {
            $document.unbind("touchmove", touchHandler);
            if ($element === lastElementToDisableScroll) {
              return rootHtmlElement.removeClass("ng-disable-scroll");
            }
          }

          function touchHandler(event) {
            if (!scrollAllowed(event)) {
              return event.preventDefault();
            }
          }

          function scrollAllowed(event) {
            var selector = $attrs.scrollableElements;
            if (!selector) {
              return canScroll(event, $element[0]);
            }
            var predicate = canScroll.bind(null, event);
            return scrollableNodes(selector).some(predicate);
          }

          function canScroll(event, scrollable) {
            return scrollable.contains(event.target) &&
              scrollable.scrollHeight > scrollable.clientHeight;
          }

          function scrollableNodes(selector) {
            var nodes = $element[0].querySelectorAll(selector);
            return Array.prototype.slice.apply(nodes);
          }
        }
      };
    }
  ]);
});
