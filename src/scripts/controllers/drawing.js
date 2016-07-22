'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:DrawingCtrl
 * @description
 * # DrawingCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('DrawingCtrl', function ($rootScope, $scope, $http, ENV, NAV) {

        // Drawing Variables
        $scope.tool = 1;
        $scope.color = "";
        

        $scope.init = function () {
            
        };

        $scope.init();
    });
