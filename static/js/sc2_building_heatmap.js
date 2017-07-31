// Don't know what this does
window.requestAnimationFrame = window.requestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||
                               window.msRequestAnimationFrame;


var transpose = function(x, y) {
  var abyssal_dimensions = "152x136";
  result = {
    "x":  (166 - x) * 7.8,
    "y": y * 7.8,
  };
  return result;

}

$("select#map_pick").change(function(){
  console.log("made it");
  var map = $( "select#map_pick" ).val();
  console.log(map);

});



$.getJSON( "stargates_data.json", function (data ) {
  console.log("Pulled some data!");
  data.forEach( function(item, index) {
    if (item.buildings.stargates.length > 0 && item.map == "Abyssal Reef LE") {
      coordinates = coordinate_change(item.buildings.stargates[0].location[0], item.buildings.stargates[0].location[1])
      console.log("Found a stargate at: "
                   + coordinates['x']
                   + ", "
                   + coordinates['y']
                   )
      if (coordinates['y'] < 0) {
        console.log(item);
      }
      if (coordinates['x'] < 0) {
        console.log(item);
      }
      heat.add([coordinates["x"],
                coordinates["y"],
                12]);
      frame = frame || window.requestAnimationFrame(draw);
    }
  });

});

// simpleheat boilerplate
function get(id) {
    return document.getElementById(id);
}


// create the heatmap (starting with null data)
var null_data = [];
var heat = simpleheat('canvas').data(null_data).max(18),
    frame;
heat.radius(15, 10);


function draw() {
    //console.time('draw');
    heat.draw();
    //console.timeEnd('draw');
    frame = null;
}

var coordinate_change = function (x, y) {
  var abyssal_dimensions = "152x136";
  var pic_dimensions = "1200x1073";
  var scale = 7.91;
  result = {
    "x": (x - 24) * scale,
    "y": (139 - y) * scale,
  };
  return result;

};

// neeb's stargate
// 28, 119
// upper left base, stargate direct left of bottom extractor in main
//
// cloudy's stargate
// 40,112 
// upper left base, stargate below the main nexus by 1.5 nexus lengths, stright down and slightly right. Halfway between clif and nexus. 2/3 of the stargate is directly beneath nexus
//


// neeb stargates for abyssal
// 164, 13
// 150, 22
//
// one is bottom right base, left of, parallel to bottom extractor. In the mineral line. horizontally between the nexus and gyser.
// the other is right at the ramp, in by two gateways and parallel with the top of the nexus
neeb_result = coordinate_change(28, 119);
//console.log("neeb" + neeb_result);
//heat.add([neeb_result['x'],neeb_result['y'], 18]);

cloudy_result = coordinate_change(40, 112);
//console.log("cloudy" + cloudy_result);
//heat.add([cloudy_result['x'],cloudy_result['y'], 18]);

neeb_ab_1_result = coordinate_change(164, 13);
//console.log("neeb_ab_1" + neeb_ab_1_result);
//heat.add([neeb_ab_1_result['x'],neeb_ab_1_result['y'], 18]);

neeb_ab_2_result = coordinate_change(150, 22);
//console.log("neeb_ab_2" + neeb_ab_2_result);
//heat.add([neeb_ab_2_result['x'],neeb_ab_2_result['y'], 18]);


frame = frame || window.requestAnimationFrame(draw);


// Draw heatmap
draw();

// simpleheat stuff, needs to be after draw() (??)
var radius = get('radius'),
    blur = get('blur'),
    changeType = 'oninput' in radius ? 'oninput' : 'onchange';

radius[changeType] = blur[changeType] = function (e) {
    heat.radius(+radius.value, +blur.value);
    frame = frame || window.requestAnimationFrame(draw);
};

