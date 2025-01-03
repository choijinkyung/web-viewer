import cornerstoneTools from 'cornerstone-tools';
import { useTranslation } from 'react-i18next';

export const ToolChain = [
  { tool: 'default', name: 'StackScroll', func: cornerstoneTools.StackScrollTool },
  { tool: 'Wwwc', name: 'Wwwc', func: cornerstoneTools.WwwcTool },
  { tool: 'invert', name: 'invert' },
  { tool: 'Pan', name: 'Pan', func: cornerstoneTools.PanTool },
  { tool: 'Crosshairs', name: 'Crosshairs', func: cornerstoneTools.CrosshairsTool },
  { tool: 'magnify', name: 'Magnify', func: cornerstoneTools.MagnifyTool },
  { tool: 'zoom', name: 'Zoom', func: cornerstoneTools.ZoomTool },
  { tool: 'rotate', name: 'Rotate', func: cornerstoneTools.RotateTool },
  { tool: 'rightRotate', name: 'rightRotate' },
  { tool: 'leftRotate', name: 'leftRotate' },
  { tool: 'horizontalFlip', name: 'horizontalFlip' },
  { tool: 'verticalFlip', name: 'verticalFlip' },
  { tool: 'referenceLine', name: 'ReferenceLines', func: cornerstoneTools.ReferenceLinesTool },
  { tool: 'angle', name: 'Angle', func: cornerstoneTools.AngleTool },
  { tool: 'arrowAnnotate', name: 'ArrowAnnotate', func: cornerstoneTools.ArrowAnnotateTool },
  { tool: 'probe', name: 'Probe', func: cornerstoneTools.ProbeTool },
  { tool: 'length', name: 'Length', func: cornerstoneTools.LengthTool },
  { tool: 'rectangleROI', name: 'RectangleRoi', func: cornerstoneTools.RectangleRoiTool },
  { tool: 'ellipticalROI', name: 'EllipticalRoi', func: cornerstoneTools.EllipticalRoiTool },
  { tool: 'freeHand', name: 'FreehandRoi', func: cornerstoneTools.FreehandRoiTool },
  { tool: 'bidirectional', name: 'Bidirectional', func: cornerstoneTools.BidirectionalTool },
  { tool: 'cobbAngle', name: 'CobbAngle', func: cornerstoneTools.CobbAngleTool },
  { tool: 'TextMarker', name: 'TextMarker', func: cornerstoneTools.TextMarkerTool },
  { tool: 'eraser', name: 'Eraser', func: cornerstoneTools.EraserTool },
  { tool: 'canvasReset', name: 'canvasReset' },
  { tool: 'toolClear', name: 'toolClear' },
  { tool: 'refresh', name: 'refresh' },
  { tool: 'interpolation', name: 'interpolation' },
];

export const ToolChainException = [
  'default',
  'Crosshairs',
  'ScrollLoop',
  'oneSeriesImage',
  'invert',
  'rightRotate',
  'leftRotate',
  'referenceLine',
  'horizontalFlip',
  'verticalFlip',
  'canvasReset',
  'toolClear',
  'refresh',
  'comparisonCheck',
  'TextMarker',
  'playclip',
  'interpolation',
  'arrowAnnotate'
];

export const ActiveToolException = [
  'canvasReset',
  'toolClear',
  'refresh',
  'invert',
  'rightRotate',
  'leftRotate',
  'horizontalFlip',
  'verticalFlip',
];
export function ToolChainArray() {
  const { t } = useTranslation();
  const ToolChainArray = [
    { name: t('TID02829'), tool: 'default', src: 'default.png', desc: t('TID03104')},
    { name: t('TID02833'), tool: 'Wwwc', src: 'wwwc.png', desc: t('TID03105') },
    { name: t('TID01739'), tool: 'invert', src: 'invert.png', desc: t('TID03106')},
    { name: t('TID02832'), tool: 'Pan', src: 'pan.png', desc: t('TID03107')},
    { name: t('TID03015'), tool: 'ScrollLoop', src: 'scrollloop.png', desc:t('TID03108') },
    { name: t('TID03007'), tool: 'oneSeriesImage', src: 'changeImageLayout.png', desc: t('TID03109') },
    { name: t('TID03014'), tool: 'comparisonCheck', src: 'comparison.png', desc: t('TID03111') },
    { name: t('TID03016'), tool: 'playclip', src: 'play.png', desc: t('TID03112') },
    { name: 'GSPS', tool: 'GSPS', src: 'gsps.png', desc: t('TID03113')},
    {
      name: t('TID02997'),
      tool: 'tools',
      src: 'tools.png',
      bool : 'toolsBool',
      desc: t('TID03114'),
      modalTools: [
        { name: t('TID01685'), tool: 'magnify', src: 'magnify.png', desc: t('TID03115')},
        { name: t('TID01682'), tool: 'zoom', src: 'zoom.png', desc: t('TID03116')},
        { name: t('TID02836'), tool: 'rotate', src: 'rotate.png', desc: t('TID03117')},
        { name: t('TID02838'), tool: 'rightRotate', src: 'rightRotate.png', desc: t('TID03118')},
        { name: t('TID02837'), tool: 'leftRotate', src: 'leftRotate.png', desc: t('TID03119')},
        { name: t('TID02839'), tool: 'horizontalFlip', src: 'hFlip.png', desc: t('TID03120')},
        { name: t('TID02840'), tool: 'verticalFlip', src: 'vFlip.png', desc: t('TID03121')},
        { name: t('TID03141'), tool: 'interpolation', src: 'interpolation.png', desc: t('TID03122')},
        { name: 'Crosshairs', tool: 'Crosshairs', src: 'crossHairs.png', desc: t('TID03123')},
        { name: t('TID01826'), tool: 'referenceLine', src: 'referenceLine.png', desc: t('TID03124')},
      ],
    },
    {
      name: t('TID02998'),
      tool: 'annotation',
      src: 'annotation.png',
      bool : 'annotationBool',
      desc: t('TID03125'),
      modalTools: [
        { name: t('TID02843'), tool: 'angle', src: 'angle.png', desc: t('TID03126') },
        { name: t('TID02844'), tool: 'arrowAnnotate', src: 'arrowAnnotate.png', desc: t('TID03127') },
        { name: t('TID02845'), tool: 'probe', src: 'probe.png', desc: t('TID03128') },
        { name: t('TID02846'), tool: 'length', src: 'length.png', desc: t('TID03129') },
        { name: t('TID02847'), tool: 'rectangleROI', src: 'rectangleROI.png', desc: t('TID03130') },
        { name: t('TID02848'), tool: 'ellipticalROI', src: 'ellipticalROI.png', desc: t('TID03131')},
        { name: t('TID02849'), tool: 'freeHand', src: 'freeHand.png', desc: t('TID03132')},
        { name: t('TID02850'), tool: 'bidirectional', src: 'bidirectional.png', desc: t('TID03133')},
        { name: t('TID02851'), tool: 'cobbAngle', src: 'cobbAngle.png', desc: t('TID03134')},
        { name: t('TID02852'), tool: 'TextMarker', src: 'textMarker.png', desc: t('TID03135')},
        { name: t('TID02857'), tool: 'eraser', src: 'eraser.png', desc: t('TID03136')},
      ],
    },
    {
      name: t('TID02999'),
      tool: 'reset',
      src: 'refresh.png',
      bool : 'resetBool',
      desc: t('TID03137'),
      modalTools: [
        { name: t('TID02860'), tool: 'canvasReset', src: 'canvas_reset.png', desc: t('TID03138')},
        { name: t('TID02861'), tool: 'toolClear', src: 'tool_clear.png', desc: t('TID03139')},
        { name: t('TID02862'), tool: 'refresh', src: 'refresh.png', desc: t('TID03140')},
      ],
    },
  ];  
  return ToolChainArray;
}