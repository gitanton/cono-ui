'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ProfileBillingCtrl
 * @description
 * # ProfileBillingCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('ProfileBillingCtrl', function ($scope) {
     $scope.billingOne = true;
     $scope.billingTwo = false;
     $scope.billingThree = false;
      
     $scope.setHeight = function(){
        $scope.siderbarContainer = $(window).height() - 64;
        $scope.siderbarExpand = $(window).height() - 442;
        $scope.profileBillingContent = $(window).height() - 250;
        
        $(".siderbar-closed-container").css('height',$scope.siderbarContainer);
        $(".siderbar-closed-container-expand").css('padding-top',$scope.siderbarExpand);
        $(".profileBilling-content-billing").css('height',$scope.profileBillingContent);
    };
    
    $scope.backBilling = function(){
        $scope.billingOne = true;
        $scope.billingTwo = false;
        $scope.billingThree = false;
    }
    
    $scope.changeCard = function(){
        $scope.billingOne = false;
        $scope.billingTwo = true;
        $scope.billingThree = false;
    }
    
    $scope.upgradePlan = function(){
        $scope.billingOne = false;
        $scope.billingTwo = false;
        $scope.billingThree = true;
    }
  });
