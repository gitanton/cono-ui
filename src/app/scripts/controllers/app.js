'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:ActivityCtrl
 * @description
 * # ActivityCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .constant('RC_FREE_TRIAL_EXPIRED', 402)
    .controller('AppCtrl', function ($scope, $rootScope, ModalService, NAV) {
        /**
         * Any controller can emit a UI:Error, UI:Success event to trigger the error popup
         */
        $scope.showAlert = function(args, cls) {
            return ModalService.showModal({
                templateUrl: "views/modal/alert.html",
                controller: "ModalAlertCtrl",
                inputs: {
                    title: args.title,
                    content: args.content,
                    cssClass: cls
                }
            }).then(function (modal) {
                modal.element.modal();
            });
        };

        $rootScope.$on('ui:error', function (event, args) {
            $scope.showAlert(args, 'error');
        });
        $rootScope.$on('ui:info', function (event, args) {
            $scope.showAlert(args, 'info');
        });
        $rootScope.$on('ui:success', function (event, args) {
            $scope.showAlert(args, 'success');
        });
        $rootScope.$on('ui:warn', function (event, args) {
            $scope.showAlert(args, 'warn');
        });
    });
