conojo-ui
=========

This product is built using yeoman framework with angularjs (1.4.7 currently) using bower and npm.  The app is cross-compiled using
the cordova platform.  All important code is located in the src/ directory.  When cordova is run, the code in src is copied into www.

## Installation
To install and run the app, run the following.  The app requires that you have bower, npm, and ruby gems installed:
```
> cd src
> npm install
> npm install grunt-cli
> bower install
# Install compass
> gem install compass
> grunt serve
```

## Configuration

All configuration values are stored in the src/Gruntfile.js file.  Edit them there under the ngconstant section.  These values
are used when grunt runs to create a src/app/scripts/config.js file that is copied into the build.

### Android Build

Building for android can be done from the command line as long as you have the android-sdk installed (download it here: http://developer.android.com/).
Replace the '\lang\Android\android-sdk\' directory below with the location of your android-sdk.

Keystore Key: &C0n0j0!

```
cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore conojo.keystore platforms\android\build\outputs\apk\android-armv7-release-unsigned.apk conojo
\lang\Android\android-sdk\build-tools\22.0.1\zipalign.exe -v 4 platforms\android\build\outputs\apk\android-armv7-release-unsigned.apk conojo.apk

```


### IOS Build
ios builds must be performed on a mac machine.  In order to build the project, you will need to have the appropriate certificates and provisioning
profiles installed on your machine.  Doing this is complicated and probably outside the scope of this ReadMe.md.  To build the project, do the following:

* Open xcode on your mac and open the project stored in platforms/ios/Conojo.xcodeproj
* Choose the Build -> Archive option to create a new archive
* Upload the build to ios using the application loader