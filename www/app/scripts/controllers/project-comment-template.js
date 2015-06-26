'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectCommentTemplateCtrl
 * @description
 * # ProjectCommentTemplateCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectCommentTemplateCtrl', function ($scope, $http, $location, $routeParams, ENV) {
        $scope.activeProjectUuid = $routeParams.uuid;
        $scope.projectCommentBody = $(window).height() - 242;
        $('.projectComment-content-body').css('height', $scope.projectCommentBody);

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + $scope.activeProjectUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.updateProjectTitle = data.name;
                $scope.updateProjectTypeid = data.type_id;
            });

            $http({
                url: ENV.API_ENDPOINT + 'messages',
                method: 'GET',
                data: $.param({project_uuid:$scope.activeProjectUuid}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {
                $scope.messages = data;
            });
        };

        $scope.openUpdateProject = function () {
            $('#updateproject').modal('toggle');
        };

        $scope.updateMyProject = function (uuid) {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + uuid,
                method: 'PUT',
                data: $.param({name: $scope.updateProjectTitle, type_id: $scope.updateProjectTypeid}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function () {
                $scope.init();
                $('#updateproject').modal('hide');
            });
        };

        $scope.openAddComment = function(){
            $('#addNewMessage').modal('toggle');
        };

        $scope.addNewComment = function(){
            $http({
                url: 'http://conojoapp.scmreview.com/rest/messages',
                method: 'POST',
                data: $.param({content:$scope.messageContent,project_uuid:$scope.activeProjectUuid}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function() {
                $scope.init();
                $('#addNewMessage').modal('hide');
            });
        };

        $scope.replyMessageModal = function(uuid){
            $('#replymessage').modal('toggle');
            $scope.replyMessageUuid = uuid;
        };

        $scope.replyMessage = function(){
            $http({
                url: 'http://conojoapp.scmreview.com/rest/messages/'+$scope.replyMessageUuid,
                method: 'POST',
                data: $.param({content:$scope.replyContent,project_uuid:$scope.activeProjectUuid,parent_uuid:$scope.replyMessageUuid}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function() {
                $scope.init();
                $('#replymessage').modal('hide');
            });
        };

        $scope.deleteMessageModal = function(uuid){
            $('#deletemessage').modal('toggle');
            $scope.deleteMessageUuid = uuid;
        };

        $scope.deleteMessage = function(){
            $http({
                url: 'http://conojoapp.scmreview.com/rest/messages/message/'+$scope.deleteMessageUuid,
                method: 'DELETE',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function() {
                $scope.init();
                $('#deletemessage').modal('hide');
            });
        };

        $scope.toBuild = function () {
            var url = '/project-build/' + $scope.activeProjectUuid + '/new';
            $location.path(url);
        };

        $scope.toScreen = function () {
            var url = '/project-screen/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.toActivity = function () {
            var url = '/project-activity/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.openMessage = function () {
            var url = '/message/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.init();
    });
