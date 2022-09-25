import { CSInterface } from 'csinterface-ts';

/* 1) Create an instance of CSInterface. */
var csInterface = new CSInterface();

/* 2) Make a reference to your HTML button and add a click handler. */
// =======================================
// EventListener functions
// =======================================
// EventListener for Main
var reloadButton = document.querySelector("#reload-button");
if (reloadButton) {
    reloadButton.addEventListener("click", reloadPage);
}

// EventListner for Premiere Pro
var refreshLayerListButton = document.querySelector("#refreshLayerList-button");
if (refreshLayerListButton) {
    refreshLayerListButton.addEventListener("click", refresh_LayerList);
}

var retrieveTimingButton = document.querySelector("#retrieve-button");
if (retrieveTimingButton) {
    retrieveTimingButton.addEventListener("click", retrieveTiming);
}

// EventListenr for AfterEffects
var generateKeyframeButton = document.querySelector("#generateKeyframe-button");
if (generateKeyframeButton) {
    generateKeyframeButton.addEventListener("click", generateKeyframe);
}

var retrieveShapeInfoButton = document.querySelector(
    "#retrieveShapeInfo-button"
);
if (retrieveShapeInfoButton) {
    retrieveShapeInfoButton.addEventListener("click", retrieveShapeInfo);
}

var refreshCharacterArtsListButton = document.querySelector(
    "#retrieveCharacterLayerName-button"
);

if (refreshCharacterArtsListButton) {
  refreshCharacterArtsListButton.addEventListener(
    "click",
    refresh_CharacterArtsList
  );
}

var generateCharacterControlButton = document.querySelector(
  "#generateCharacterControlLayer-button"
);
if (generateCharacterControlButton) {
  generateCharacterControlButton.addEventListener(
    "click",
    generate_characterControlLayer
  );
}

var generateCharacterOutputButton = document.querySelector(
  "#generateCharacterOutputLayers-button"
);
if (generateCharacterOutputButton) {
  generateCharacterOutputButton.addEventListener(
    "click",
    generate_CharacterOutputLayer
  );
}

// =======================================
// Callback functions
// =======================================
// Callback functions for Premiere Pro
async function updateUI(result: string) {
  //alert(result);
  const generated = await generateAeJson(result);
  //alert("about to call");
  //document.getElementById('result-textarea').value = result;
  const textbox = document.getElementById("result-textarea") as HTMLInputElement;
  if (textbox) {
    textbox.value = generated;
  }
  //alert("updated");
}

function updateUI_refreshLayerList(result: string) {
  if (result !== "") {
    //alert(result);

    var data = JSON.parse(result);
    //alert(data.audioTracks[0].name);
    var selectList = document.getElementById("audio-layer") as HTMLSelectElement;

    // clear all of the elements in the list
    while (selectList.length > 0) {
      selectList.remove(0);
    }

    for (var i = 0; i < data.audioTracks.length; ++i) {
      var option = document.createElement("option");
      option.value = data.audioTracks[i].trackIndex;
      option.text = data.audioTracks[i].name;
      selectList.appendChild(option);
    }
  }
}

// Callback functions for After Effects
function updateUI_generateResult(result: string) {
  //alert(result);
  //document.getElementById('result-textarea').value = result;
}

function updateUI_retrieveShapeInfo(result: string) {
    alert(result);
    const input = document.getElementById("result-textarea") as HTMLInputElement;
    if (input) {
        input.value = result;
    }
}

function updateUI_generateResultForCharacterArts(result: string) {
  //alert(result);
}

interface CharacterArts {
    compItemId: number;
    layers: CharacterLayer[];
}

interface CharacterLayer {
    layerIndex: number;
    name: string;
}

function updateUI_CharacterArsList(result: string) {
  let obj = JSON.parse(result) as CharacterArts;
  let select_eye_open = document.getElementById("eye-open") as HTMLSelectElement;
  let select_eye_mostly_open = document.getElementById("eye-mostly-open") as HTMLSelectElement;
  let select_eye_bit_open = document.getElementById("eye-bit-open") as HTMLSelectElement;
  let select_eye_close = document.getElementById("eye-close") as HTMLSelectElement;

    let input = document.getElementById("compItemId") as HTMLInputElement;
    if (input) {
        input.value = obj.compItemId.toString();
    }

  function addElement(obj: CharacterArts, select: HTMLSelectElement) {
    let defaultOption = document.createElement("option");
    // clear existing items
    for (let i = select.length - 1; i >= 0; --i) {
      select.remove(i);
    }

    defaultOption.text = "------";
    defaultOption.value = "-1";
    select.add(defaultOption);

    for (let i = 0; i < obj.layers.length; ++i) {
      let option = document.createElement("option") as HTMLOptionElement;
      option.text = obj.layers[i].name;
      option.value = obj.layers[i].layerIndex.toString();
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
  const selectList = document.getElementById("audio-layer") as HTMLSelectElement;
  var index = selectList.options[selectList.selectedIndex].value;
  const script = "retrieveTiming(" + index + ")";
  csInterface.evalScript(script, updateUI);
}

// csInterface functions for After Effects
function generateKeyframe() {
  // As the script for evalScript does not allow line break,
  // doing JSON.parse and JSON.stringify is required for minifying is required.
  const input = document.getElementById("timing-textarea") as HTMLInputElement;
  var obj = JSON.parse(input.value);

  const enablePosterizationTime = document.getElementById("posterizationTime-checkBox") as HTMLInputElement;
  const posterizationTime = document.getElementById("posterizationTime-text") as HTMLInputElement;

  var option = {
    posterizationTime: {
      enabled: enablePosterizationTime.checked,
      frameRate: parseInt(
        posterizationTime.value
      ),
    },
  };

  var timingData = {
    phoneLabels: obj.phoneLabels,
    option: option,
  };

  // need single quote ' is required to enclose json string
  const script =
    "generateKeyframefromTemplate('" + JSON.stringify(timingData) + "')";
  csInterface.evalScript(script, updateUI_generateResult);
}

function retrieveShapeInfo() {
  // alert("script yobu yo");
  csInterface.evalScript("retrieveShapeInfo()", updateUI_retrieveShapeInfo);
}

function refresh_CharacterArtsList() {
  csInterface.evalScript(
    "retrieveCharacterArtsList()",
    updateUI_CharacterArsList
  );
}

function generate_characterControlLayer() {
  csInterface.evalScript("generateDropdownMenu()", () => {});
}

function generate_CharacterOutputLayer() {
    // retrieve config from panel
    const inputCompItemId = document.getElementById("compItemId") as HTMLInputElement;
    const inputMinimumOpenEyeDuration = document.getElementById("minimumOpenEyeDuration") as HTMLInputElement;
    const inputMaximumOpenEyeDuration = document.getElementById("maximumOpenEyeDuration") as HTMLInputElement;
    const inputTotalClosedEyeDuration = document.getElementById("totalClosedEyeDuration") as HTMLInputElement;
    const selectEyeOpen = document.getElementById("eye-open") as HTMLSelectElement;
    const selectEyeMostlyOpen = document.getElementById("eye-mostly-open") as HTMLSelectElement;
    const selectEyeBitOpen = document.getElementById("eye-bit-open") as HTMLSelectElement;
    const selectEyeClose = document.getElementById("eye-close") as HTMLSelectElement;
    const checkboxBlinkng = document.getElementById("blinking-checkBox") as HTMLInputElement;
    const checkboxEnableRandomizing = document.getElementById("blinking-enableRandomize-checkbok") as HTMLInputElement;

    let targetCompItemId = parseInt(inputCompItemId.value);
    let minimumOpenEyeDuration = parseInt(inputMinimumOpenEyeDuration.value);
    let maximumOpenEyeDuration = parseInt(inputMaximumOpenEyeDuration.value);
    let totalClosedEyeDuration = parseInt(inputTotalClosedEyeDuration.value);
    let eyeOpen = parseInt(selectEyeOpen.value);
    let eyeMostlyOpen = parseInt(selectEyeMostlyOpen.value);
    let eyeBitOpen = parseInt(selectEyeBitOpen.value);
    let eyeClosed = parseInt(selectEyeClose.value);
    let enabled = checkboxBlinkng.checked;
    let randomize = checkboxEnableRandomizing.checked;

  if (
    isNaN(targetCompItemId) ||
    isNaN(minimumOpenEyeDuration) ||
    isNaN(maximumOpenEyeDuration) ||
    isNaN(totalClosedEyeDuration) ||
    isNaN(eyeOpen)
  ) {
    // validation error. do nothing.
    alert("validation error on panel");
  } else {
    var config = {
      config: {
        comp: {
          frameRate: 29.97,
          duration: 10 * 60,
        },
        blinking: {
          enabled: enabled,
          targetCompItemId: targetCompItemId,
          maximumOpenEyeDuration: maximumOpenEyeDuration,
          minimumOpenEyeDuration: minimumOpenEyeDuration,
          totalClosedEyeDuration: totalClosedEyeDuration,
          randomize: randomize,
          eyeOpen: eyeOpen,
          eyeClosed: [] as number[],
        },
      },
    };

    if (eyeMostlyOpen !== -1)
      config.config.blinking.eyeClosed.push(eyeMostlyOpen);
    if (eyeBitOpen !== -1) config.config.blinking.eyeClosed.push(eyeBitOpen);
    if (eyeClosed !== -1) config.config.blinking.eyeClosed.push(eyeClosed);

    const script =
      "generateCharacterOutputLayer('" + JSON.stringify(config) + "')";
    csInterface.evalScript(script, updateUI_generateResultForCharacterArts);
  }
}

// =======================================
// Initialize
// =======================================
function updateUI_forApp(appName: string) {
  //alert(appName);
  if (appName === "premierepro") {
    const ui = document.getElementById("aftereffects-fieldset") as HTMLFieldSetElement;
    ui.style.display = "none";
    refresh_LayerList();
  } else if (appName === "aftereffects") {
    const ui = document.getElementById("premierepro-fieldset") as HTMLFieldSetElement;
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


import { readFileSync } from "fs";
import { dirname, basename } from "path";

let parsedData = {
    "targetClipStartsAt": 0,
    "targetClipEndsAt": 140.69055,
    "audioClips": [{
        "name": "A_00_さとうささら.wav",
        "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_00_さとうささら.wav",
        "startSeconds": 0,
        "endSeconds": 2.95295,
        "inPontSeconds": 0,
        "endPontSeconds": 2.95295,
        "duration": 2.95295
    },{
        "name": "A_01_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_01_さとうささら.wav", "startSeconds": 2.95295, "endSeconds": 8.97563333333333, "inPontSeconds": 0, "endPontSeconds": 6.02268333333333, "duration": 6.02268333333333
    }, {
        "name": "A_02_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_02_さとうささら.wav", "startSeconds": 8.97563333333333, "endSeconds": 14.4477666666667, "inPontSeconds": 0, "endPontSeconds": 5.47213333333333, "duration": 5.47213333333333 }, { "name": "A_03_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_03_さとうささら.wav", "startSeconds": 20.4370833333333, "endSeconds": 29.1291, "inPontSeconds": 0, "endPontSeconds": 8.69201666666667, "duration": 8.69201666666667 }, { "name": "A_04_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_04_さとうささら.wav", "startSeconds": 29.1291, "endSeconds": 34.6679666666667, "inPontSeconds": 0, "endPontSeconds": 5.53886666666667, "duration": 5.53886666666667 }, { "name": "A_05_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_05_さとうささら.wav", "startSeconds": 35.1684666666667, "endSeconds": 43.6102333333333, "inPontSeconds": 0, "endPontSeconds": 8.44176666666667, "duration": 8.44176666666667 }, { "name": "A_06_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_06_さとうささら.wav", "startSeconds": 43.6102333333333, "endSeconds": 47.2305166666667, "inPontSeconds": 0, "endPontSeconds": 3.62028333333333, "duration": 3.62028333333333 }, { "name": "A_07_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_07_さとうささら.wav", "startSeconds": 47.7310166666667, "endSeconds": 57.7243333333333, "inPontSeconds": 0, "endPontSeconds": 9.99331666666667, "duration": 9.99331666666667 }, { "name": "A_08_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_08_さとうささら.wav", "startSeconds": 58.7253333333333, "endSeconds": 62.3789833333333, "inPontSeconds": 0, "endPontSeconds": 3.65365, "duration": 3.65365 }, { "name": "A_09_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_09_さとうささら.wav", "startSeconds": 62.8794833333333, "endSeconds": 75.5421333333333, "inPontSeconds": 0, "endPontSeconds": 12.66265, "duration": 12.66265 }, { "name": "A_10_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_10_さとうささら.wav", "startSeconds": 76.0426333333333, "endSeconds": 84.2675166666667, "inPontSeconds": 0, "endPontSeconds": 8.22488333333333, "duration": 8.22488333333333 }, { "name": "A_11_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_11_さとうささら.wav", "startSeconds": 85.2685166666667, "endSeconds": 99.9164833333333, "inPontSeconds": 0, "endPontSeconds": 14.6479666666667, "duration": 14.6479666666667 }, { "name": "A_12_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_12_さとうささら.wav", "startSeconds": 100.467033333333, "endSeconds": 111.744966666667, "inPontSeconds": 0, "endPontSeconds": 11.2779333333333, "duration": 11.2779333333333 }, { "name": "A_13_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_13_さとうささら.wav", "startSeconds": 112.729283333333, "endSeconds": 119.936483333333, "inPontSeconds": 0, "endPontSeconds": 7.2072, "duration": 7.2072 }, { "name": "A_14_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_14_さとうささら.wav", "startSeconds": 119.936483333333, "endSeconds": 125.8257, "inPontSeconds": 0, "endPontSeconds": 5.88921666666667, "duration": 5.88921666666667 }, { "name": "A_15_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_15_さとうささら.wav", "startSeconds": 125.8257, "endSeconds": 130.513716666667, "inPontSeconds": 0, "endPontSeconds": 4.68801666666667, "duration": 4.68801666666667 }] };
        

interface audioClip {
    name: string;
    path: string;
    startSeconds: number;
    endSeconds: number;
    inPontSeconds: number;
    endPontSeconds: number;
    duration: number;
}

interface Data {
    targetClipStartsAt: number;
    targetClipEndsAt: number;
    audioClips: audioClip[];
}

interface PhoneLabel {
    startSeconds: number;
    endSeconds: number;
    phone: string;
    lipShape: string;
}

interface LabShape {
    phoneLabels: PhoneLabel[];
}

function readLine(content: string, x: audioClip, obj: Data) {
    let phoneLabels: PhoneLabel[] = [];
    let lines: string[] = content.split('\r\n');
    for (let line of lines) {
        const phoneRecord = line.split(' ');
        let phoneStartsAt: number = -1;
        let phoneEndsAt: number = -1;

        if (phoneRecord && phoneRecord.length === 3) {
            phoneStartsAt = parseFloat(phoneRecord[0]);
            phoneEndsAt = parseFloat(phoneRecord[1]);
        }

        //console.log('phoneStartsAt: ' + phoneRecord.toString() + ', phoneEndsAt: ' + phoneEndsAt.toString());
        if (phoneStartsAt !== -1 && phoneEndsAt !== -1) {
            const phone: string = phoneRecord[2];
            let lipShape = '';
            
            // Correct value by deviding by 10000000
            phoneStartsAt /= 10000000;
            phoneEndsAt /= 10000000;
            
            // Calculate time based on offset
            let startSeconds: number = x.startSeconds - obj.targetClipStartsAt + phoneStartsAt;
            let endSeconds: number = x.endSeconds - obj.targetClipStartsAt + phoneEndsAt;
            
            //console.log('startSeconds: ' + startSeconds.toString() + ', endSeconds: ' + endSeconds.toString());
            // maps to other sounds (for similar shpae)
            switch (phone) {
                case "m":
                    lipShape = "N";
                    break;
                case "p":
                    lipShape = "N";
                    break;
                case "b":
                    lipShape = "N";
                    break;
                case "w":
                    lipShape = "o";
                    break;
                case "pau":
                    lipShape = "N";
                    break;
                default:
                    lipShape = phone;
                    break;
            }

            var phoneLabel: PhoneLabel = {startSeconds: startSeconds, endSeconds: endSeconds, phone: phone, lipShape: lipShape };
            phoneLabels.push(phoneLabel);
        }
    }
    return phoneLabels;
}

async function generateAeJson(json: string): Promise<string> {
    let response: LabShape = { phoneLabels: [] };
    
    if (json.length === 0) {
        return "";
    }

    let obj: Data = JSON.parse(json);
    for(let x of obj.audioClips) {
        let filePath: string = dirname(x.path) + '/' + basename(x.path, '.wav') + '.lab';
        let content: string = readFileSync(filePath, 'utf8');

        let result: PhoneLabel[] = readLine(content, x, obj);
        response.phoneLabels = response.phoneLabels.concat(result);
    }
    return JSON.stringify(response); 
}