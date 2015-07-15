'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('MessageCtrl', function ($scope, $http, ENV) {
        $scope.messageContent = $(window).height() - 194;
        $('.message-content').css('height', $scope.messageContent);

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'messages/',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {
                $scope.messages = data;
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
        //     }).success(function() {
        //         $scope.init();
        //         $('#addNewMessage').modal('hide');
        //     }).error(function(data){
        //         $('#addNewMessage').modal('hide');
        //         $('.reset-note').html(data.message);
        //         $('#statusNotice').modal('toggle');
        //     });
        // };

        $scope.replyMessageModal = function(muuid,puuid){
            $scope.messagecontent = '';
            $('#replymessage').modal('toggle');
            $scope.replyMessageUuid = muuid;
            $scope.replyProjectUuid = puuid;
            $scope.messagecontent = '';
        };

        $scope.replyMessage = function(){
            $http({
                url: ENV.API_ENDPOINT + 'messages',
                method: 'POST',
                data: $.param({content:$scope.messagecontent,project_uuid:$scope.replyProjectUuid,parent_uuid:$scope.replyMessageUuid}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function() {
                $scope.init();
                $('#replymessage').modal('hide');
            }).error(function(data){
                $('#replymessage').modal('hide');
                $('.reset-note').html(data.message);
                $('#statusNotice').modal('toggle');
            });
        };

        $scope.deleteMessageModal = function(uuid){
            $('#deletemessage').modal('toggle');
            $scope.deleteMessageUuid = uuid;
        };

        $scope.deleteMessage = function(){
            $http({
                url: ENV.API_ENDPOINT + 'messages/message/'+$scope.deleteMessageUuid,
                method: 'DELETE',
                data: $.param({uuid:$scope.deleteMessageUuid}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function() {
                $scope.init();
                $('#deletemessage').modal('hide');
            });
        };

        $scope.init();
  });
