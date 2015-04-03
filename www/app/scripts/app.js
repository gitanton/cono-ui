//'use strict';

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
      .when('/project-video/:uuid', {
        templateUrl: 'views/project-video.html',
        controller: 'ProjectVideoCtrl'
      })
      .when('/project-videoPlay/:puuid/:vuuid', {
        templateUrl: 'views/project-videoPlay.html',
        controller: 'ProjectVideoPlayCtrl'
      })
      .when('/project-activity-video/:uuid', {
        templateUrl: 'views/project-activity-video.html',
        controller: 'ProjectActivityVideoCtrl'
      })
      .when('/project-comment-video/:uuid', {
        templateUrl: 'views/project-comment-video.html',
        controller: 'ProjectCommentVideoCtrl'
      })
      .when('/project-build-template', {
        templateUrl: 'views/project-build-template.html',
        controller: 'ProjectBuildTemplateCtrl'
      })
      .when('/project-templateSelect', {
        templateUrl: 'views/project-templateSelect.html',
        controller: 'ProjectTemplateSelectCtrl'
      })
      .when('/project-templateUpload', {
        templateUrl: 'views/project-templateUpload.html',
        controller: 'ProjectTemplateUploadCtrl'
      })
      .when('/project-activity-template', {
        templateUrl: 'views/project-activity-template.html',
        controller: 'ProjectActivityTemplateCtrl'
      })
      .when('/project-comment-template', {
        templateUrl: 'views/project-comment-template.html',
        controller: 'ProjectCommentTemplateCtrl'
      })
      .when('/register-billingInfo', {
        templateUrl: 'views/register-billingInfo.html',
        controller: 'registerBillingCtrl'
      })
      .when('/register-plan', {
        templateUrl: 'views/register-plan.html',
        controller: 'registerPlanCtrl'
      })
      .when('/forgot-password', {
        templateUrl: 'views/forgot-password.html',
        controller: 'forgotPasswordCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('meetingFlag', function() {
        return {
          startMeeting: false
        }
  })
  .factory('currentUser', function() {
        return {
          currentUserUuid: ''
        }
  })
.directive('draggable', function() {
    return function(scope, element) { 
        // this gives us the native JS object
        var el = element[0];

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function(e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', this.id);
                this.classList.add('drag');
                return false;
            },
            false
        );

        el.addEventListener(
            'dragend',
            function(e) {
                this.classList.remove('drag');
                return false;
            },
            false
        );
    }
})
.directive('droppable', function() {
    return {
        scope: {
            drop: '&' // parent
        },
        link: function(scope, element) {                                                     
            // again we need the native object
            var el = element[0];
                
            el.addEventListener(
                'dragover',
                function(e) {
                    e.dataTransfer.dropEffect = 'move';
                    // allows us to drop
                    if (e.preventDefault) e.preventDefault();
                    this.classList.add('over');
                    return false;
                },
                false
            );
                
             el.addEventListener(
                'dragenter',
                function(e) {
                    this.classList.add('over');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragleave',
                function(e) {
                    this.classList.remove('over');
                    return false;
                },
                false
            );
                
            el.addEventListener(
                'drop',
                function(e) {
                    // Stops some browsers from redirecting.
                    if (e.stopPropagation) e.stopPropagation();

                    this.classList.remove('over');

                    var item = document.getElementById(e.dataTransfer.getData('Text'));
                    this.appendChild(item);
                    item.style.display = 'none';

                    return false;
                },
                false
            );
        }
    }
});
