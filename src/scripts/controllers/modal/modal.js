'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ModalAlertCtrl
 * @description
 * # ModalAlertCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ModalCtrl', function ($scope, $window, close) {
        $scope.viewLink = function(link) {
            $window.location = link;
        };
    });
