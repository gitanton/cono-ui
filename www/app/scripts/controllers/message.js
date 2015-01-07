'use strict';

/**
 * @ngdoc function
 * @name conojoApp.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the conojoApp
 */
angular.module('conojoApp')
  .controller('MessageCtrl', function ($scope,$http,$routeParams) {
      $scope.activeProjectUuid = $routeParams.uuid;
      $scope.setHeight = function(){
        $scope.siderbarContainer = $(window).height() - 64;
        $scope.siderbarExpand = $(window).height() - 442;
        $scope.messageContent = $(window).height() - 194;
        
        $(".siderbar-closed-container").css('height',$scope.siderbarContainer);
        $(".siderbar-closed-container-expand").css('padding-top',$scope.siderbarExpand);
        $(".message-content").css('height',$scope.messageContent);
    };
      
      $scope.init = function(){
          $http({
                url: 'http://conojoapp.scmreview.com/rest/messages/',
                method: 'GET',
                data: $.param({project_uuid:$scope.project_uuid}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {
                $scope.messages = data;
            });
      }
      
    $scope.openAddNewMessage = function(){
        $('#addNewMessage').modal('toggle');
    };
    
    $scope.addNewMessage = function(){
        $http({
            url: 'http://conojoapp.scmreview.com/rest/messages/',
            method: 'POST',
            data: $.param({content:$scope.messagecontent,project_uuid:$scope.activeProjectUuid}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function() {
            $scope.init();
            $('#addNewMessage').modal('hide');
        });
    }
    
    $scope.replyMessageModal = function(uuid){
        $('#replymessage').modal('toggle');
        $scope.replyMessageUuid = uuid;
    };
    
    $scope.replyMessage = function(){
        
    }
    
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
    
    $scope.init();
  });
