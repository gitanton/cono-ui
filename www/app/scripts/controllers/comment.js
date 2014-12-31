'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:commentCtrl
 * @description
 * # commentCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('commentCtrl', function ($scope) {
    $scope.showCalendar = function(){
        $('#datetimepicker').datetimepicker();
        $('#datetimepicker').show();
    }
  });
