import cornerstoneTools from 'cornerstone-tools';
import { useTranslation } from 'react-i18next';

export const ToolChain = [
  { tool: 'default', name: 'StackScroll', func: cornerstoneTools.StackScrollTool },
  { tool: 'Wwwc', name: 'Wwwc', func: cornerstoneTools.WwwcTool },
  { tool: 'invert', name: 'invert' },
  { tool: 'Pan', name: 'Pan', func: cornerstoneTools.PanTool },
  { tool: 'Crosshairs', name: 'Crosshairs', func: cornerstoneTools.CrosshairsTool },
  { tool: 'magnify', name: 'Magnify', func: cornerstoneTools.MagnifyTool },
  { tool: 'zoom', name: 'Zoom', func: cornerstoneTools.ZoomTouchPinchTool },
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
    { name: t('TID01682'), tool: 'zoom', src: 'zoom.png', desc: t('TID03116')},
    { name: t('TID02833'), tool: 'Wwwc', src: 'wwwc.png', desc: t('TID03105') },
    { name: t('TID02832'), tool: 'Pan', src: 'pan.png', desc: t('TID03107')},
    { name: t('TID01739'), tool: 'invert', src: 'invert.png', desc: t('TID03106')},
    { name: t('TID02846'), tool: 'length', src: 'length.png', desc: t('TID03129') },
    { name: t('TID02843'), tool: 'angle', src: 'angle.png', desc: t('TID03126') },
    { name: t('TID03016'), tool: 'playclip', src: 'play.png', desc: t('TID03112') },
    { name: t('TID02862'), tool: 'refresh', src: 'refresh.png', desc: t('TID03140')},
  ];  
  return ToolChainArray;
}