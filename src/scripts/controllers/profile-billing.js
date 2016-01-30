'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:profile-billingCtrl
 * @description
 * # profile-billingCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('profileBillingCtrl', function ($rootScope, $scope, $http, $location, $log, ENV, NAV) {
        $scope.billingOne = true;
        $scope.billingThree = false;
        $scope.saving = false;
        $scope.plans = [];
        $scope.newPlanId = 0;
        $scope.newPlanName = '';
        $scope.newPlanPrice = 0;
        $scope.newPlanMember = 0;
        $scope.newPlanAddedPrice = 0;

        $scope.planId = '';

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'utils/bootstrap',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                $scope.plans = response.data.plans;
            });

            $http({
                url: ENV.API_ENDPOINT + 'users/subscription',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                var data = response.data;
                if (data.plan) {
                    $scope.plan = data.plan;
                    $scope.planName = data.plan.name;
                    $scope.planId = data.plan.id;
                    $scope.planPrice = data.plan.price;
                    $scope.teamMember = data.plan.team_members;
                }
            });

            $http({
                url: ENV.API_ENDPOINT + 'users/billing_history',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                $scope.billings = response.data;
            });
        };

        $scope.hasPlan = function() {
            return $scope.planId > 0;
        };

        $scope.submit = function (isValid) {
            $scope.alertError = false;
            if (!isValid) {
                return false;
            }

            if(!$scope.newPlanId) {
                $scope.alertError = '<i class="fa fa-exclamation-circle"></i> Please choose a plan above';
                return false;
            }

            $scope.saving = true;
            $scope.token = '';
            Stripe.setPublishableKey('pk_test_qfSibHadzKvpVKdrPoBwHbGN');
            Stripe.card.createToken({
                number: $scope.number,
                cvc: $scope.cvc,
                exp_month: $scope.exp_month,
                exp_year: $scope.exp_year
            }, function (status, response) {
                if (response.error) {
                    $scope.saving = false;
                    $scope.alertError = '<i class="fa fa-exclamation-circle"></i> <strong>Credit Card Charge Failed</strong>: '+response.error.message;
                    $log.error({msg: 'User profile update error', error: response.error});
                } else {
                    $scope.token = response.id;

                    $http({
                        url: ENV.API_ENDPOINT + 'users/subscription',
                        method: 'POST',
                        data: $.param({
                            token: $scope.token,
                            plan_id: $scope.newPlanId,
                            additional_users: $scope.newPlanMember
                        }),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function () {
                        $scope.saving = false;
                        $scope.init();
                        $scope.alertSuccess = '<i class="fa fa-check-circle"></i> Your payment has been accepted successfully!';
                    }, function (error) {
                        $scope.saving = false;
                        $scope.alertError = '<i class="fa fa-exclamation-circle"></i> <strong>Credit Card Charge Failed</strong>: '+error.message;
                        $log.error({msg: 'User profile update error', error: error});
                    });
                }
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

        $scope.activePlan = function (newPlanId, newPlanName, newPlanPrice) {
            $scope.planId = newPlanId;
            $scope.newPlanId = newPlanId;
            $scope.newPlanName = newPlanName;
            $scope.newPlanPrice = newPlanPrice;
        };

        $scope.addMember = function () {
            $scope.newPlanMember++;
            $scope.newPlanAddedPrice = $scope.newPlanMember * 10;
        };

        $scope.decreaseMember = function () {
            if ($scope.newPlanMember > 0) {
                $scope.newPlanMember--;
                $scope.newPlanAddedPrice = $scope.newPlanMember * 10;
            }
        };

        $scope.openCancelPlan = function () {
            $('#deleteproject').modal('toggle');
        };

        $scope.cancelPlan = function () {            
            $http({
                url: ENV.API_ENDPOINT + 'users/subscription' + $scope.planId,
                method: 'DELETE',
                data: $.param({Subscription: $scope.planId}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {                
                $scope.init();
                $('#deleteproject').modal('hide');
                $scope.planId= 0;
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
