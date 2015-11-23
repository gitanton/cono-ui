'use strict';
/**
 * @ngdoc function
 * @name conojoApp.controller:ProjectCommentCtrl
 * @description
 * # ProjectCommentCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
    .controller('ProjectCommentCtrl', function ($rootScope, $scope, $http, $location, $routeParams, ENV, NAV) {
        $scope.activeProjectUuid = $routeParams.uuid;
        $scope.model = {};
        /**
         * Navigation
         */
        $scope.hasScreens = function() {
            return true;
        };
        $scope.hasVideos = function() {
            return false;
        };
        $scope.isComment = function() {
            return true;
        };
        $scope.screenURL = '#/'+NAV.PROJECT_SCREEN+'/' + $scope.activeProjectUuid;
        $scope.buildURL = '#/'+NAV.PROJECT_BUILD+'/' + $scope.activeProjectUuid;
        $scope.activityURL = '#/'+NAV.PROJECT_ACTIVITY+'/' + $scope.activeProjectUuid;
        $scope.commentURL = '#/'+NAV.PROJECT_COMMENT+'/' + $scope.activeProjectUuid;

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
                data: $.param({name: $scope.updateProjectTitle, type_id: $scope.updateProjectTypeid}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
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
            }, function (data) {
                $('#addNewMessage').modal('hide');
                $('.reset-note').html(data.message);
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
            }, function (data) {
                $('#replymessage').modal('hide');
                $('.reset-note').html(data.message);
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
