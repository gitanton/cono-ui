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
        $scope.billingThree = false;
        $scope.plans = [];
        $scope.newPlanId = 0;
        $scope.newPlanName = '';
        $scope.newPlanPrice = 0;
        $scope.newPlanMember = 0;
        $scope.newPlanAddedPrice = 0;

        $scope.planId = '';

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
                url: ENV.API_ENDPOINT + 'users/subscription',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                if(data.plan){
                    $scope.plan = data.plan;
                    $scope.planName = data.plan.name;
                    $scope.planId = data.plan.id.toString();
                    $scope.planPrice = data.plan.price;
                    $scope.teamMember = data.plan.team_members;
                }
            });

            $http({
                url: ENV.API_ENDPOINT + 'users/billing_history',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.billings = data;
            });
        };

        $scope.payForPlan = function(){
            var token = '';
            Stripe.setPublishableKey('pk_test_qfSibHadzKvpVKdrPoBwHbGN');
            Stripe.card.createToken({
                number: $scope.number,
                cvc: $scope.cvc,
                exp_month: $scope.exp_month,
                exp_year: $scope.exp_year
            }, function(status, response){
                if (response.error) {
                    $('.reset-note').html(response.error.message);
                    $('#statusNotice').modal('toggle');
                } else {
                    token = response.id;
                    console.log(token);
                }
            });

            $http({
                url: ENV.API_ENDPOINT + 'users/subscription',
                method: 'POST',
                data:$.param({token: token, plan_id: $scope.newPlanId, additional_users: $scope.newPlanMember}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data){
                console.log(data);
            }).error(function(data){
                $('.reset-note').html(data.message);
                $('#statusNotice').modal('toggle');
            });
        };

        $scope.backBilling = function () {
            $scope.billingOne = true;
            $scope.billingThree = false;
        };

        $scope.upgradePlan = function () {
            $scope.billingOne = false;
            $scope.billingThree = true;
        };

        $scope.activePlan = function (newPlanId,newPlanName,newPlanPrice) {
            $scope.planId = newPlanId;
            $scope.newPlanId = newPlanId;
            $scope.newPlanName = newPlanName;
            $scope.newPlanPrice = newPlanPrice;
        };

        $scope.addMember = function(){
            $scope.newPlanMember++;
            $scope.newPlanAddedPrice = $scope.newPlanMember * 10;
        };

        $scope.decreaseMember = function(){
            if($scope.newPlanMember > 0){
                $scope.newPlanMember--;
                $scope.newPlanAddedPrice = $scope.newPlanMember * 10;
            }
        };

        $scope.openCancelPlan = function () {
            $('#deleteproject').modal('toggle');
        };

        $scope.cancelPlan = function () {
            $http({
                url: ENV.API_ENDPOINT + 'users/subscription',
                method: 'DELETE',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(){
                $scope.init();
                $('#deleteproject').modal('hide');
            });
        };

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
