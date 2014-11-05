'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('MessageCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
