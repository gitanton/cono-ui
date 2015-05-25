'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('MessageCtrl', function ($scope,$http,currentUser) {
      $scope.messageContent = $(window).height() - 194;
      $(".message-content").css('height',$scope.messageContent);
      
//      $('.message-content').jScrollPane();
      
      $scope.init = function(){
          $http({
                url: 'http://conojoapp.scmreview.com/rest/messages/',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {
                $scope.messages = data;
            });
      }
    
    $scope.replyMessageModal = function(muuid,puuid){
        $('#replymessage').modal('toggle');
        $scope.replyMessageUuid = muuid;
        $scope.replyProjectUuid = puuid;
    };
    
    $scope.replyMessage = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/messages',
            method: 'POST',
            data: $.param({content:$scope.messagecontent,project_uuid:$scope.replyProjectUuid,parent_uuid:$scope.replyMessageUuid}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $scope.init();
            $('#replymessage').modal('hide');
        });
    }
    
    $scope.deleteMessageModal = function(uuid){
        $('#deletemessage').modal('toggle');
        $scope.deleteMessageUuid = uuid;
    };
    
    $scope.deleteMessage = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/messages/message/'+$scope.deleteMessageUuid,
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
