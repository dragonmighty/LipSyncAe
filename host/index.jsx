//@include "./json2.jsxinc"

// hankaku - zenkaku
function replaceHalfToFull(str){
  return str.replace(/[!-~]/g, function(s){
    return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
}

function addControls(targetLayerName, mainComp, controlLayer)
{
    // alert('test');
    var newLayers = new Array();
    var selectedLayers = new Array();
    var tempLength, i, j;

    //tempLength = activeComp.selectedLayers.length;



    // Add dropdown Menu
    var eyeControlEffect = controlLayer.Effects.addProperty("ADBE Dropdown Control");


    // retrieve all items of Eye object
    var itemNames = new Array();
    //alert("start. number of items in the project is " + app.project.numItems);
    for(i = 1; i <= app.project.numItems; i++ )
    {
      //alert(app.project.items[i].name);
      if (app.project.items[i].name == targetLayerName)// && app.project.items[i] instanceof CompItem)
      {
        var eyeComp = app.project.items[i];
        var cnt = 0;

        //alert("found comp. number of layers in Layer " + app.project.items[i].name + " is " + eyeComp.numLayers);
        for (j = 1; j <= eyeComp.numLayers; j++)
        {
          // if (cnt < 5)
          // {
          //   cnt++;
          //   alert("tested");
          // }
          if (!eyeComp.layer(j).nullLayer)
          {
            itemNames.push(replaceHalfToFull(eyeComp.layer(j).name));
            eyeComp.layer(j)("Opacity").expression = "thisComp.layer(\"layer selection\").text.sourceText == thisLayer.index - 1 ? 100 : 0;"
          }
        }
        var temp = eyeControlEffect.property(1).setPropertyParameters(itemNames);
        temp.propertyGroup(1).name = targetLayerName;

        // add Selection Layer to Eye layer
        if (eyeComp.layer(1).name == "layer selection")
        {
          eyeComp.layer(1).remove();
        }
        var textLayer = eyeComp.layers.addText();
        textLayer.name = "layer selection";
        textLayer.guideLayer = true;
        textLayer("Text")("Source Text").expression = "comp(\"SDさとうささら_立ち絵\").layer(\"control\").effect(\"" + targetLayerName + "\")(\"Menu\").value;"
      }
    }
}


function addControlLayer(){
  var mainComp= app.project.activeItem;
  var layerNames = ["目", "眉", "記号・効果", "髪型", "口"];
  var i;

  if (mainComp&&(mainComp instanceof CompItem))
  {
    // add null layer for control
    var controlLayer = mainComp.layers.addNull();
    controlLayer.name = "control";
    if (mainComp.numLayers > 1 && controlLayer.index != 1)
    {
      controlLayer.moveBefore(mainComp.layers[1]);
    }

    // add control of eye layer
    for (i = 0; i < layerNames.length; i++)
    {
      addControls(layerNames[i], mainComp, controlLayer);
    }
  } else {
    alert('No active composition');
  }
}

function getAppName()
{
  return BridgeTalk.appName;
}

function retrieveTracklist()
{
  var sequence = app.project.activeSequence;
  if (!sequence)
  {
    return "";
  }

  var response = {
    "audioTracks" : [],
    "videoTracks" : []
  };

  for (var i = 0; i < sequence.videoTracks.numTracks; ++i)
  {
    var track = {
      "name" : sequence.videoTracks[i].name,
      "trackIndex" : i
    };
    response.videoTracks.push(track);
  }

  for (var i = 0; i < sequence.audioTracks.numTracks; ++i)
  {
    var track = {
      "name" : sequence.audioTracks[i].name,
      "trackIndex" : i
    };
    response.audioTracks.push(track);
  }

  return JSON.stringify(response);
}

function retrieveTiming(audioTrackIndex){
  var sequence = app.project.activeSequence;
  if (!sequence)
    return "no active sequence selected.";

  //alert('check numTracks');
  if (sequence.audioTracks.numTracks >= audioTrackIndex + 1)
  {
    //alert('checking tracks');
    var audioTrack = sequence.audioTracks[audioTrackIndex];
    var  response = {
      "targetClipStartsAt" : 0.0,
      "targetClipEndsAt" : 0.0,
      "audioClips" : []
    };

    //retrieve selected video clips
    var selectedVideosCount = 0;
    var bError = false;
    for (var i = 0; i < sequence.videoTracks.numTracks && !bError; ++i)
    {
      var videoTrack = sequence.videoTracks[i];
      for (var j = 0; j < videoTrack.clips.numItems && !bError; ++j)
      {
        if (videoTrack.clips[j].isSelected())
        {
          response.targetClipStartsAt = videoTrack.clips[j].start.seconds;
          response.targetClipEndsAt = videoTrack.clips[j].end.seconds;
          if (++selectedVideosCount > 1)
          {
            bError = true;
          }
        }
      }
    }
    
    if (selectedVideosCount == 0)
    {
      alert("No video clip selected. Please select a video clip where you want to link.");
      return("");
    }
    else if (selectedVideosCount > 1)
    {
      alert("More than one clip selected. Please select only one video clips");
      return("");
    }
    
    //alert('before for loop');
    for (var index = 0; index < audioTrack.clips.numItems; ++index)
    {
      //alert('before retrieveing trackitem');
      var trackItem = audioTrack.clips[index];
      if (trackItem.start.seconds > response.targetClipEndsAt ||
        trackItem.end.seconds < response.targetClipStartsAt)
        {
          continue;
        }
      // alert('before adding item');

      var audioClip = {
        "name" : trackItem.name,
        "startSeconds" : trackItem.start.seconds,
        "endSeconds" : trackItem.end.seconds,
        "inPontSeconds" : trackItem.inPoint.seconds,
        "endPontSeconds" : trackItem.outPoint.seconds,
        "duration": trackItem.duration.seconds
      };
      // alert('before push data');
      response.audioClips.push(audioClip);
      // alert('pushed data');

      //response.push(trackItem.name);
      //response.push(trackItem.start.seconds);
    }
    //alert('before return');
    
    return JSON.stringify(response);

    //return response; 
  }
}

function retrieveShapeInfo()
{
  var response = {
    "shapes": []
  };
  //return "hogehogeaaaa";
  
  var mainComp = app.project.activeItem;
  if (mainComp&&(mainComp instanceof CompItem))
  {
    var shapeLayer = mainComp.layers[1];
    //var shapeGroup = shapeLayer.property("Contents").property("Shape 1")property("ADBE Root Vectors Group");
    var prpty = shapeLayer.property("Contents").property("Shape 1");//property("ADBE Vector Shape");//property("ADBE Root Vectors Group");
    //var prpty = shapeGroup.property(2).property(1);
    //Contents = ADBE Root Vectors Group;
    // Shape 1 = ADBE Vector Group;
    // prpty.property(2).property(1).property(1).name; = Shape Direction
    // prpty.property(2).property(1).property(2).name; = Path

    //return prpty.matchName;
    //return prpty.property(2).property(1).property(2).numKeys;//name; <- 15
    data = prpty.property(2).property(1).property(2);//.numKeys;//name; <- 15

    for (var index = 1; index <= data.numKeys; ++index)
    {
      var shapeData = {
        "value" : data.keyValue(index),
        "time" : data.keyTime(index)
      };
      response.shapes.push(shapeData);

      // var value = property.keyValue(index);
      // var time = property.keyTime(index);
    }

    // var shapeGroup = shapeLayer.property("ADBE Root Vectors Group");
    // shapeGroup.addProperty("ADBE Vector Shape - Group"); // add a path
    // shapeGroup.addProperty("ADBE Vector Graphic - Stroke"); // add a stroke
    // shapeGroup.addProperty("ADBE Vector Graphic - Fill"); // add a stroke
    // shapeGroup.property(1).property("ADBE Vector Shape").setValueAtTime(0.20, shape);

    return JSON.stringify(response);
  }
  return "else";

}


function generateKeyframefromTemplate(json){
  var obj = JSON.parse(json);
  // if (obj.lipdata === undefined)
  //   return "";
  //alert(JSON.stringify(obj.option));

  // obj.lipdata[1].startSeconds;
  // return obj.lipdata[1].startSeconds;
  var mainComp= app.project.activeItem;
  if (mainComp&&(mainComp instanceof CompItem))
  {
  

    // retrieve lip templates
    var lip_layers = [];
    var lipFillColor = [0, 0, 0]/255;//[231, 165, 155]/255;
    var lipStrokeColor = [0, 0, 0]/255;
    var lipStrokeWidth = 0;
    var previousVowel = "";
    var currentVowel = "";
    var nextVowel = "";

    var phones = ["a", "i", "u", "e", "o", "N", "sil"];
    for (var i = 1; i <= mainComp.numLayers; ++i) {
      for (var j = 0; j < phones.length; ++j) {


        if (mainComp.layers[i].name === phones[j])
        {

          // no group
          // ADBE Root Vectors Group                  <- Contents
          //  + ADBE Vector Shape - Group             <- Path
          //  + (ADBE Vector Graphic - G-Stroke)      <- Gradient Stroke
          //  + (ADBE Vector Graphic - Fill)          <- Fill
          //  + (ADBE Vector Graphic - Stroke)        <- Stroke

          // If there's a group inside
          // ADBE Root Vectors Group                     <- Contents
          //  + ADBE Vector Group                        <- Group
          //     + ADBE Vector Blend Mode                <- Blend Mode
          //     + ADBE Vectors Group                    <- Contents
          //     |  + ADBE Vector Shape - Group          <- Path
          //     |  + (ADBE Vector Graphic - G-Stroke)   <- Gradient Stroke
          //     |  + (ADBE Vector Graphic - Stroke)     <- Stroke
          //     |  + ADBE Vector Graphic - Fill         <- Fill
          //     + ADBE Vector Transform Group           <- Transform
          //     + ADBE Vector Materials Group           <- Material Options

          var grp = mainComp.layers[i].property("ADBE Root Vectors Group");
          //var prop = grp;//.property("ADBE Vector Group").property("ADBE Vectors Group");
          
          //alert(prop.numProperties);
          //for (var tmp = 1; tmp <= prop.numProperties; ++tmp)
          //{
          //  alert(prop.property(tmp).matchName + ', ');
          //}
          //alert(prop.property(1).matchName + ", " + prop.property(2).matchName + ", " + prop.property(3).matchName);// + ", " + prop.property(4).matchName)
          //var vecGroup = grp.property("ADBE Vector Group");
          ///alert(grp.numProperties);
          var data = {
            "lipShapeName" : mainComp.layers[i].name,
            "shape" : grp.property("ADBE Vector Shape - Group").property("ADBE Vector Shape").value
          };
          //alert("aaaaa");
          lip_layers.push(data);

          if (lip_layers.length === 1)
          {
            var stroke = grp.property("ADBE Vector Graphic - Stroke");
            lipStrokeColor = stroke.property("ADBE Vector Stroke Color").value;
            lipStrokeWidth = stroke.property("ADBE Vector Stroke Width").value;

            var fill = grp.property("ADBE Vector Graphic - Fill");
            //alert(JSON.stringify(fill.property("ADBE Vector Fill Color").value));
            lipFillColor = fill.property("ADBE Vector Fill Color").value;
          }
        }

      }
    }
    //alert("lip_layers.length: " + lip_layers.length);
    //alert(JSON.stringify(lip_layers));
    
    
    // put key frame based on the json data
    var shapeLayer = mainComp.layers.addShape();
    // put it front
    if (mainComp.numLayers > 1 && shapeLayer.index != 1)
    {
      shapeLayer.moveBefore(mainComp.layers[1]);
    }
    
    shapeLayer.name = "口パク";
    var shapeGroup = shapeLayer.property("ADBE Root Vectors Group");
    var shapePath = shapeGroup.addProperty("ADBE Vector Shape - Group"); // add a path
    var shapeStroke = shapeGroup.addProperty("ADBE Vector Graphic - Stroke"); // add a stroke
    var strokeIndex = shapeStroke.propertyIndex;
    var shapeFill = shapeGroup.addProperty("ADBE Vector Graphic - Fill"); // add a stroke\
    shapeFill.property("ADBE Vector Fill Color").setValue(lipFillColor);
    shapeGroup.property(strokeIndex).property("ADBE Vector Stroke Color").setValue(lipStrokeColor);
    shapeGroup.property(strokeIndex).property("ADBE Vector Stroke Width").setValue(lipStrokeWidth);
    
    var firstTime = true;

    //alert("added");
    for (var index = 0; index < obj.phoneLabels.length; ++index)
    {
      //alert("index: " + index + ", lipShape: " + obj.phoneLabels[index].lipShape);
      // Find the next vowel (phone may contain consonant sounds)
      if (isVowel(obj.phoneLabels[index].lipShape) || isSilent(obj.phoneLabels[index].lipShape))
      {
        currentVowel = obj.phoneLabels[index].lipShape;
      }
      var consonantCounter = 0;
      for (var k = index; k < obj.phoneLabels.length - 1; ++k)
      {
        if (isVowel(obj.phoneLabels[k + 1].lipShape) || isSilent(obj.phoneLabels[k + 1].lipShape))
        {
          nextVowel = obj.phoneLabels[k + 1].lipShape;
          break;
        }
        else
        {
          ++consonantCounter;
          if (consonantCounter > 3)
          {
            nextVowel = "";
            break;
          }
        }
      }
      
      var originalShape = getShape(lip_layers, obj.phoneLabels[index].lipShape);
      if (originalShape !== null)
      {
        //shapeGroup.property("ADBE Vector Shape - Group").property("ADBE Vector Shape").setValueAtTime(obj.phoneLabels[index].startSeconds, originalShape);
        
        // Found the correct shape
        var transientShape = null;
        if (transientShapeRequired(previousVowel, currentVowel, nextVowel))
        {
          var previousShape = getShape(lip_layers, previousVowel);
          transientShape = new Shape();
          // transientShape.vertices = new Array();
          // transientShape.inTangents = new Array();
          // transientShape.outTangents = new Array();
          if (previousShape !== null)
          {
            // if (firstTime)
            // {
            //   var testArray = new Array();
            //   testArray = [(originalShape.vertices[0][0] + previousShape.vertices[0][0]) / 2.0, (originalShape.vertices[0][1] + previousShape.vertices[0][1]) / 2.0];
            //   alert("originalShape.vertices: " + JSON.stringify(testArray));
            //   //alert(JSON.stringify(transientShape));
            //   firstTime = false;
            // }
            // Verticies
            var tempVertices = new Array();
            for (var i = 0; i < originalShape.vertices.length && i < previousShape.vertices.length; ++i)
            {
              var tempVertex = [(originalShape.vertices[i][0] + previousShape.vertices[i][0]) / 2.0,
              (originalShape.vertices[i][1] + previousShape.vertices[i][1]) / 2.0];
              tempVertices.push(tempVertex);
            }
            // need to set vertices/inTangents/outTangents at once.
            // pushing a element to these array does not work.
            transientShape.vertices = tempVertices;
            // InTangents
            var tempInTangents = new Array();
            for (var i = 0; i < originalShape.inTangents.length && i < previousShape.inTangents.length; ++i)
            {
              var tempInTangent = [(originalShape.inTangents[i][0] + previousShape.inTangents[i][0]) / 2.0,
              (originalShape.inTangents[i][1] + previousShape.inTangents[i][1]) / 2.0];
              tempInTangents.push(tempInTangent);
            }
            transientShape.inTangents = tempInTangents;
            // OutTangents
            var tempOutTrangents = new Array();
            for (var i = 0; i < originalShape.outTangents.length && i < previousShape.outTangents.length; ++i)
            {
              var tempOutTrangent = [(originalShape.outTangents[i][0] + previousShape.outTangents[i][0]) / 2.0,
              (originalShape.outTangents[i][1] + previousShape.outTangents[i][1]) / 2.0];
              tempOutTrangents.push(tempOutTrangent);
              // if (firstTime)
              // {
              //   // var testArray = new Array();
              //   // testArray = [(originalShape.vertices[0][0] + previousShape.vertices[0][0]) / 2.0, (originalShape.vertices[0][1] + previousShape.vertices[0][1]) / 2.0];
              //   // alert("originalShape.vertices: " + JSON.stringify(testArray));
              //   alert(JSON.stringify(tempOutTrangent));
              //   firstTime = false;
              // }
            }
            transientShape.outTangents = tempOutTrangents;
            transientShape.closed = originalShape.closed;
            shapeGroup.property("ADBE Vector Shape - Group").property("ADBE Vector Shape").setValueAtTime(obj.phoneLabels[index].startSeconds, transientShape);
          }
          else
          {
            shapeGroup.property("ADBE Vector Shape - Group").property("ADBE Vector Shape").setValueAtTime(obj.phoneLabels[index].startSeconds, originalShape);
          }
        }
        else
        {
          shapeGroup.property("ADBE Vector Shape - Group").property("ADBE Vector Shape").setValueAtTime(obj.phoneLabels[index].startSeconds, originalShape);
        }
      }
      else
      {
        // do nothing. (Consonants phone comes here.)
      }

      if (isVowel(obj.phoneLabels[index].lipShape) || isSilent(obj.phoneLabels[index].lipShape))
      {
        previousVowel = obj.phoneLabels[index].lipShape;
      }
    }

    // options
    // Posterization Time
    if (obj.option.posterizationTime.enabled)
    {
      var posterize = shapeLayer.Effects.addProperty("ADBE Posterize Time");
      posterize.property("ADBE Posterize Time-0001").setValue(obj.option.posterizationTime.frameRate);
      //alert(posterize.property("ADBE Posterize Time-0001").value);
    }

  }
  else
  {
    alert("no comp");
  }
  return "done";
}

function getShape(lip_layers, lipShapeName)
{
  for (var i = 0; i < lip_layers.length; ++i)
  {
    //alert("index: "+ index +", "+"i: "+i + ", lip_layers[i].lipShapeName:" + lip_layers[i].lipShapeName);
    if (lip_layers[i].lipShapeName === lipShapeName)
    {
      return lip_layers[i].shape;
    }
  }
  return null;
}

function isVowel(lipShape)
{
  return lipShape === "a" || lipShape === "i" || lipShape === "u" ||
          lipShape === "e" || lipShape === "o";
}
function isSilent(lipShape)
{
  return lipShape === "sil" || lipShape === "pau";
}

function transientShapeRequired(previousVowel, currentVowel, nextVowel)
{
  var currentLipShapeGroup = "";
  var previousLipShapeGroup = "";
  var nextLipShapeGroup = "";

  previousLipShapeGroup = getLipShapeGroup(previousVowel);
  currentLipShapeGroup = getLipShapeGroup(currentVowel);
  nextLipShapeGroup = getLipShapeGroup(nextVowel);

  if (nextLipShapeGroup === "close")
  {
    return false;
  }
  else if ((previousLipShapeGroup === "wide" && currentLipShapeGroup === "narrow") ||
           (previousLipShapeGroup === "narrow" && currentLipShapeGroup === "wide"))
  {
    return true;
  }
  return false;
}


function getLipShapeGroup(lipShape)
{
  switch (lipShape)
  {
    case "a":
    case "i":
    case "e":
       return "wide";
      break;
    case "u":
    case "o":
      return "narrow";
      break;
    case "sil":
    case "pau":
      return "close";
      break;
    default:
      return "UNKNOWN";
  }
}

function generateKeyframeFromPathData(json){
  var obj = JSON.parse(json);
  // if (obj.lipdata === undefined)
  //   return "";

  // obj.lipdata[1].startSeconds;
  // return obj.lipdata[1].startSeconds;
  var mainComp= app.project.activeItem;
  if (mainComp&&(mainComp instanceof CompItem))
  {
    var shapeLayer = mainComp.layers.addShape();
    shapeLayer.name = "mouth";
    // put it front
    // if (mainComp.numLayers > 1 && controlLayer.index != 1)
    // {
      //   shapeLayer.moveBefore(mainComp.layers[1]);
      // }
      
      
      
      // var shape = new Shape();
      // shape.vertices = [[0,0], [0,100], [100,100], [100,0]];
    // shape.closed = true;
    
    var shapeGroup = shapeLayer.property("ADBE Root Vectors Group");
    var shapePath = shapeGroup.addProperty("ADBE Vector Shape - Group"); // add a path
    var shapeStroke = shapeGroup.addProperty("ADBE Vector Graphic - Stroke"); // add a stroke
    var strokeIndex = shapeStroke.propertyIndex;
    var shapeFill = shapeGroup.addProperty("ADBE Vector Graphic - Fill"); // add a stroke
    
    var lipColor = [231, 165, 155]/255;
    var strokeColor = [0, 0, 0]/255;
    shapeFill.property("ADBE Vector Fill Color").setValue(lipColor);
    shapeGroup.property(strokeIndex).property("ADBE Vector Stroke Color").setValue(strokeColor);
    shapeGroup.property(strokeIndex).property("ADBE Vector Stroke Width").setValue(2);
    //shapeStroke.property("ADBE Vector Stroke Width").setValue(2);
//    shapeLayer.property('Contents').property(3).property('Color').setValue.setValue(lipColor);
    //shapeLayer.content("Group 1").content("Stroke 1").color.setValue(strokeColor);

    for (var index = 0; index < obj.shapes.length; ++index)
    {
      var shape = new Shape();
      shape.vertices = obj.shapes[index].value.vertices;
      shape.inTangents = obj.shapes[index].value.inTangents;
      shape.outTangents = obj.shapes[index].value.outTangents;
      shape.closed = obj.shapes[index].value.closed;
      shapeGroup.property(1).property("ADBE Vector Shape").setValueAtTime(obj.shapes[index].time, shape);
    }
    
    //property.setValueAtTime(0.20, shape);

    return "finished";//JSON.stringify(shape.vertices);
  }

  return "done";

  // for (var index = 0; index < 3; ++index)// obj.lipdata.length; ++index)
  //   return obj.lipdata[index].
  // return json;
}



// TODO: support "nothing to show", optional (layer that does not have *) , mandatory(!), flip


