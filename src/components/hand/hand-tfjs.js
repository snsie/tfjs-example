/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

//  import '@tensorflow/tfjs-backend-webgl';
 import * as mpHands from '@mediapipe/hands';
 import * as scatter from 'scatter-gl';
//  import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
 
//  tfjsWasm.setWasmPaths(
//      `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${
//          tfjsWasm.version_wasm}/dist/`);
 
 import * as handdetection from '@tensorflow-models/hand-pose-detection';
 
 import {Camera} from './hand-camera';
 import {setupDatGui} from './hand-option-panel';
 import {STATE} from './hand-params';
//  import {setupStats} from './shared/stats_panel';
 import {setBackendAndEnvFlags} from './hand-util';
 
 let detector, camera, stats,scatterGLCtxtLeftHand,scatterGLCtxtRightHand;
 let startInferenceTime, numInferences = 0;
 let inferenceTimeSum = 0, lastPanelUpdate = 0;
 let rafId;
function createScatterGLContext(selectors) {
  const scatterGLEl = document.querySelector(selectors);
  return {
    scatterGLEl,
    scatterGL: new scatter.ScatterGL(scatterGLEl, {
      'rotateOnStart': true,
      'selectEnabled': false,
      'styles': {polyline: {defaultOpacity: 1, deselectedOpacity: 1}}
    }),
    scatterGLHasInitialized: false,
  };
}
 async function createDetector() {
   switch (STATE.model) {
     case handdetection.SupportedModels.MediaPipeHands:
       const runtime = STATE.backend.split('-')[0];
       if (runtime === 'mediapipe') {
         return handdetection.createDetector(STATE.model, {
           runtime,
           modelType: STATE.modelConfig.type,
           maxHands: STATE.modelConfig.maxNumHands,
           solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${mpHands.VERSION}`
         });
       } else if (runtime === 'tfjs') {
         return handdetection.createDetector(STATE.model, {
           runtime,
           modelType: STATE.modelConfig.type,
           maxHands: STATE.modelConfig.maxNumHands
         });
       }
   }
 }
 
 async function checkGuiUpdate() {
   if (STATE.isTargetFPSChanged || STATE.isSizeOptionChanged) {
     camera = await Camera.setupCamera(STATE.camera);
     STATE.isTargetFPSChanged = false;
     STATE.isSizeOptionChanged = false;
   }
 
   if (STATE.isModelChanged || STATE.isFlagChanged || STATE.isBackendChanged) {
     STATE.isModelChanged = true;
 
     window.cancelAnimationFrame(rafId);
 
     if (detector != null) {
       detector.dispose();
     }
 
     if (STATE.isFlagChanged || STATE.isBackendChanged) {
       await setBackendAndEnvFlags(STATE.flags, STATE.backend);
     }
 
     try {
       detector = await createDetector(STATE.model);
     } catch (error) {
       detector = null;
       alert(error);
     }
 
     STATE.isFlagChanged = false;
     STATE.isBackendChanged = false;
     STATE.isModelChanged = false;
   }
 }
 
 function beginEstimateHandsStats() {
   startInferenceTime = (performance || Date).now();
 }
 
 function endEstimateHandsStats() {
   const endInferenceTime = (performance || Date).now();
   inferenceTimeSum += endInferenceTime - startInferenceTime;
   ++numInferences;
 
   const panelUpdateMilliseconds = 1000;
//    if (endInferenceTime - lastPanelUpdate >= panelUpdateMilliseconds) {
//      const averageInferenceTime = inferenceTimeSum / numInferences;
//      inferenceTimeSum = 0;
//      numInferences = 0;
//      stats.customFpsPanel.update(
//          1000.0 / averageInferenceTime, 120 /* maxValue */);
//      lastPanelUpdate = endInferenceTime;
//    }
 }
 
 async function renderResult() {
   if (camera.video.readyState < 2) {
     await new Promise((resolve) => {
       camera.video.onloadeddata = () => {
         resolve(video);
       };
     });
   }
 
   let hands = null;
//    const ctxt = [this.scatterGLCtxtLeftHand, this.scatterGLCtxtRightHand][i];
  
   // Detector can be null if initialization failed (for example when loading
   // from a URL that does not exist).
   if (detector != null) {
     // FPS only counts the time it takes to finish estimateHands.
     beginEstimateHandsStats();
 
     // Detectors can throw errors, for example when using custom URLs that
     // contain a model that doesn't provide the expected output.
     try {
       hands = await detector.estimateHands(
           camera.video,
           {flipHorizontal: false});
     } catch (error) {
       detector.dispose();
       detector = null;
       alert(error);
     }
 
     endEstimateHandsStats();
   }
 
   camera.drawCtx();
 
   // The null check makes sure the UI is not in the middle of changing to a
   // different model. If during model change, the result is from an old model,
   // which shouldn't be rendered.
   if (hands && hands.length > 0 && !STATE.isModelChanged) {
     camera.drawResults(hands,scatterGLCtxtLeftHand,scatterGLCtxtRightHand);
   }
 }
 
 async function renderPrediction(scatterGLCtxtLeftHand,scatterGLCtxtRightHand) {
   await checkGuiUpdate();
 
   if (!STATE.isModelChanged) {
     await renderResult(scatterGLCtxtLeftHand,scatterGLCtxtRightHand);
   }
 
   rafId = requestAnimationFrame(renderPrediction);
 };
 
 async function handTask() {
   // Gui content will change depending on which model is in the query string.
//    const urlParams = new URLSearchParams(window.location.search);
//    if (!urlParams.has('model')) {
//      alert('Cannot find model in the query string.');
//      return;
//    }
 
   await setupDatGui();
//    scatterGLCtxtLeftHand = createScatterGLContext('#scatter-gl-container-left');
//    scatterGLCtxtRightHand = createScatterGLContext('#scatter-gl-container-right'); 
   camera = await Camera.setupCamera(STATE.camera);
//    camera = await Camera.setupCamera(STATE.camera,scatterGLCtxtLeftHand,scatterGLCtxtRightHand);
 
   await setBackendAndEnvFlags(STATE.flags, STATE.backend);
 
   detector = await createDetector();
 
   renderPrediction();
 };
 export default handTask;