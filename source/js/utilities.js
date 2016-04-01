"use strict";
/** Utilities
 * A collection of miscellaneous functions and definitions. This includes
 * things like ExhaustiveArray, feature detection, and custom easing functions.
 * 
 */

this.galaxies = this.galaxies || {};

galaxies.utils = this.galaxies.utils || {};

galaxies.utils.PI_2 = Math.PI * 2;

galaxies.utils.shotGroups = [];

galaxies.utils.addShotGroup = function(shots) {
    if (!(shots instanceof Array)) {
        shots = [shots];
    }

    galaxies.utils.shotGroups.push(shots);
};

galaxies.utils.getConnectedShotGroup = function(shot) {
    var shotGroups = galaxies.utils.shotGroups,
        numShotGroups = shotGroups.length;

    for (var i = 0; i < numShotGroups; ++i) {
        if (shotGroups[i].some(function (item) {return item === shot;})) {
            return i;
        }
    }

    return -1;
};

galaxies.utils.inShotGroup = function(shot) {
    return galaxies.utils.getConnectedShotGroup(shot) > -1;
};

galaxies.utils.removeConnectedShotGroup = function(shot) {
    var shotGroup = galaxies.utils.getConnectedShotGroup(shot);

    if (shotGroup > -1) {
        galaxies.utils.shotGroups.splice(shotGroup, 1);
    }
};

// A linear tapered sinusoidal easing function.
// Used for shaking camera.
galaxies.utils.getShakeEase = function ( frequency ) {
  return function( t ) {
    var val = Math.cos( t * frequency ) * (1-t);
    //console.log(t, val);
    return val;
  };
};

// Identify desktop platforms to recommend correct browser with EC-3.
galaxies.utils.isOSX = function() {
  var agt = navigator.userAgent;
  return ( /Mac OS X/.test(agt) && !/iphone/i.test(agt) && !/ipad/i.test(agt) && !/ipod/i.test(agt) );
}
galaxies.utils.isWindows = function() {
  var agt = navigator.userAgent;
  return ( /Windows/.test(agt) && !/phone/i.test(agt) );
}

galaxies.utils.isMobile = function() {
  var agt = navigator.userAgent;
  return /iPhone|iPad|iPod|Android|windows phone|iemobile|\bsilk\b/i.test(agt);
}

// Identify which audio format to use.
galaxies.utils.testAudioSupport = function( callback ) {
  // Has test been run?
  if ( typeof( galaxies.utils.supportsOGG ) !== 'undefined' ) {
    callback();
    return;
  }
  
  // Test OGG
  var oggTester = document.createElement("audio"); // Construct new Audio object
  var codecString = 'audio/ogg;codecs="vorbis"';
  galaxies.utils.supportsOGG = (oggTester.canPlayType(codecString)==='probably'); // cast to boolean
  console.log( "Supports OGG?", galaxies.utils.supportsOGG );
  //
  
  // Test EC-3
  // Note: Feature detection with MediaSource returns incorrect result in Safari 8. 
  // This code was created by Dolby.
  // https://github.com/DolbyDev/Browser_Feature_Detection
  var video = document.createElement('video');

  if (video.canPlayType('audio/mp4;codecs="ec-3"') === '' || video.canPlayType('audio/mp4;codecs="ac-3"') === '') {
      galaxies.utils.supportsEC3 = false;
      callback();
  } else {
      var audio = new Audio();
      audio.muted = true;
      audio.addEventListener('error', function () {
          galaxies.utils.supportsEC3 = false;
          callback();
      }, false);
      audio.addEventListener('seeked', function () {
          galaxies.utils.supportsEC3 = true;
          callback();
      }, false);

      audio.addEventListener('canplaythrough', function () {
          try {
              audio.currentTime = 2;
          } catch (e) {
            callback();
          }
      }, false);
      audio.src = 'audio/silence.mp4';
      audio.play();
  }  
}

// Will it run?
// Exclude browsers that do not support WebGL and WebAudio.
galaxies.utils.isSupportedBrowser = function() {
  // Test for WebGL support
  var canvas;
  var ctx;
  var exts;
  
  try {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  }
  catch (e) {
    return false;
  }
  if (ctx === undefined) { return false; }
  canvas = undefined;
  //
  
  // Test for WebAudio support
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  if ( AudioContext == null ) { return false; }
  //
  
  return true;
}


/// Takes an array and returns its contents in a randomized order.
galaxies.ExhaustiveArray = function() {
  var objects = [];
  var index = 0;
  
  this.add = function( item ) {
    objects.push(item);
  }
  
  this.init = function() {
    index = 0;
    galaxies.utils.shuffleArray(objects);
  }
  
  this.next = function() {
    var nextObject = objects[index];
    
    if ( objects.length > 1 ) {
      index++;
      if ( index >= objects.length ) {
        index = 0;
        galaxies.utils.shuffleArray(objects);
      }
    }
    
    return nextObject;
  }
  
  galaxies.utils.shuffleArray(objects);
  
}

// Fisher-Yates shuffle
galaxies.utils.shuffleArray = function( array ) {
  for (var i=0, len = array.length; i<len; i++ ) {
    var randomIndex = Math.floor( Math.random() * (i+1) );
    var temp = array[randomIndex];
    array[randomIndex] = array[i];
    array[i] = temp;
  }  
}


// modulo without keeping dividend sign.
galaxies.utils.mod = function( a, n ) {
  return (a - Math.floor( a/n ) * n);
}

galaxies.utils.flatLength = function( vector ) {
  return Math.sqrt( Math.pow(vector.x, 2) + Math.pow(vector.y,2) );
}
galaxies.utils.flatLengthSqr = function(vector ) {
  return (Math.pow(vector.x, 2) + Math.pow(vector.y,2));
}

galaxies.utils.rootPosition = function( object ) {
  var foo = object.position.clone();
  if ((object.parent == null) || (galaxies.engine.rootObject==null) ) {
    return foo;
  } else {
    return galaxies.engine.rootObject.worldToLocal( object.parent.localToWorld( foo ) );
  }

}

/// Set z-position for objects to map x-y plane to a cone.
galaxies.utils.conify = function( object ) {
  object.position.setZ( galaxies.utils.getConifiedDepth( object.position ) );
}
galaxies.utils.getConifiedDepth = function( position ) {
  // linear
  return ( (galaxies.utils.flatLength(position)/galaxies.engine.CONE_SLOPE) );
  // parabolic
}

galaxies.utils.calculateRoundScore = function (roundScore, accuracy, numStars) {
    return Math.round(roundScore * (1 + accuracy) * Math.pow(2, numStars));
};






// Patch SPE to allow negative speeds to make sphere particles move inwards.
// This is used by the UFO laser charge effect.
// May not be needed in latest version of SPE, but needs to be checked before it can be removed.
SPE.Emitter.prototype.randomizeExistingVelocityVector3OnSphere = function( v, base, position, speed, speedSpread ) {
        v.copy( position )
            .sub( base )
            .normalize()
            .multiplyScalar( this.randomFloat( speed, speedSpread ) );
            //.multiplyScalar( Math.abs( this.randomFloat( speed, speedSpread ) ) );
};



