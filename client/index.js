"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var csinterface_ts_1 = require("csinterface-ts");
/* 1) Create an instance of CSInterface. */
var csInterface = new csinterface_ts_1.CSInterface();
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
var retrieveShapeInfoButton = document.querySelector("#retrieveShapeInfo-button");
if (retrieveShapeInfoButton) {
    retrieveShapeInfoButton.addEventListener("click", retrieveShapeInfo);
}
var refreshCharacterArtsListButton = document.querySelector("#retrieveCharacterLayerName-button");
if (refreshCharacterArtsListButton) {
    refreshCharacterArtsListButton.addEventListener("click", refresh_CharacterArtsList);
}
var generateCharacterControlButton = document.querySelector("#generateCharacterControlLayer-button");
if (generateCharacterControlButton) {
    generateCharacterControlButton.addEventListener("click", generate_characterControlLayer);
}
var generateCharacterOutputButton = document.querySelector("#generateCharacterOutputLayers-button");
if (generateCharacterOutputButton) {
    generateCharacterOutputButton.addEventListener("click", generate_CharacterOutputLayer);
}
// =======================================
// Callback functions
// =======================================
// Callback functions for Premiere Pro
function updateUI(result) {
    return __awaiter(this, void 0, void 0, function () {
        var generated, textbox;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateAeJson(result)];
                case 1:
                    generated = _a.sent();
                    textbox = document.getElementById("result-textarea");
                    if (textbox) {
                        textbox.value = generated;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function updateUI_refreshLayerList(result) {
    if (result !== "") {
        //alert(result);
        var data = JSON.parse(result);
        //alert(data.audioTracks[0].name);
        var selectList = document.getElementById("audio-layer");
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
function updateUI_generateResult(result) {
    //alert(result);
    //document.getElementById('result-textarea').value = result;
}
function updateUI_retrieveShapeInfo(result) {
    alert(result);
    var input = document.getElementById("result-textarea");
    if (input) {
        input.value = result;
    }
}
function updateUI_generateResultForCharacterArts(result) {
    //alert(result);
}
function updateUI_CharacterArsList(result) {
    var obj = JSON.parse(result);
    var select_eye_open = document.getElementById("eye-open");
    var select_eye_mostly_open = document.getElementById("eye-mostly-open");
    var select_eye_bit_open = document.getElementById("eye-bit-open");
    var select_eye_close = document.getElementById("eye-close");
    var input = document.getElementById("compItemId");
    if (input) {
        input.value = obj.compItemId.toString();
    }
    function addElement(obj, select) {
        var defaultOption = document.createElement("option");
        // clear existing items
        for (var i = select.length - 1; i >= 0; --i) {
            select.remove(i);
        }
        defaultOption.text = "------";
        defaultOption.value = "-1";
        select.add(defaultOption);
        for (var i = 0; i < obj.layers.length; ++i) {
            var option = document.createElement("option");
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
    var selectList = document.getElementById("audio-layer");
    var index = selectList.options[selectList.selectedIndex].value;
    var script = "retrieveTiming(" + index + ")";
    csInterface.evalScript(script, updateUI);
}
// csInterface functions for After Effects
function generateKeyframe() {
    // As the script for evalScript does not allow line break,
    // doing JSON.parse and JSON.stringify is required for minifying is required.
    var input = document.getElementById("timing-textarea");
    var obj = JSON.parse(input.value);
    var enablePosterizationTime = document.getElementById("posterizationTime-checkBox");
    var posterizationTime = document.getElementById("posterizationTime-text");
    var option = {
        posterizationTime: {
            enabled: enablePosterizationTime.checked,
            frameRate: parseInt(posterizationTime.value),
        },
    };
    var timingData = {
        phoneLabels: obj.phoneLabels,
        option: option,
    };
    // need single quote ' is required to enclose json string
    var script = "generateKeyframefromTemplate('" + JSON.stringify(timingData) + "')";
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
    csInterface.evalScript("generateDropdownMenu()", function () { });
}
function generate_CharacterOutputLayer() {
    // retrieve config from panel
    var inputCompItemId = document.getElementById("compItemId");
    var inputMinimumOpenEyeDuration = document.getElementById("minimumOpenEyeDuration");
    var inputMaximumOpenEyeDuration = document.getElementById("maximumOpenEyeDuration");
    var inputTotalClosedEyeDuration = document.getElementById("totalClosedEyeDuration");
    var selectEyeOpen = document.getElementById("eye-open");
    var selectEyeMostlyOpen = document.getElementById("eye-mostly-open");
    var selectEyeBitOpen = document.getElementById("eye-bit-open");
    var selectEyeClose = document.getElementById("eye-close");
    var checkboxBlinkng = document.getElementById("blinking-checkBox");
    var checkboxEnableRandomizing = document.getElementById("blinking-enableRandomize-checkbok");
    var targetCompItemId = parseInt(inputCompItemId.value);
    var minimumOpenEyeDuration = parseInt(inputMinimumOpenEyeDuration.value);
    var maximumOpenEyeDuration = parseInt(inputMaximumOpenEyeDuration.value);
    var totalClosedEyeDuration = parseInt(inputTotalClosedEyeDuration.value);
    var eyeOpen = parseInt(selectEyeOpen.value);
    var eyeMostlyOpen = parseInt(selectEyeMostlyOpen.value);
    var eyeBitOpen = parseInt(selectEyeBitOpen.value);
    var eyeClosed = parseInt(selectEyeClose.value);
    var enabled = checkboxBlinkng.checked;
    var randomize = checkboxEnableRandomizing.checked;
    if (isNaN(targetCompItemId) ||
        isNaN(minimumOpenEyeDuration) ||
        isNaN(maximumOpenEyeDuration) ||
        isNaN(totalClosedEyeDuration) ||
        isNaN(eyeOpen)) {
        // validation error. do nothing.
        alert("validation error on panel");
    }
    else {
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
                    eyeClosed: [],
                },
            },
        };
        if (eyeMostlyOpen !== -1)
            config.config.blinking.eyeClosed.push(eyeMostlyOpen);
        if (eyeBitOpen !== -1)
            config.config.blinking.eyeClosed.push(eyeBitOpen);
        if (eyeClosed !== -1)
            config.config.blinking.eyeClosed.push(eyeClosed);
        var script = "generateCharacterOutputLayer('" + JSON.stringify(config) + "')";
        csInterface.evalScript(script, updateUI_generateResultForCharacterArts);
    }
}
// =======================================
// Initialize
// =======================================
function updateUI_forApp(appName) {
    //alert(appName);
    if (appName === "premierepro") {
        var ui = document.getElementById("aftereffects-fieldset");
        ui.style.display = "none";
        refresh_LayerList();
    }
    else if (appName === "aftereffects") {
        var ui = document.getElementById("premierepro-fieldset");
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
var fs_1 = require("fs");
var path_1 = require("path");
var parsedData = {
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
        }, {
            "name": "A_01_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_01_さとうささら.wav", "startSeconds": 2.95295, "endSeconds": 8.97563333333333, "inPontSeconds": 0, "endPontSeconds": 6.02268333333333, "duration": 6.02268333333333
        }, {
            "name": "A_02_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_02_さとうささら.wav", "startSeconds": 8.97563333333333, "endSeconds": 14.4477666666667, "inPontSeconds": 0, "endPontSeconds": 5.47213333333333, "duration": 5.47213333333333
        }, { "name": "A_03_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_03_さとうささら.wav", "startSeconds": 20.4370833333333, "endSeconds": 29.1291, "inPontSeconds": 0, "endPontSeconds": 8.69201666666667, "duration": 8.69201666666667 }, { "name": "A_04_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_04_さとうささら.wav", "startSeconds": 29.1291, "endSeconds": 34.6679666666667, "inPontSeconds": 0, "endPontSeconds": 5.53886666666667, "duration": 5.53886666666667 }, { "name": "A_05_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_05_さとうささら.wav", "startSeconds": 35.1684666666667, "endSeconds": 43.6102333333333, "inPontSeconds": 0, "endPontSeconds": 8.44176666666667, "duration": 8.44176666666667 }, { "name": "A_06_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_06_さとうささら.wav", "startSeconds": 43.6102333333333, "endSeconds": 47.2305166666667, "inPontSeconds": 0, "endPontSeconds": 3.62028333333333, "duration": 3.62028333333333 }, { "name": "A_07_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_07_さとうささら.wav", "startSeconds": 47.7310166666667, "endSeconds": 57.7243333333333, "inPontSeconds": 0, "endPontSeconds": 9.99331666666667, "duration": 9.99331666666667 }, { "name": "A_08_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_08_さとうささら.wav", "startSeconds": 58.7253333333333, "endSeconds": 62.3789833333333, "inPontSeconds": 0, "endPontSeconds": 3.65365, "duration": 3.65365 }, { "name": "A_09_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_09_さとうささら.wav", "startSeconds": 62.8794833333333, "endSeconds": 75.5421333333333, "inPontSeconds": 0, "endPontSeconds": 12.66265, "duration": 12.66265 }, { "name": "A_10_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_10_さとうささら.wav", "startSeconds": 76.0426333333333, "endSeconds": 84.2675166666667, "inPontSeconds": 0, "endPontSeconds": 8.22488333333333, "duration": 8.22488333333333 }, { "name": "A_11_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_11_さとうささら.wav", "startSeconds": 85.2685166666667, "endSeconds": 99.9164833333333, "inPontSeconds": 0, "endPontSeconds": 14.6479666666667, "duration": 14.6479666666667 }, { "name": "A_12_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_12_さとうささら.wav", "startSeconds": 100.467033333333, "endSeconds": 111.744966666667, "inPontSeconds": 0, "endPontSeconds": 11.2779333333333, "duration": 11.2779333333333 }, { "name": "A_13_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_13_さとうささら.wav", "startSeconds": 112.729283333333, "endSeconds": 119.936483333333, "inPontSeconds": 0, "endPontSeconds": 7.2072, "duration": 7.2072 }, { "name": "A_14_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_14_さとうささら.wav", "startSeconds": 119.936483333333, "endSeconds": 125.8257, "inPontSeconds": 0, "endPontSeconds": 5.88921666666667, "duration": 5.88921666666667 }, { "name": "A_15_さとうささら.wav", "path": "/Volumes/Samsung_T5/VideoProjects/Travel/002_walking_Hallerbos/Talk/P1/A_15_さとうささら.wav", "startSeconds": 125.8257, "endSeconds": 130.513716666667, "inPontSeconds": 0, "endPontSeconds": 4.68801666666667, "duration": 4.68801666666667 }]
};
function readLine(content, x, obj) {
    var phoneLabels = [];
    var lines = content.split('\r\n');
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var phoneRecord = line.split(' ');
        var phoneStartsAt = -1;
        var phoneEndsAt = -1;
        if (phoneRecord && phoneRecord.length === 3) {
            phoneStartsAt = parseFloat(phoneRecord[0]);
            phoneEndsAt = parseFloat(phoneRecord[1]);
        }
        //console.log('phoneStartsAt: ' + phoneRecord.toString() + ', phoneEndsAt: ' + phoneEndsAt.toString());
        if (phoneStartsAt !== -1 && phoneEndsAt !== -1) {
            var phone = phoneRecord[2];
            var lipShape = '';
            // Correct value by deviding by 10000000
            phoneStartsAt /= 10000000;
            phoneEndsAt /= 10000000;
            // Calculate time based on offset
            var startSeconds = x.startSeconds - obj.targetClipStartsAt + phoneStartsAt;
            var endSeconds = x.endSeconds - obj.targetClipStartsAt + phoneEndsAt;
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
            var phoneLabel = { startSeconds: startSeconds, endSeconds: endSeconds, phone: phone, lipShape: lipShape };
            phoneLabels.push(phoneLabel);
        }
    }
    return phoneLabels;
}
function generateAeJson(json) {
    return __awaiter(this, void 0, void 0, function () {
        var response, obj, _i, _a, x, filePath, content, result;
        return __generator(this, function (_b) {
            response = { phoneLabels: [] };
            if (json.length === 0) {
                return [2 /*return*/, ""];
            }
            obj = JSON.parse(json);
            for (_i = 0, _a = obj.audioClips; _i < _a.length; _i++) {
                x = _a[_i];
                filePath = (0, path_1.dirname)(x.path) + '/' + (0, path_1.basename)(x.path, '.wav') + '.lab';
                content = (0, fs_1.readFileSync)(filePath, 'utf8');
                result = readLine(content, x, obj);
                response.phoneLabels = response.phoneLabels.concat(result);
            }
            return [2 /*return*/, JSON.stringify(response)];
        });
    });
}
//# sourceMappingURL=index.js.map