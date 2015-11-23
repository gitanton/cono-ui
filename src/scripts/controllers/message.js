'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('MessageCtrl', function ($rootScope, $scope, $http, ENV, NAV, $log) {
        $scope.model = {};

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'messages/',
                method: 'GET'
            }).then(function (response) {
                $scope.messages = response.data;
            });
        };

        // $scope.openAddComment = function(){
        //     $('#addNewMessage').modal('toggle');
        // };

        // $scope.addNewComment = function(){
        //     $http({
        //         url: ENV.API_ENDPOINT + 'messages',
        //         method: 'POST',
        //         data: $.param({content:$scope.messageContent,project_uuid:$scope.activeProjectUuid}),
        //         headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        //     }).then(function() {
        //         $scope.init();
        //         $('#addNewMessage').modal('hide');
        //     },function(data){
        //         $('#addNewMessage').modal('hide');
        //         $('.reset-note').html(data.message);
        //         $('#statusNotice').modal('toggle');
        //     });
        // };

        $scope.replyMessageModal = function (muuid, puuid) {
            $scope.messagecontent = '';
            $('#replymessage').modal('toggle');
            $scope.replyMessageUuid = muuid;
            $scope.replyProjectUuid = puuid;
            $scope.model.replyContent = '';
        };

        $scope.replyMessage = function () {
            $http({
                url: ENV.API_ENDPOINT + 'messages',
                method: 'POST',
                data: $.param({
                    content: $scope.model.replyContent,
                    project_uuid: $scope.replyProjectUuid,
                    parent_uuid: $scope.replyMessageUuid
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function () {
                $scope.init();
                $('#replymessage').modal('hide');
            }, function (error) {
                $log.error({error: error});
                $('#replymessage').modal('hide');
                $('.reset-note').html(error.data.message);
                $('#statusNotice').modal('toggle');
            });
        };

        $scope.deleteMessageModal = function (uuid) {
            $('#deletemessage').modal('toggle');
            $scope.deleteMessageUuid = uuid;
        };

        $scope.deleteMessage = function () {
            $http({
                url: ENV.API_ENDPOINT + 'messages/message/' + $scope.deleteMessageUuid,
                method: 'DELETE',
                data: $.param({uuid: $scope.deleteMessageUuid}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function () {
                $scope.init();
                $('#deletemessage').modal('hide');
            });
        };

        $scope.init();
    });
