'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
