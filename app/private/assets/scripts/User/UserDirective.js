app.directive("passwordVerify", function() {
   return {
      require: "ngModel",
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function() {
            var combined;

            if (scope.passwordVerify || ctrl.$viewValue) {
               combined = scope.passwordVerify + '_' + ctrl.$viewValue;
            }
            return combined;
        }, function(value) {
            if (value) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var origin = scope.passwordVerify;
                    if (origin !== viewValue) {
                        ctrl.$setValidity("passwordVerify", false);
                        return undefined;
                    } else {
                        ctrl.$setValidity("passwordVerify", true);
                        return viewValue;
                    }
                });
            }
        });
     }
   };
});
app.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value, color) {
            color = 'rgba(8, 15, 255, 0.5)';
            element.css({
                'background-image': 'linear-gradient(to bottom, ' + color + ' 0%, rgba(0, 0, 0, 0.7) 100%), url(' + value + ')',
                'background-size' : 'cover',
                'background-attachment' : 'fixed',
                'background-position': 'center'
            });
        });
    };
});
