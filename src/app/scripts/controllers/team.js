'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:TeamCtrl
 * @description
 * # TeamCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('TeamCtrl', function ($scope, $http, $location, $window, teamService, userService, NAV) {
        $scope.memberUuid = 0;
        $('.team-content').css('height', $scope.teamContent);

        $scope.init = function () {
            teamService.list().then(function (teams) {
                $scope.teams = teams;
            });
            teamService.get().then(function(team) {
                $scope.team = team;
            });

            userService.get().then(function(user) {
                $scope.currentUser = user.fullname;
                $scope.currentUuid = user.uuid;
            });
        };

//    $(".team-content-offset").on('mouseover',function(){
//        $(this).find(".team-content-permissions").show();
//    }).on('mouseout',function(){
//        $(this).find(".team-content-permissions").hide();
//    });

        $scope.hoverOver = function (event) {
            $(event.target).parents('.team-content-offset').find('.team-content-permissions').show();
        };

        $scope.hoverLeave = function (event) {
            $(event.target).hide();
        };

        $scope.goToEdit = function (ouuid, tuuid) {
            var url = '/userpage/' + ouuid + '/' + tuuid;
            $location.path(url);
        };

        $scope.selectTeam = function (val, index) {
            $('.defaultTeam').html(val);
            $('.team-content-offset').hide();
            $('.team-content-offset').eq(index).show();
        };

        $scope.init();
    });
