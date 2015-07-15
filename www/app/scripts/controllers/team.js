'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:TeamCtrl
 * @description
 * # TeamCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('TeamCtrl', function ($scope, $http, $location, $window, ENV) {
        $scope.memberUuid = 0;
        $scope.teamContent = $(window).height() - 128;
        $('.team-content').css('height', $scope.teamContent);
        $scope.currentUser = $window.sessionStorage.fullname;
        $scope.currentUuid = $window.sessionStorage.currentUserUuid;

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'teams',
                method: 'GET'
            }).success(function (data) {
                $scope.teams = data;
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

        $scope.goToEdit = function (ouuid,tuuid) {
            var url = '/userpage/' + ouuid + tuuid;
            $location.path(url);
        };

        $scope.selectTeam = function(val,index){
            $('.teams').hide();
            $('.defaultTeam').html(val);
            $('.team-content-offset').hide();
            $('.team-content-offset').eq(index).show();
        };

        $scope.openTeams = function(evt){
            $('.teams').show();
            evt.stopPropagation();
        };

        $(document).on('click', function () {
            $('.teams').hide();
        });

        $('.teams').on('click', function (evt) {
            evt = window.event || evt;
            evt.stopPropagation();
        });

        $scope.init();
    });
