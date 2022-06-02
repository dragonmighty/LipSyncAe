/* 1) Create an instance of CSInterface. */
var csInterface = new CSInterface();

/* 2) Make a reference to your HTML button and add a click handler. */
// var openButton = document.querySelector("#open-button");
// openButton.addEventListener("click", openDoc);

// var addCtlButton = document.querySelector("#addctl-button");
// addCtlButton.addEventListener("click", addCtlLayer);

var reloadButton = document.querySelector("#reload-button");
reloadButton.addEventListener("click", reloadPage);

var retrieveTimingButton = document.querySelector("#retrieve-button");
retrieveTimingButton.addEventListener("click", retrieveTiming);

var generateKeyframeButton = document.querySelector("#generateKeyframe-button");
generateKeyframeButton.addEventListener("click", generateKeyframe);

var retrieveShapeInfoButton = document.querySelector("#retrieveShapeInfo-button");
retrieveShapeInfoButton.addEventListener("click", retrieveShapeInfo);

var refreshLayerListButton = document.querySelector("#refreshLayerList-button");
refreshLayerListButton.addEventListener("click", refresh_LayerList);





function updateUI(result){
  //alert(result);
  document.getElementById('result-textarea').value = result;
}

function updateUI_generateResult(result){
  //alert(result);
  //document.getElementById('result-textarea').value = result;
}

function updateUI_retrieveShapeInfo(result){
  alert(result);
  document.getElementById('result-textarea').value = result;
}



function updateUI_refreshLayerList(result){
  if (result !== "")
  {
    //alert(result);
    
    var data = JSON.parse(result);
    //alert(data.audioTracks[0].name);
    var selectList = document.getElementById('audio-layer');
    
    // clear all of the elements in the list
    while (selectList.length > 0)
    {
      selectList.remove(0);
    }

    for (var i = 0; i < data.audioTracks.length; ++i)
    {
      var option = document.createElement('option');
      option.value = data.audioTracks[i].trackIndex;
      option.text = data.audioTracks[i].name;
      selectList.appendChild(option);
    }
  }
}


function refresh_LayerList() {
  csInterface.evalScript("retrieveTracklist()", updateUI_refreshLayerList);
}






/* 3) Write a helper function to pass instructions to the ExtendScript side. */
function retrieveTiming() {
  var selectList = document.getElementById('audio-layer');
  var index = selectList.options[selectList.selectedIndex].value;
  const script = "retrieveTiming(" + index + ")";
  csInterface.evalScript(script, updateUI);
}


function generateKeyframe() {
  // As the script for evalScript does not allow line break,
  // doing JSON.parse and JSON.stringify is required for minifying is required.
  var obj = JSON.parse(document.getElementById('timing-textarea').value);

  var option = {
    "posterizationTime" : {
      "enabled": document.getElementById('posterizationTime-checkBox').checked,
      "frameRate": parseInt(document.getElementById('posterizationTime-text').value),
    }
  };

  
  var timingData = {
    "phoneLabels" : obj.phoneLabels,
    "option": option
  };
  
  //alert(JSON.stringify(timingData));
  // retrieve option
  // var option = {
  //   "posterizationTime" : {
  //     "enabled": document.getElementById('posterizationTime-checkBox').checked,
  //     "frameRate": parseInt(document.getElementById('posterizationTime-text').value),
  //   }
  // };

  // timingData.option = option;
  // alert(JSON.stringify(timingData.option));
  //var timingData = "hoge";

  // need single quote ' is required to enclose json string
  const script = "generateKeyframefromTemplate('" + JSON.stringify(timingData) + "')";
  csInterface.evalScript(script, updateUI_generateResult);
}

function retrieveShapeInfo() {
  // alert("script yobu yo");
  csInterface.evalScript("retrieveShapeInfo()", updateUI_retrieveShapeInfo);
}

// function addCtlLayer() {
//   csInterface.evalScript("addControlLayer()");
// }




function updateUI_forApp(appName) {
  //alert(appName);
  if (appName === "premierepro")
  {
    var ui = document.getElementById('aftereffects-fieldset');
    ui.style.display = "none";
    refresh_LayerList();
  } else if (appName === "aftereffects")
  {
    var ui = document.getElementById('premierepro-fieldset');
    ui.style.display = "none";    
  }
}

function initEnvironment() {
  csInterface.evalScript("getAppName()", updateUI_forApp);
}

function reloadPage() {
  location.reload();
}

function onLoad() {
  initEnvironment();
}