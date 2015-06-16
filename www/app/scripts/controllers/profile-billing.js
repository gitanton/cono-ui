'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileBillingCtrl
 * @description
 * # ProfileBillingCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProfileBillingCtrl', function ($scope, $http, $location, ENV) {
        $scope.billingOne = true;
        $scope.billingTwo = false;
        $scope.billingThree = false;

        $scope.profileBillingContent = $(window).height() - 250;
        $('.profileBilling-content-billing').css('height', $scope.profileBillingContent);

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'utils/bootstrap',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.plans = data.plans;
            });

            $http({
                url: ENV.API_ENDPOINT + 'users/billing_history',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.billings = data;
            });
        };

        $scope.backBilling = function () {
            $scope.billingOne = true;
            $scope.billingTwo = false;
            $scope.billingThree = false;
        };

        $scope.changeCard = function () {
            $scope.billingOne = false;
            $scope.billingTwo = true;
            $scope.billingThree = false;
        };

        $scope.upgradePlan = function () {
            $scope.billingOne = false;
            $scope.billingTwo = false;
            $scope.billingThree = true;
        };

        $scope.selectPlan = function (planId) {
            $http({
                url: ENV.API_ENDPOINT + 'users/subscription',
                method: 'POST',
                data: $.param({plan_id:planId}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
        };

        $scope.cancelPlan = function(){
            $http({
                url: ENV.API_ENDPOINT + 'users/subscription',
                method: 'DELETE',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(){
                $scope.init();
            })
        }

        $scope.toProject = function () {
            var url = '/profile-project/';
            $location.path(url);
        };

        $scope.toProfile = function () {
            var url = '/profile-profile/';
            $location.path(url);
        };

        $scope.toNotice = function () {
            var url = '/profile-notice/';
            $location.path(url);
        };

        $scope.init();
    });
