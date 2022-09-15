/* 1) Create an instance of CSInterface. */
var csInterface = new CSInterface();

/* 2) Make a reference to your HTML button and add a click handler. */
// var openButton = document.querySelector("#open-button");
// openButton.addEventListener("click", openDoc);

// var addCtlButton = document.querySelector("#addctl-button");
// addCtlButton.addEventListener("click", addCtlLayer);

// =======================================
// EventListener functions
// =======================================
// EventListener for Main
var reloadButton = document.querySelector("#reload-button");
reloadButton.addEventListener("click", reloadPage);

// EventListner for Premiere Pro
var refreshLayerListButton = document.querySelector("#refreshLayerList-button");
refreshLayerListButton.addEventListener("click", refresh_LayerList);

var retrieveTimingButton = document.querySelector("#retrieve-button");
retrieveTimingButton.addEventListener("click", retrieveTiming);

// EventListenr for AfterEffects
var generateKeyframeButton = document.querySelector("#generateKeyframe-button");
generateKeyframeButton.addEventListener("click", generateKeyframe);

var retrieveShapeInfoButton = document.querySelector("#retrieveShapeInfo-button");
retrieveShapeInfoButton.addEventListener("click", retrieveShapeInfo);

var refreshCharacterArtsListButton = document.querySelector("#retrieveCharacterLayerName-button");
refreshCharacterArtsListButton.addEventListener("click",refresh_CharacterArtsList);

var generateCharacterControlButton = document.querySelector('#generateCharacterControlLayer-button');
generateCharacterControlButton.addEventListener("click",generate_characterControlLayer);

var generateCharacterOutputButton = document.querySelector('#generateCharacterOutputLayers-button');
generateCharacterOutputButton.addEventListener('click', generate_CharacterOutputLayer);


// =======================================
// Callback functions
// =======================================
// Callback functions for Premiere Pro
function updateUI(result){
  //alert(result);
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

// Callback functions for After Effects
function updateUI_generateResult(result){
  //alert(result);
  //document.getElementById('result-textarea').value = result;
}

function updateUI_retrieveShapeInfo(result){
  alert(result);
  document.getElementById('result-textarea').value = result;
}

function updateUI_generateResultForCharacterArts(result) {
  //alert(result);
}


function updateUI_CharacterArsList(result){
  //alert(result);
  //document.getElementById('timing-textarea').value = result;

  let obj = JSON.parse(result);
  let select_eye_open = document.getElementById('eye-open');
  let select_eye_mostly_open = document.getElementById('eye-mostly-open');
  let select_eye_bit_open = document.getElementById('eye-bit-open');
  let select_eye_close = document.getElementById('eye-close');

  document.getElementById('compItemId').value = obj.compItemId;

  function addElement (obj, select){
    let defaultOption = document.createElement('option');
    // clear existing items
    for (let i = select.length - 1; i >= 0; --i) {
      select.remove(i);
    }

    defaultOption.text = '------';
    defaultOption.value = '-1';
    select.add(defaultOption);

    for (let i = 0; i < obj.layers.length; ++i) {
      let option = document.createElement('option');
      option.text = obj.layers[i].name;
      option.value = obj.layers[i].layerIndex;
      select.add(option);
    }
  }

  addElement(obj, select_eye_open);
  addElement(obj, select_eye_mostly_open);
  addElement(obj, select_eye_bit_open);
  addElement(obj, select_eye_close);
}

/* 3) Write a helper function to pass instructions to the ExtendScript side. */
/// =======================================
// Calling csInterface
// =======================================
// csInterface functions for Premiere Pro
function refresh_LayerList() {
  csInterface.evalScript("retrieveTracklist()", updateUI_refreshLayerList);
}

function retrieveTiming() {
  var selectList = document.getElementById('audio-layer');
  var index = selectList.options[selectList.selectedIndex].value;
  const script = "retrieveTiming(" + index + ")";
  csInterface.evalScript(script, updateUI);
}

// csInterface functions for After Effects
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

function refresh_CharacterArtsList() {
  csInterface.evalScript("retrieveCharacterArtsList()", updateUI_CharacterArsList);
}

function generate_characterControlLayer() {
  csInterface.evalScript("generateDropdownMenu()",null);
}

function generate_CharacterOutputLayer() {
  // retrieve config from panel
  let targetCompItemId = parseInt(document.getElementById('compItemId').value);
  let minimumOpenEyeDuration = parseInt(document.getElementById('minimumOpenEyeDuration').value);
  let maximumOpenEyeDuration = parseInt(document.getElementById('maximumOpenEyeDuration').value);
  let totalClosedEyeDuration = parseInt(document.getElementById('totalClosedEyeDuration').value);
  let eyeOpen = parseInt(document.getElementById('eye-open').value);
  let eyeMostlyOpen = parseInt(document.getElementById('eye-mostly-open').value);
  let eyeBitOpen = parseInt(document.getElementById('eye-bit-open').value);
  let eyeClosed = parseInt(document.getElementById('eye-close').value);
  let enabled = document.getElementById('blinking-checkBox').checked;
  let randomize = document.getElementById('blinking-enableRandomize-checkbok').checked;

  if (isNaN(targetCompItemId) || isNaN(minimumOpenEyeDuration) ||
    isNaN(maximumOpenEyeDuration) || isNaN(totalClosedEyeDuration) ||
    isNaN(eyeOpen)) {
    // validation error. do nothing.
    alert("validation error on panel");
  } else {

    var config = {
      "config": {
        "comp": {
          "frameRate": 29.97,
          "duration": 10 * 60
        },
        "blinking": {
          "enabled": enabled,
          "targetCompItemId": targetCompItemId,
          "maximumOpenEyeDuration": maximumOpenEyeDuration,
          "minimumOpenEyeDuration": minimumOpenEyeDuration,
          "totalClosedEyeDuration": totalClosedEyeDuration,
          "randomize": randomize,
          "eyeOpen": eyeOpen,
          "eyeClosed": []
        }
      }
    };
    
    if (eyeMostlyOpen !== -1) config.config.blinking.eyeClosed.push(eyeMostlyOpen);
    if (eyeBitOpen !== -1) config.config.blinking.eyeClosed.push(eyeBitOpen);
    if (eyeClosed !== -1) config.config.blinking.eyeClosed.push(eyeClosed);
    //alert(JSON.stringify(config));
    
    const script = "generateCharacterOutputLayer('" + JSON.stringify(config) + "')";
    csInterface.evalScript(script, updateUI_generateResultForCharacterArts);
  }
}



// =======================================
// Initialize
// =======================================
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