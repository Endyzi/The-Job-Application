var appMainModule = angular.module('app', ['ngRoute'])
.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/step1', { templateUrl: 'template/step1.html', controller: 'Step1Controller' })
    $routeProvider.when('/step2', { templateUrl: 'template/step2.html', controller: 'Step2Controller' })
    $routeProvider.when('/step3', { templateUrl: 'template/step3.html', controller: 'Step3Controller' })
    $routeProvider.when('/step4', { templateUrl: 'template/step4.html', controller: 'Step4Controller' })
    $routeProvider.otherwise({ redirectTo: '/step1' });
});

appMainModule.controller('StepController', ['$scope', '$http', '$location', '$window',
function ($scope, $http, $location, $window) {
    $scope.step1Model = new Step1Model();
    $scope.step2Model = new Step2Model();
    $scope.step3Model = new Step3Model();
    $scope.step4Model = new Step4Model();

    $scope.stepModel = function () {
        return $scope.step1Model.concat($scope.step2Model);
    }

    $scope.previous = function () {
        $window.history.back();
    }

    $scope.step2 = function (valid) {
        $scope.submitted = true;
        if (valid)
            $location.path("/step2");

        $scope.step1Model.Initialized = true;
    };

    $scope.step3 = function (valid) {
        if (valid)
            $location.path("/step3");

        $scope.step2Model.Initialized = true;
    };

    $scope.step4 = function (valid) {
        if (valid)
            $location.path("/step4");

        $scope.step3Model.Initialized = true;
    };

}
]);

appMainModule.controller('Step1Controller', ['$scope', '$http', '$location',
    function ($scope, $http, $location) {


    }
]);

appMainModule.controller('Step2Controller', ['$scope', '$http', '$location',
    function ($scope, $http, $location) {

        if (!$scope.step1Model.Initialized)
            $location.path('/step1');
    }
]);

appMainModule.controller('Step3Controller', ['$scope', '$http', '$location',
function ($scope, $http, $location) {

    if (!$scope.step2Model.Initialized)
        $location.path('/step1');
}
]);

appMainModule.controller('Step4Controller', ['$scope', '$http', '$location',
function ($scope, $http, $location) {

    if (!$scope.step3Model.Initialized)
        $location.path('/step1');

    $scope.step4Model.FileProfileImage = '';
    $scope.step4Model.FilePersonalLetter = '';
    $scope.step4Model.FileCv = '';

    $scope.addworkplace = function () {
        $scope.step4Model.PreferredWorkplaces.push($scope.selectedItem);
    }

    $scope.removeworkplace = function (index) {
        $scope.step4Model.PreferredWorkplaces.splice(index, 1);
    }

    $scope.submit = function () {
        $scope.isSubmitted = true;
    };

    $scope.stepmodels = function () {
        return angular.extend($scope.step1Model, $scope.step2Model, $scope.step3Model, $scope.step4Model);
    }

}
])
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    if (element[0].files[0].size > 10000000) {
                        alert('Vänligen begränsa filstorleken');
                        element.val(null);
                        return;
                    }

                    var extension = element[0].files[0].name.split('.').pop();
                    if ('exe zip'.indexOf(extension) > -1) {
                        alert('Vänligen välj en annan filtyp');
                        element.val(null);
                        return;
                    }

                    modelSetter(scope, element[0].files[0].name);
                });
            });
        }
    };
}]);

