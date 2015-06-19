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
        $scope.plans = [];

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
                $scope.plan = data.plan;
                $scope.planName = data.plan.name;
                $scope.planId = data.plan.id.toString();
                $scope.planPrice = data.plan.price;
                $scope.teamMember = data.plan.team_members;
            });

            $http({
                url: ENV.API_ENDPOINT + 'users/billing_history',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.billings = data;
            });
        };

        $scope.addCardInfo = function(){
            var $form = $('#payment-form');
            var token = Stripe.card.createToken($form, $scope.stripeResponseHandler());;

            $http({
                url: ENV.API_ENDPOINT + 'users/subscription',
                method: 'POST',
                data:{token: token},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data){
                console.log(data);
            });
        };

        $scope.stripeResponseHandler = function(status, response) {
            var $form = $('#payment-form');

            if (response.error) {
                // Show the errors on the form
                $form.find('.payment-errors').text(response.error.message);
                $form.find('button').prop('disabled', false);
            }else{
                // response contains id and card, which contains additional card details
                var token = response.id;
                // Insert the token into the form so it gets submitted to the server
                $form.append($('<input type="hidden" name="stripeToken" />').val(token));
            }

            return token;
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

        $scope.activePlan = function (planId) {
            $scope.planId = planId;
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
