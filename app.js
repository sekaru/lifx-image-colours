const _ = require('lodash');
const LifxClient = require('node-lifx').Client;
const client = new LifxClient();
var light;

client.on('light-new', function(device) {
  light = device;
});

client.init();

const convert = require('color-convert');
const vibrant = require('node-vibrant');

const url = 'https://i.scdn.co/image/05e1865f47076b6efcfa32407e82b83bb7a93fd8';
var curColour = 0;
var colours = [];

vibrant.from(url).getPalette((err, palette) => {
  if(err) {
    console.log(err);
    return;
  }

  const keys = _.keysIn(palette);

  for(var i=0; i<keys.length; i++) {
    if(palette[keys[i]]!==null) {
      var col = palette[keys[i]].getRgb();
      col = convert.rgb.hsv(col);

      colours.push(col);   
      console.log(col);        
    } 
  }

  setInterval(() => {
    if(!light) {
      console.log("No light");
      process.exit();
    }

    curColour++;
    const col = colours[curColour%colours.length];
    light.color(col[0], col[1], col[2], 9000, 1000);
  }, 2000); 
});