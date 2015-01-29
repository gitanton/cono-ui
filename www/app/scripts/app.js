'use strict';

/**
 * @ngdoc overview
 * @name conojoApp
 * @description
 * # conojoApp
 *
 * Main module of the application.
 */
angular
  .module('conojoApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
       .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
       .when('/project', {
        templateUrl: 'views/project.html',
        controller: 'ProjectCtrl'
      })
      .when('/activity', {
        templateUrl: 'views/activity.html',
        controller: 'ActivityCtrl'
      })
      .when('/message/:uuid', {
        templateUrl: 'views/message.html',
        controller: 'MessageCtrl'
      })
      .when('/team', {
        templateUrl: 'views/team.html',
        controller: 'TeamCtrl'
      })
      .when('/userpage/:uuid', {
        templateUrl: 'views/userpage.html',
        controller: 'UserpageCtrl'
      })
      .when('/project-build/:puuid/:suuid', {
        templateUrl: 'views/project-build.html',
        controller: 'ProjectBuildCtrl'
      })
      .when('/project-newscreen-build/:puuid', {
        templateUrl: 'views/project-newscreen-build.html',
        controller: 'ProjectNewScreenBuildCtrl'
      })
      .when('/project-screen/:uuid', {
        templateUrl: 'views/project-screen.html',
        controller: 'ProjectScreenCtrl'
      })
      .when('/project-activity/:uuid', {
        templateUrl: 'views/project-activity.html',
        controller: 'ProjectActivityCtrl'
      })
      .when('/project-comment/:uuid', {
        templateUrl: 'views/project-comment.html',
        controller: 'ProjectCommentCtrl'
      })
      .when('/invitation/:invite/:type', {
        templateUrl: 'views/invitation.html',
        controller: 'InvitationCtrl'
      })
      .when('/meeting/:uuid', {
        templateUrl: 'views/meeting.html',
        controller: 'MeetingCtrl'
      })
     .when('/profile-project', {
        templateUrl: 'views/profile-project.html',
        controller: 'ProfileProjectCtrl'
     })
      .when('/profile-profile', {
        templateUrl: 'views/profile-profile.html',
        controller: 'ProfileProfileCtrl'
      })
     .when('/profile-billing', {
        templateUrl: 'views/profile-billing.html',
        controller: 'ProfileBillingCtrl'
     })
     .when('/profile-notice', {
        templateUrl: 'views/profile-notice.html',
        controller: 'ProfileNoticeCtrl'
     })
     .when('/templates', {
        templateUrl: 'views/templates.html',
        controller: 'templatesCtrl'
     })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('meetingFlag', function() {
    return {
      startMeeting: false
    }
});
