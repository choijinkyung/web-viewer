import { useLayoutEffect, useEffect } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/index';
import { ToolChain, ToolChainException } from '@components/Viewer/ArrChain';
import { setToolChange, setChoiceToolChange } from '@store/Tool';
import {
  setOneSeriesBoolChange,
  setComparisonOneSeriesBoolChange,
  setOneSeriesStartNumberChange,
} from '@store/series';
import {
  setComparisonImgaeLayoutChange,
  setComparisonOneSeriesStartNumberChange,
  // setImageLoaderTypeChnage,
} from '@store/comparison';
import { setSelectedStudyType } from '@store/viewerStatus';

import { setComparisonCheckModalBool } from '@store/modal';
import { toolControll } from '@typings/etcType';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
const ToolController = ({ wadouri, comparisonWadoURI, imageLayoutElementBorderActive, firstRandering }: toolControll) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { tool, choiceTool, toolChangeCheckBool, scrollLoopBool } = useSelector((state: RootState) => state.tool.toolbar);
  const { imageLayout } = useSelector(
    (state: RootState) => state.imagelayout.imagelayout,
  );
  const {
    comparisonCheckBool,
    comparisonImageLayout,
    comparisonOneSeriesStartNumber,
    comparisonWadoElementNumber,
  } = useSelector((state: RootState) => state.comparison.comparison);
  const { selectedStudyType } = useSelector((state: RootState) => state.viewerStatus)

  const {
    
    oneSeries,
    comparisonOneSeries,
  } = useSelector((state: RootState) => state.serieslayout.seriesLayout);
  const { comparisonCheckModalBool } = useSelector(
    (state: RootState) => state.modal.modal,
  );
  ////
  const { seriesElementNumber: firstStudyseriesElementNumber } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)
  const { oneSeriesStartNumber: firstStudyOneSeriesStartNumber,
    isOneSeries: firstStudyIsOneSeries
  } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)
  const { imageLayout: firstImageLayout } = useSelector((state: RootState) => state.studyStatus[0].imageLayout)


  ////
  //annotation data 상태값 유지를 위한 코드 //(필요없는 코드일듯)
  // useEffect(()=> {
  //   cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState();
  //   cornerstoneTools.globalImageIdSpecificToolStateManager.saveImageIdToolState();
  // })

  const ToolLogic = debounce(() => {
    if (wadouri.series.length) {
      if (choiceTool !== null && (firstStudyseriesElementNumber !== null || imageLayoutElementBorderActive !== null)) {
        const elements = cornerstone.getEnabledElements();
        //element 분류 (일반검사 / 비교검사 / 원시리즈 / 이미지 레이아웃)
        const element: HTMLDivElement | null =
          selectedStudyType === 'default'
            ? Number(firstImageLayout[0]) === 1 && Number(firstImageLayout[1]) === 1
              ? firstStudyIsOneSeries
                ? document.querySelector(`.default${firstStudyseriesElementNumber + firstStudyOneSeriesStartNumber}`)
                : document.querySelector(`.default${firstStudyseriesElementNumber}`)
              : imageLayoutElementBorderActive?.querySelector('.imageLayoutElement') ??
              document.querySelector('.imageLayoutElement')
            : Number(comparisonImageLayout[0]) === 1 && Number(comparisonImageLayout[1]) === 1
              ? comparisonOneSeries
                ? document.querySelector(`.comparison${comparisonWadoElementNumber + comparisonOneSeriesStartNumber}`)
                : document.querySelector(`.comparison${comparisonWadoElementNumber}`)
              : imageLayoutElementBorderActive?.querySelector('.imageLayoutElement') ??
              document.querySelector('.imageLayoutElement');
        if (ToolChainException.includes(tool) && element !== null) {
          const viewport = cornerstone.getViewport(element);
          const ToolStateObj = cornerstoneTools.globalImageIdSpecificToolStateManager.toolState;
          const ObjKey = Object.keys(ToolStateObj);
          const ToolNameObj: any = [];
          let elementLength;
          let comparisonElementLength;
          switch (tool) {
            case 'default':
              if (choiceTool !== 'comparisonCheck') {
                cornerstoneTools.setToolPassive(choiceTool, { mouseButtonMask: 1 });
              }
              elements.forEach((value) => {
                if (
                  value.element.classList.value.includes('wadoElement') ||
                  value.element.classList.value.includes('imageLayoutElement')
                ) {
                  if (scrollLoopBool) {
                    cornerstoneTools.removeToolForElement(value.element, 'StackScroll');
                    cornerstoneTools.addToolForElement(value.element, cornerstoneTools.StackScrollTool, {
                      configuration: { loop: true },
                    });
                    cornerstoneTools.setToolActiveForElement(value.element, 'StackScroll', { mouseButtonMask: 1 });
                  } else {
                    cornerstoneTools.addToolForElement(value.element, cornerstoneTools.StackScrollTool);
                    cornerstoneTools.setToolActiveForElement(value.element, 'StackScroll', { mouseButtonMask: 1 });
                  }
                  if (firstStudyIsOneSeries) {
                    cornerstoneTools.removeToolForElement(value.element, 'StackScroll');
                  }
                }
              });

              dispatch(setChoiceToolChange('StackScroll'));
              break;
            case 'GSPS':
              dispatch(
                setToolChange({
                  tool: 'default',
                  toolbool: !toolChangeCheckBool,
                }),
              );
              break;
            case 'ScrollLoop':
              if (choiceTool === 'ReferenceLines') {
                cornerstoneTools.setToolPassive(choiceTool, { mouseButtonMask: 1 });
              }
              break;
            case 'oneSeriesImage':
              //원시리즈이미지 tool
              if (choiceTool === 'ReferenceLines') {
                // dispatch(setChoiceToolChange('default'));
              }
              if (selectedStudyType === 'default') {
                if (firstStudyIsOneSeries) {
                  dispatch({ type: 'setOneSeriesStartNumber/0', payload: 0 })

                  // dispatch(
                  //   setToolChange({
                  //     tool: 'default',
                  //     toolbool: !toolChangeCheckBool,
                  //   }),
                  // );
                }
                dispatch({ type: 'setIsOneSeries/0', payload: !firstStudyIsOneSeries })
              } else if (selectedStudyType === 'comparison') {
                if (comparisonOneSeries) {
                  dispatch(setComparisonOneSeriesStartNumberChange(0));
                  // dispatch(
                  //   setToolChange({
                  //     tool: 'default',
                  //     toolbool: !toolChangeCheckBool,
                  //   }),
                  // );
                }
                dispatch(setComparisonOneSeriesBoolChange(!comparisonOneSeries));
              }
              break;
            case 'comparisonCheck':
              //비교검사 tool
              if (comparisonCheckModalBool) {
                dispatch(setSelectedStudyType('default'));
                if (comparisonImageLayout[0] * comparisonImageLayout[1] !== 1) {
                  dispatch(setComparisonImgaeLayoutChange([1, 1]))
                }
              }
              dispatch(setComparisonCheckModalBool(!comparisonCheckModalBool));
              dispatch(
                setToolChange({
                  tool: choiceTool === "StackScroll" ? "default" : choiceTool,
                  toolbool: !toolChangeCheckBool,
                }),
              );

              break;
            case 'Crosshairs':
              const crossTool = cornerstoneTools.CrosshairsTool;
              elementLength = elements.filter((v) => {
                if (
                  selectedStudyType === 'default'
                    ? v.element.classList.value.includes('default')
                    : v.element.classList.value.includes('comparison')
                ) {
                  return true;
                } else {
                  false;
                }
              });

              if (elementLength?.length < 2) {
                alert(t('TID03067'));
                if (comparisonCheckBool) {
                  return;
                }
                document.querySelector('.active-tool-modal')?.classList.remove('active-tool-modal');
                document.querySelector('.active-tool')?.classList.remove('active-tool');
                document.querySelector('.default')?.classList.add('active-tool');
                dispatch(
                  setToolChange({
                    tool: 'default',
                    toolbool: !toolChangeCheckBool,
                  }),
                );
                return;
              }
              // cornerstoneTools.setToolPassive(choiceTool, { mouseButtonMask: 1 });
              cornerstoneTools.addTool(cornerstoneTools.ReferenceLinesTool);
              if (comparisonCheckBool) {
                const synchronizer2 = new cornerstoneTools.Synchronizer(
                  'cornerstonenewimage',
                  cornerstoneTools.updateImageSynchronizer,
                );
                const synchronizer3 = new cornerstoneTools.Synchronizer(
                  'cornerstonenewimage',
                  cornerstoneTools.updateImageSynchronizer,
                );
                elements.forEach(async (value) => {

                  const imageData: any = await cornerstone.getImage(value.element);
                  if (imageData.data.string('x00080008') !== undefined) {
                    const type = (!(imageData.data.string('x00080008').includes('SECONDARY')) && !(imageData.data.string('x00080008').includes('PROT')))
                    const type2 = imageData.data.string('x00280004').includes("MONOCHROME2")
                    if (
                      value.element.classList.value.includes('default') && type && type2
                    ) {
                      synchronizer2.add(value.element);
                      synchronizer2.enabled = true;
                    }
                    else if (value.element.classList.value.includes('comparison') && type && type2) {
                      synchronizer3.add(value.element);
                      synchronizer3.enabbled = true;
                    }
                  }
                });
                let number = 0;
                let number1 = 0;
                elements.forEach(async (value) => {
                  const imageData: any = await cornerstone.getImage(value.element);
                  if (imageData.data.string('x00080008') !== undefined) {

                    const type = !(imageData.data.string('x00080008').includes('SECONDARY') || imageData.data.string('x00080008').includes('PROT'))
                    const type2 = imageData.data.string('x00280004').includes("MONOCHROME2")
                    const oneSeriesCheck = value.element.classList.value.includes('normal')
                    if (
                      value.element.classList.value.includes('default') && type && type2 && oneSeriesCheck
                    ) {
                      const imageIds = wadouri.series[number];
                      number++;
                      const stack = {
                        currentImageIdIndex: 0,
                        imageIds,
                      };
                      cornerstoneTools.addStackStateManager(value.element, ['stack', 'Crosshairs']);
                      cornerstoneTools.addToolState(value.element, 'stack', stack);
                      cornerstoneTools.addToolForElement(value.element, crossTool);
                      cornerstoneTools.setToolActiveForElement(value.element, 'Crosshairs', {
                        mouseButtonMask: 1,
                        synchronizationContext: synchronizer2,
                      });
                      cornerstoneTools.setToolEnabledForElement(value.element, 'ReferenceLines', {
                        synchronizationContext: synchronizer2,
                      });
                    } else if (value.element.classList.value.includes('comparison') && type && type2 && oneSeriesCheck) {
                      const imageIds = comparisonWadoURI.series[number1];
                      number1++;
                      const stack = {
                        currentImageIdIndex: 0,
                        imageIds,
                      };
                      cornerstoneTools.addStackStateManager(value.element, ['stack', 'Crosshairs']);
                      cornerstoneTools.addToolState(value.element, 'stack', stack);
                      cornerstoneTools.addToolForElement(value.element, crossTool);
                      cornerstoneTools.setToolActiveForElement(value.element, 'Crosshairs', {
                        mouseButtonMask: 1,
                        synchronizationContext: synchronizer3,
                      });
                      cornerstoneTools.setToolEnabledForElement(value.element, 'ReferenceLines', {
                        synchronizationContext: synchronizer3,
                      });

                    }
                  }
                });
              } else {
                const synchronizer2 = new cornerstoneTools.Synchronizer(
                  'cornerstonenewimage',
                  cornerstoneTools.updateImageSynchronizer,
                );
                elements.forEach(async (value) => {
                  const imageData: any = await cornerstone.getImage(value.element);
                  if (imageData.data.string('x00080008') !== undefined) {
                    const type = !(imageData.data.string('x00080008').includes('SECONDARY') || imageData.data.string('x00080008').includes('PROT'))
                    const type2 = imageData.data.string('x00280004').includes("MONOCHROME2")
                    const oneSeriesCheck = value.element.classList.value.includes('normal')
                    if (
                      value.element.classList.value.includes('default') && type && type2 && oneSeriesCheck
                    ) {
                      synchronizer2.add(value.element);
                      synchronizer2.enabled = true;
                    }
                  }
                });
                let number = 0;
                elements.forEach(async (value) => {
                  const imageData: any = await cornerstone.getImage(value.element);
                  if (imageData.data.string('x00080008') !== undefined) {

                    const type = !(imageData.data.string('x00080008').includes('SECONDARY') || imageData.data.string('x00080008').includes('PROT'))
                    const type2 = imageData.data.string('x00280004').includes("MONOCHROME2")
                    const oneSeriesCheck = value.element.classList.value.includes('normal')
                    if (
                      value.element.classList.value.includes('default') && type && type2 && oneSeriesCheck
                    ) {
                      const imageIds = wadouri.series[number];
                      number++;
                      const stack = {
                        currentImageIdIndex: 0,
                        imageIds,
                      };
                      cornerstoneTools.addStackStateManager(value.element, ['stack', 'Crosshairs']);
                      cornerstoneTools.addToolState(value.element, 'stack', stack);
                      cornerstoneTools.addToolForElement(value.element, crossTool);
                      cornerstoneTools.setToolActiveForElement(value.element, 'Crosshairs', {
                        mouseButtonMask: 1,
                        synchronizationContext: synchronizer2,
                      });
                      cornerstoneTools.setToolEnabledForElement(value.element, 'ReferenceLines', {
                        synchronizationContext: synchronizer2,
                      });
                    }
                  }
                });
              }

              //10/23 원래코드
              // elements.forEach(async (value) => {
              //   const imageData: any = await cornerstone.getImage(value.element);
              //   if  (imageData.data.string('x00080008') !== undefined){
              //     const type =!(imageData.data.string('x00080008').includes('SECONDARY') || imageData.data.string('x00080008').includes('PROT'))
              //     const type2 = imageData.data.string('x00280004').includes("MONOCHROME2")
              //     if (
              //       imageLoaderType === 'default'
              //       ? value.element.classList.value.includes('default') && type && type2
              //       : value.element.classList.value.includes('comparison') && type && type2
              //       ) {
              //         synchronizer2.add(value.element);
              //         synchronizer2.enabled = true;
              //       }
              //   }
              // });
              // let number = 0;
              // elements.forEach(async (value) => {
              //   const imageData: any = await cornerstone.getImage(value.element);
              //   if (imageData.data.string('x00080008') !== undefined) {

              //     const type =!(imageData.data.string('x00080008').includes('SECONDARY') || imageData.data.string('x00080008').includes('PROT'))
              //     const type2 = imageData.data.string('x00280004').includes("MONOCHROME2")
              //     const oneSeriesCheck = value.element.classList.value.includes('normal')
              //     if (
              //       imageLoaderType === 'default'
              //       ? value.element.classList.value.includes('default') && type && type2 &&oneSeriesCheck
              //       : value.element.classList.value.includes('comparison') && type && type2&& oneSeriesCheck
              //       ) {
              //         const imageIds = imageLoaderType === 'default' ? wadouri.series[number] : comparisonWadoURI.series[number];
              //         number++;
              //         const stack = {
              //           currentImageIdIndex: 0,
              //           imageIds,
              //         };
              //         cornerstoneTools.addStackStateManager(value.element, ['stack', 'Crosshairs']);
              //         cornerstoneTools.addToolState(value.element, 'stack', stack);
              //         cornerstoneTools.addToolForElement(value.element, crossTool);
              //         cornerstoneTools.setToolActiveForElement(value.element, 'Crosshairs', {
              //           mouseButtonMask: 1,
              //           synchronizationContext: synchronizer2,
              //         });
              //         cornerstoneTools.setToolEnabledForElement(value.element, 'ReferenceLines', {
              //           synchronizationContext: synchronizer2,
              //         });
              //       }
              //   }
              // });
              dispatch(setChoiceToolChange('Crosshairs'));
              // dispatch(setChoiceToolChange('ReferenceLines'));
              break;
            case 'invert':
              if (viewport !== undefined) {
                viewport.invert = !viewport.invert;
                cornerstone.setViewport(element, viewport);
              } else {
                return;
              }
              break;
            case 'rightRotate':
              if (viewport !== undefined) {
                viewport.rotation += 90;
                cornerstone.setViewport(element, viewport);
              }
              break;
            case 'leftRotate':
              if (viewport !== undefined) {
                viewport.rotation -= 90;
                cornerstone.setViewport(element, viewport);
              }
              break;
            case 'horizontalFlip':
              if (viewport) {
                viewport.hflip = !viewport.hflip;
                cornerstone.setViewport(element, viewport);
              }
              break;
            case 'referenceLine':
              elementLength = elements.filter((v) => {
                if (v.element.classList.value.split(' ')[0] === 'wadoElement') {
                  return true;
                } else {
                  false;
                }
              });
              if (elementLength?.length < 2) {
                alert(t('TID03067'));
                if (comparisonCheckBool) {
                  return;
                }
                document.querySelector('.active-tool-modal')?.classList.remove('active-tool-modal');
                document.querySelector('.active-tool')?.classList.remove('active-tool');
                document.querySelector('.default')?.classList.add('active-tool');
                dispatch(
                  setToolChange({
                    tool: 'default',
                    toolbool: !toolChangeCheckBool,
                  }),
                );
                return;
              }
              if (comparisonCheckBool) {
                elements.forEach((value) => {
                  const oneSeriesCheck = value.element.classList.value.includes('normal')
                  if (
                    value.element.classList.value.includes('wadoElement') && oneSeriesCheck
                  ) {
                    cornerstoneTools.setToolPassiveForElement(value.element, choiceTool, { mouseButtonMask: 1 });
                  }
                });
                dispatch(setChoiceToolChange('ReferenceLines'));
                const synchronizer = new cornerstoneTools.Synchronizer(
                  'cornerstonenewimage',
                  cornerstoneTools.updateImageSynchronizer,
                );
                const comparisonSynchronizer = new cornerstoneTools.Synchronizer(
                  'cornerstonenewimage',
                  cornerstoneTools.updateImageSynchronizer,
                );
                elements.forEach((value) => {
                  const oneSeriesCheck = value.element.classList.value.includes('normal')
                  if (
                    value.element.classList.value.includes('default') && oneSeriesCheck
                  ) {
                    synchronizer.add(value.element);
                  } else if (value.element.classList.value.includes('comparison')) {
                    comparisonSynchronizer.add(value.element)
                  }
                });
                synchronizer.enabled = true;
                comparisonSynchronizer.enabled = true;
                cornerstoneTools.addTool(cornerstoneTools.ReferenceLinesTool);
                elements.forEach((value) => {
                  if (
                    value.element.classList.value.includes('default')
                  ) {
                    cornerstoneTools.setToolEnabledForElement(value.element, 'ReferenceLines', {
                      synchronizationContext: synchronizer,
                    });
                    cornerstoneTools.setToolActiveForElement(value.element, 'StackScroll', { mouseButtonMask: 1 });
                  } else if (value.element.classList.value.includes('comparison')) {
                    cornerstoneTools.setToolEnabledForElement(value.element, 'ReferenceLines', {
                      synchronizationContext: comparisonSynchronizer,
                    });
                    cornerstoneTools.setToolActiveForElement(value.element, 'StackScroll', { mouseButtonMask: 1 });
                  }
                });

              } else {
                elements.forEach((value) => {
                  if (
                    value.element.classList.value.includes('default')
                  ) {
                    // if  (choiceTool ==='ReferenceLines') {
                    //   return;
                    // }else {
                    cornerstoneTools.setToolPassiveForElement(value.element, choiceTool, { mouseButtonMask: 1 });
                    // }
                  }
                });
                dispatch(setChoiceToolChange('ReferenceLines'));
                const synchronizer = new cornerstoneTools.Synchronizer(
                  'cornerstonenewimage',
                  cornerstoneTools.updateImageSynchronizer,
                );
                elements.forEach((value) => {
                  const oneSeriesCheck = value.element.classList.value.includes('normal');
                  if (
                    value.element.classList.value.includes('default') && oneSeriesCheck
                  ) {
                    synchronizer.add(value.element);
                  }
                });
                synchronizer.enabled = true;
                cornerstoneTools.addTool(cornerstoneTools.ReferenceLinesTool);
                elements.forEach((value) => {
                  const oneSeriesCheck = value.element.classList.value.includes('normal');
                  if (
                    value.element.classList.value.includes('default') && oneSeriesCheck
                  ) {
                    cornerstoneTools.setToolEnabledForElement(value.element, 'ReferenceLines', {
                      synchronizationContext: synchronizer,
                    });
                    cornerstoneTools.setToolActiveForElement(value.element, 'StackScroll', { mouseButtonMask: 1 });
                  }
                });
              }
              //10/10 원래코드
              // elements.forEach((value) => {
              //   if (
              //     imageLoaderType === 'default'
              //       ? value.element.classList.value.includes('default')
              //       : value.element.classList.value.includes('comparison')
              //   ) {
              //     // if  (choiceTool ==='ReferenceLines') {
              //     //   return;
              //     // }else {
              //       cornerstoneTools.setToolPassiveForElement(value.element, choiceTool, { mouseButtonMask: 1 });
              //     // }
              //   }
              // });
              // dispatch(setChoiceToolChange('ReferenceLines'));
              // const synchronizer = new cornerstoneTools.Synchronizer(
              //   'cornerstonenewimage',
              //   cornerstoneTools.updateImageSynchronizer,
              // );
              // elements.forEach((value) => {
              //   if (
              //     imageLoaderType === 'default'
              //       ? value.element.classList.value.includes('default')
              //       : value.element.classList.value.includes('comparison')
              //   ) {
              //     synchronizer.add(value.element);
              //   }
              // });
              // synchronizer.enabled = true;
              // cornerstoneTools.addTool(cornerstoneTools.ReferenceLinesTool);
              // elements.forEach((value) => {
              //   if (
              //     imageLoaderType === 'default'
              //       ? value.element.classList.value.includes('default')
              //       : value.element.classList.value.includes('comparison')
              //   ) {
              //     cornerstoneTools.setToolEnabledForElement(value.element, 'ReferenceLines', {
              //       synchronizationContext: synchronizer,
              //     });
              //     cornerstoneTools.setToolActiveForElement(value.element, 'StackScroll', { mouseButtonMask: 1 });
              //   }
              // });
              break;
            case 'verticalFlip':
              if (viewport) {
                viewport.vflip = !viewport.vflip;
                cornerstone.setViewport(element, viewport);
              }
              break;
            case 'canvasReset':
              elements.forEach((value) => {
                const { element } = value;
                cornerstone.reset(element);
              });
              // dispatch(
              //   setToolChange({
              //     tool: 'default',
              //     toolbool: !toolChangeCheckBool,
              //   }),
              // );
              break;
            case 'toolClear':
              for (let i = 0; i < ObjKey.length; i++) {
                ToolNameObj[i] = Object.keys(ToolStateObj[ObjKey[i]]);
              }

              elements.forEach((value) => {
                const { element } = value;

                for (let i = 0; i < ToolNameObj.length; i++) {
                  for (let j = 0; j < ToolNameObj[i].length; j++) {
                    cornerstoneTools.clearToolState(element, ToolNameObj[i][j]);
                  }
                }
                cornerstone.updateImage(element);
              });
              // dispatch(
              //   setToolChange({
              //     tool: 'default',
              //     toolbool: !toolChangeCheckBool,
              //   }),
              // );
              break;
            case 'refresh':
              elements.forEach((value) => {
                const { element } = value;
                cornerstone.reset(element);
              });

              for (let i = 0; i < ObjKey.length; i++) {
                ToolNameObj[i] = Object.keys(ToolStateObj[ObjKey[i]]);
              }
              elements.forEach((value) => {
                const { element } = value;

                for (let i = 0; i < ToolNameObj.length; i++) {
                  for (let j = 0; j < ToolNameObj[i].length; j++) {
                    cornerstoneTools.clearToolState(element, ToolNameObj[i][j]);
                  }
                }
                cornerstone.updateImage(element);
              });
              // dispatch(
              //   setToolChange({
              //     tool: 'default',
              //     toolbool: !toolChangeCheckBool,
              //   }),
              // );
              break;
            case 'TextMarker':
              const TextMarkerTool = cornerstoneTools.TextMarkerTool;
              const text = JSON.parse(sessionStorage.getItem('text') as string).textMarker;
              const configuration = {
                markers: [text[1], text[2], text[3], text[4], text[5]],
                current: text[1],
                ascending: true,
                loop: true,
              };
              elements.forEach((value) => {
                if (
                  value.element.classList.value.includes('wadoElement') ||
                  value.element.classList.value.includes('imageLayoutElement')
                ) {
                  cornerstoneTools.addTool(TextMarkerTool, { configuration });
                  cornerstoneTools.setToolActiveForElement(value.element, 'TextMarker', { mouseButtonMask: 1 });
                }
              });
              dispatch(setChoiceToolChange(tool));
              break;
            case 'interpolation':
              elements.forEach((value) => {
                const { element } = value;
                const viewport: any = cornerstone.getViewport(element);
                viewport.pixelReplication = !viewport.pixelReplication;
                cornerstone.setViewport(element, viewport);
              });
              break;
            case 'playclip':
              break;
            case 'arrowAnnotate':
              elements.forEach((value) => {
                if (
                  value.element.classList.value.includes('wadoElement') ||
                  value.element.classList.value.includes('imageLayoutElement')
                ) {
                  cornerstoneTools.addTool(cornerstoneTools.ArrowAnnotateTool, {
                    configuration: {
                      getTextCallback: () => { },
                      changeTextCallback: () => { },
                    }
                  });
                  cornerstoneTools.setToolActiveForElement(value.element, 'ArrowAnnotate', { mouseButtonMask: 1 });
                }
              });
              dispatch(setChoiceToolChange(tool));
              break;
            default:
              console.log('default : ', tool);
              break;
          }
        } else if (!ToolChainException.includes(tool) && element !== null) {
          cornerstoneTools.setToolPassive(choiceTool, { mouseButtonMask: 1 });
          ToolChain.find((v: any, i: number) => {
            if (v.tool === tool) {
              elements.forEach((value) => {
                if (
                  value.element.classList.value.includes('wadoElement') ||
                  value.element.classList.value.includes('imageLayoutElement')
                ) {
                  cornerstoneTools.addToolForElement(value.element, v.func);
                  cornerstoneTools.setToolActiveForElement(value.element, v.name, { mouseButtonMask: 1 });
                }
              });
              dispatch(setChoiceToolChange(tool));
              return true;
            } else {
              return false;
            }
          });
        } else if (element === null) {
          if (!firstStudyIsOneSeries) {
            dispatch({ type: 'setSeriesElementNumber/0', payload: 0 })
            return;
          }
          alert(t('TID03068'));
          return;
        }
      }
    }
  }, 100)
  //TOOL 로직
  useLayoutEffect(() => {
    ToolLogic()
  }, [tool, toolChangeCheckBool]);
};

export default ToolController;
