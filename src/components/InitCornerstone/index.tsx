import dicomParser from 'dicom-parser';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import Hammer from 'hammerjs';
export default function InitCornerstone() {
  // Cornertone Tools
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.Hammer = Hammer;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

  //
  cornerstoneTools.init([
    {
      moduleName: 'globalConfiguration',
      configuration: {
        showSVGCursors: true,
        globalToolSyncEnabled : true,
        autoResizeViewports: true,
      },
    },
    {
      moduleName: 'segmentation',
      configuration: {
        outlineWidth: 2,
      },
    },
  ]);
  const color = JSON.parse(sessionStorage.getItem('color')as string);
  const text =JSON.parse(sessionStorage.getItem('text')as string);
  // Preferences
  const fontFamily =
    'Work Sans, Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif';
  cornerstoneTools.textStyle.setFont(text !== undefined && text !== null ?`${text.annotation}px ${fontFamily}` : `16px ${fontFamily}`);
  cornerstoneTools.toolStyle.setToolWidth(2);
  cornerstoneTools.toolColors.setToolColor(color !== undefined &&color !== null && color.annotation !== undefined && color.annotation !== null ? color.annotation : '#ffff00');
  cornerstoneTools.toolColors.setActiveColor(color !== undefined &&color !== null && color.mouse !== undefined && color.mouse !== null? color.mouse : '#00ff00');

  cornerstoneTools.store.state.touchProximity = 40;

  // IMAGE LOADER
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    taskConfiguration: {
      decodeTask: {
        loadCodecsOnStartup: true,
        initializeCodecsOnStartup: false,
        usePDFJS: false,
        strict: false,
      },
    },
    webWorkerTaskPaths: [
      "https://unpkg.com/cornerstone-wado-image-loader@4.1.0/dist/610.bundle.min.worker.js",
      "https://unpkg.com/cornerstone-wado-image-loader@4.1.0/dist/888.bundle.min.worker.js"
    ]
  });
}
