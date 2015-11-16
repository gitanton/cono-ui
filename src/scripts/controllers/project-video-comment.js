'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectCommentVideoCtrl
 * @description
 * # ProjectCommentVideoCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectCommentVideoCtrl', function ($scope, $http, $location, $routeParams, ENV, NAV) {
        $scope.activeProjectUuid = $routeParams.uuid;
        $scope.model = {};

        /**
         * Navigation
         */
        $scope.hasScreens = function() {
            return false;
        };
        $scope.hasVideos = function() {
            return true;
        };
        $scope.isComment = function() {
            return true;
        };
        $scope.videoURL = '#/'+NAV.PROJECT_VIDEO+'/' + $scope.activeProjectUuid;
        $scope.buildURL = '#/'+NAV.PROJECT_VIDEO_PLAY+'/' + $scope.activeProjectUuid;
        $scope.activityURL = '#/'+NAV.PROJECT_VIDEO_ACTIVITY+'/' + $scope.activeProjectUuid;
        $scope.commentURL = '#/'+NAV.PROJECT_VIDEO_COMMENT+'/' + $scope.activeProjectUuid;

        $scope.init = function () {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + $scope.activeProjectUuid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                var data = response.data;
                $scope.updateProjectTitle = data.name;
                $scope.updateProjectTypeid = data.type_id;
                $scope.projectMembers = data.users;
            });

            $http({
                url: ENV.API_ENDPOINT + 'messages/?project_uuid=' + $scope.activeProjectUuid,
                method: 'GET'
            }).then(function (response) {
                $scope.messages = response.data;
            });
        };

        $scope.openUpdateProject = function () {
            $('#updateproject').modal('toggle');
        };

        $scope.updateMyProject = function (uuid) {
            $http({
                url: ENV.API_ENDPOINT + 'projects/project/' + uuid,
                method: 'PUT',
                data: {name: $scope.updateProjectTitle, type_id: $scope.updateProjectTypeid}
            }).then(function () {
                $scope.init();
                $('#updateproject').modal('hide');
            });
        };

        $scope.openAddComment = function () {
            $scope.messageContent = '';
            $scope.recipients = '';
            $('#addNewMessage').modal('toggle');
        };

        $scope.addNewComment = function () {
            $http({
                url: ENV.API_ENDPOINT + 'messages',
                method: 'POST',
                data: $.param({
                    content: $scope.model.messageContent,
                    project_uuid: $scope.activeProjectUuid,
                    recipients: $scope.model.recipients.join(',')
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function () {
                $scope.init();
                $('#addNewMessage').modal('hide');
            }, function (error) {
                $('#addNewMessage').modal('hide');
                $('.reset-note').html(error.data.message);
                $('#statusNotice').modal('toggle');
            });
        };

        $scope.replyMessageModal = function (uuid) {
            $scope.replyContent = '';
            $('#replymessage').modal('toggle');
            $scope.replyMessageUuid = uuid;
        };

        $scope.replyMessage = function () {
            $http({
                url: ENV.API_ENDPOINT + 'messages',
                method: 'POST',
                data: $.param({
                    content: $scope.model.replyContent,
                    project_uuid: $scope.activeProjectUuid,
                    parent_uuid: $scope.replyMessageUuid
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function () {
                $scope.init();
                $('#replymessage').modal('hide');
            }, function (error) {
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
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function () {
                $scope.init();
                $('#deletemessage').modal('hide');
            });
        };

        $scope.openMessage = function () {
            var url = '/message/' + $scope.activeProjectUuid;
            $location.path(url);
        };

        $scope.init();
    });
