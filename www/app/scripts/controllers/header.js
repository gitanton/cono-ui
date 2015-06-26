
'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:headerCtrl
 * @description
 * # headerCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('headerCtrl', function ($scope, $http, $location, ENV) {
        $scope.showCalendar = function () {
            $('#datetimepicker').datepicker({
                dateFormat: "yy-mm-dd",
//            beforeShowDay : function(dt){
//                //get all meeting for this user
////                return [true, 'red', 'Test'];
//            },
                onSelect: function () {
                    $('#meetingDetail').modal('toggle');
                }
            });
            $('#datetimepicker').show();
        };

        $scope.hideCalendar = function () {
            $('#datetimepicker').hide();
        };

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.users = data;
            });
        };

        $scope.goToMessages = function () {
            var url = '/message';
            $location.path(url);
        };

        $scope.openFeedBack = function(){
            $('#addFeedback').modal('toggle');
        };

        $scope.addNewFeedBack = function(){
            //add new feedback
        };

        $scope.init();
    });

