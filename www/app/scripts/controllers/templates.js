'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:templatesCtrl
 * @description
 * # templatesCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('templatesCtrl', function ($scope,currentUser) {
    $scope.templatesContent = $(window).height() - 128;
    $(".templates-content").css('height',$scope.templatesContent);
  });
