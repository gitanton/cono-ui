'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:commentCtrl
 * @description
 * # commentCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('commentCtrl', function ($scope,$http) {
    $scope.showCalendar = function(){
        $('#datetimepicker').datepicker({
            dateFormat: "yy-mm-dd",
//            beforeShowDay : function(dt){
//                //get all meeting for this user
////                return [true, 'red', 'Test'];
//            },
           onSelect : function() {
                $('#meetingDetail').modal('toggle');
           }
        });
        $('#datetimepicker').show();
    }
    
    $scope.hideCalendar = function(){
        $('#datetimepicker').hide();
    }
    
    $scope.init = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/users',
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
             $scope.users = data;
        });
    }
    
    $scope.init();
  });
