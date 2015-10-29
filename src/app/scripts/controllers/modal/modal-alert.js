'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ModalAlertCtrl
 * @description
 * # ModalAlertCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ModalAlertCtrl', function ($scope, title, content, cssClass, close) {
        $scope.title = title;
        $scope.content = content;
        $scope.cssClass = cssClass;
    });
