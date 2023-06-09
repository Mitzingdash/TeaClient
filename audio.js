const {Howl, Howler} = require('howler');

var sound = new Howl({
    src: ['sound.mp3'],
    html5: true,
    loop: true,
    
  });
  
  sound.play();