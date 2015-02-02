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
      .when('/project-screen-video', {
        templateUrl: 'views/project-screen-video.html',
        controller: 'ProjectScreenVideoCtrl'
      })
      .when('/project-activity-video', {
        templateUrl: 'views/project-activity-video.html',
        controller: 'ProjectActivityVideoCtrl'
      })
      .when('/project-comment-video', {
        templateUrl: 'views/project-comment-video.html',
        controller: 'ProjectCommentVideoCtrl'
      })
      .when('/register-billingInfo', {
        templateUrl: 'views/register-billingInfo.html',
        controller: 'registerBillingCtrl'
      })
      .when('/register-plan', {
        templateUrl: 'views/register-plan.html',
        controller: 'registerPlanCtrl'
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
