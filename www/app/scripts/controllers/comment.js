'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:commentCtrl
 * @description
 * # commentCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('commentCtrl', function ($scope, $http, $location, ENV) {
        $scope.expandMenuFlag = false;
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

        $scope.expandMenu = function () {
            $scope.expandMenuFlag = true;
        };

        $scope.closeMenu = function () {
            $scope.expandMenuFlag = false;
        };

        $scope.setHeight = function () {
            $scope.siderbarContainer = $(window).height() - 64;
            $scope.projectContent = $(window).height() - 128;

            $('.siderbar-closed-container').css('height', $scope.siderbarContainer);
            $('.siderbar-expand-container').css('height', $scope.siderbarContainer);
        };

        $scope.goToProfile = function () {
            var url = '/profile-project';
            $location.path(url);
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

        $scope.Logout = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users/logout',
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                if (data.status === 'success') {
                    $location.path('/');
                }
            });
        };

        $scope.init();
    });

