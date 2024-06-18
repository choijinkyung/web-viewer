import React, { useRef, useCallback, useState, useEffect, MutableRefObject, useLayoutEffect } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import { WadoImageLoaderCss } from './styles';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { SeriesArray } from '@typings/etcType';
import { debounce } from 'lodash';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import InitCornerstone from '@components/InitCornerstone';
import { ToolChain } from '../ArrChain';
import { setSpinnerChange } from '@store/viewer';
import { RootState } from '@store/index';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { setToolChange } from '@store/Tool';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box } from '@mui/material';
import { Call } from '@utils/JwtHelper';
import { CombinedState } from '@reduxjs/toolkit';
const WadoImageLoader = (props: SeriesArray) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const call = new Call();
  const { study_key } = useParams();
  const {
    series,
    oneSeries,
    comparisonOneSeries,
    thumbnailClick,
  } = useSelector((state: RootState) => state.serieslayout.seriesLayout);

  // type StudyType = 'firstStudy' | 'secondStudy' | 'thirdStudy' | 'forthStudy'
  // const studyType:StudyType=props.type==='firstStudy'?'firstStudy':'secondStudy'

  ////
  const { seriesLayout: firstStudySeriesLayout,
    selectedElementNumber,
    seriesMin,
    seriesMax,
    isOneSeries: firstStudyIsOneSeries,
    seriesThumbnailClick
  } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)
  const { seriesElementNumber: firstStudyseriesElementNumber } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)

  ////
  const seriesLength = useSelector((state: RootState) => state.studyStatus[props.type === 'default' ? 0 : 1].seriesLayout.seriesLength)
  const { tool, choiceTool, toolChangeCheckBool, scrollLoopBool, playClipModal, gspsBool } = useSelector(
    (state: RootState) => state.tool.toolbar,
  );
  const { spinner } = useSelector((state: RootState) => state.viewer.viewer);
  const {
    comparisonCheckBool,
    ComparisonseriesDoubleClickBool,
    comparisonSeries,
    comparisonSeriesMin,
    comparisonSeriesMax,
    comparisonWadoElementNumber
  } = useSelector((state: any) => state.comparison.comparison);
  const { selectedStudyType } = useSelector((state: RootState) => state.viewerStatus)

  const { thumbnailBoxBool, toolBoxBool, mobileThumbnailBool } = useSelector((state: any) => state.setting.setting);
  const ImageViewerElement = useRef() as MutableRefObject<HTMLDivElement>;
  const topLeftDiv = useRef() as MutableRefObject<HTMLDivElement>;
  const topRightDiv = useRef() as MutableRefObject<HTMLDivElement>;
  const bottomLeftDiv = useRef() as MutableRefObject<HTMLDivElement>;
  const bottomRightDiv = useRef() as MutableRefObject<HTMLDivElement>;
  const bottomCenterDiv = useRef() as MutableRefObject<HTMLDivElement>;
  const [imageNotFound, setImgaeNotFound] = useState(false);

  const [firstMountBool, setFirstMountBool] = useState(true);
  const [seriesImageNumber, setSeriesImageNumber] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [playClipSpeedValue, setPalyClipSpeedValue] = useState(20);
  const [playClipStateValue, setPlayClipStateValue] = useState('stop');
  const [gspsTextBool, setGspsTextBool] = useState(false);
  const [defaultFontClassName, setDefaultFontClassName] = useState('XLarge');
  const [comparisonFontClassName, setComparisonFontClassName] = useState('XLarge');
  const [currentImageNumber, setCurrentImageNumber] = useState<any>();
  const [intervalCount, setIntervalCount] = useState<number>(0);
  const intervalRef = useRef<any>()
  /**
   * 현재 series의 int값을 구하기 위한 함수
   */
  function currentSeriesNumber(item: string) {
    let splitUrl = item.split('/');
    let seriesNumber = splitUrl[splitUrl.indexOf('series') + 1];
    return seriesNumber;
  }

  // //플레이클립 range input chnage 이벤트
  // const playClipRangeChenge = useCallback(
  //   debounce((event: any) => {
  //     setPalyClipSpeedValue(Number(event?.target.value));
  //   }, 200),
  //   [],
  // );

  /**
   * playClip 모달 우측방향 버튼 클릭 함수(속도 감소 기능)
   */
  const minusSpeenValue = useCallback(
    (event: any) => {
      event.preventDefault();
      if (playClipSpeedValue < 1) {
        return;
      } else {
        setPalyClipSpeedValue(playClipSpeedValue - 1);
      }
    },
    [playClipSpeedValue],
  );
  /**
   * playClip 모달 좌측방향 버튼 클릭 함수(속도 증가 기능)
   */
  const plusSpeenValue = useCallback(
    (event: any) => {
      event.preventDefault();
      if (playClipSpeedValue > 99) {
        return;
      } else {
        setPalyClipSpeedValue(playClipSpeedValue + 1);
      }
    },
    [playClipSpeedValue],
  );

  /**
   * PlayClip 시작(play) 버튼 함수
   */
  const playClipStartButton = useCallback(
    async (event: any) => {
      const element = ImageViewerElement.current;
      const value = event.target.dataset.value;
      if (playClipStateValue === 'play') {
        return;
      }
      const imageData: any = await cornerstone.getImage(element);
      if (
        imageData !== null &&
        imageData.data.string('x00280008') !== undefined &&
        Number(imageData.data.string('x00280008')) > 1
      ) {
        let imageID = imageData.imageId;
        if (imageID.includes('?')) {
          imageID = imageID.split('?')[0];
        }
        const frameNumber = imageData.data.string('x00280008');
        const imageArr = [];

        for (let i = 0; i < frameNumber; i++) {
          imageArr.push(`${imageID}?frame=${i}`);
        }
        let imageIds = imageArr;
        const stack = {
          currentImageIdIndex: 0,
          imageIds,
        };
        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack);
      }
      cornerstoneTools.playClip(element, playClipSpeedValue);
      // const aa =await cornerstoneTools.getToolState(element, 'stack')
      setPlayClipStateValue('play');
    },
    [playClipSpeedValue, playClipStateValue],
  );

  /**
   * PlayClip 종료(stop) 버튼 함수
   */
  const playClipStopButton = useCallback((evnet: any) => {
    const element = ImageViewerElement.current;
    cornerstoneTools.stopClip(element);
    setPlayClipStateValue('stop');
    const stack = {
      currentImageIdIndex: 0,
      imageIds: props.imageurl,
    };
    cornerstoneTools.addStackStateManager(element, ['stack']);
    cornerstoneTools.addToolState(element, 'stack', stack);
  }, []);

  /**
   * Cornerstone 라이브러리 마우스휠 이벤트
   */
  const handleStackScrollMouseWheel = useCallback(
    (imageId: string) => {
      const element = ImageViewerElement.current;
      const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;
      if (imageId.length < 1) {
        alert('upload several DICOM.');
        return false;
      }
      const imageIds = imageId;
      const stack = {
        currentImageIdIndex: 0,
        imageIds,
      };
      if (element !== null && element !== undefined) {
        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack);
        if (tool === 'ScrollLoop') {
          if (scrollLoopBool) {
            cornerstoneTools.removeToolForElement(element, 'StackScrollMouseWheel');
            cornerstoneTools.addToolForElement(element, StackScrollMouseWheelTool, {
              configuration: { loop: true },
            });
            cornerstoneTools.setToolActive('StackScrollMouseWheel', { mouseButtonMask: 1 });
          } else {
            cornerstoneTools.removeToolForElement(element, 'StackScrollMouseWheel');
            cornerstoneTools.addToolForElement(element, StackScrollMouseWheelTool);
            cornerstoneTools.setToolActive('StackScrollMouseWheel', { mouseButtonMask: 1 });
          }
        } else {
          if (scrollLoopBool) {
            cornerstoneTools.removeToolForElement(element, 'StackScrollMouseWheel');
            cornerstoneTools.addToolForElement(element, StackScrollMouseWheelTool, {
              configuration: { loop: true },
            });
            cornerstoneTools.setToolActive('StackScrollMouseWheel', { mouseButtonMask: 1 });
          } else {
            cornerstoneTools.removeToolForElement(element, 'StackScrollMouseWheel');
            cornerstoneTools.addToolForElement(element, StackScrollMouseWheelTool);
            cornerstoneTools.setToolActive('StackScrollMouseWheel', { mouseButtonMask: 1 });
          }
        }
      }
    },
    [tool, scrollLoopBool],
  );

  /**
   *  Cornerstone 라이브러리 마우스드래그 이벤트
   */
  const handleStackScrollTool = useCallback(
    (imageId: string) => {
      const element = ImageViewerElement.current;
      const StackScrollTool = cornerstoneTools.StackScrollTool;
      if (imageId.length < 1) {
        alert('upload several DICOM.');
        return false;
      }

      const imageIds = imageId;
      const stack = {
        currentImageIdIndex: 0,
        imageIds,
      };
      if (element !== null && element !== undefined) {
        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack);
        if (tool === 'ScrollLoop') {
          if (scrollLoopBool) {
            cornerstoneTools.removeToolForElement(element, 'StackScroll');
            cornerstoneTools.addToolForElement(element, StackScrollTool, {
              configuration: { loop: true },
            });
            cornerstoneTools.setToolActiveForElement(element, 'StackScroll', { mouseButtonMask: 1 });
          } else {
            cornerstoneTools.removeToolForElement(element, 'StackScroll');
            cornerstoneTools.addToolForElement(element, StackScrollTool);
            cornerstoneTools.setToolActiveForElement(element, 'StackScroll', { mouseButtonMask: 1 });
          }
        } else {
          if (tool === 'oneSeriesImage') {
            if (scrollLoopBool) {
              cornerstoneTools.removeToolForElement(element, 'StackScroll');
              cornerstoneTools.addToolForElement(element, StackScrollTool, {
                configuration: { loop: true },
              });
              cornerstoneTools.setToolActiveForElement(element, 'StackScroll', { mouseButtonMask: 1 });
            } else {
              cornerstoneTools.addToolForElement(element, StackScrollTool);
              cornerstoneTools.setToolActiveForElement(element, 'StackScroll', { mouseButtonMask: 1 });
            }
          } else if (tool === 'GSPS') {
            cornerstoneTools.addToolForElement(element, StackScrollTool);
            cornerstoneTools.setToolActiveForElement(element, 'StackScroll', { mouseButtonMask: 1 });
            return;
          } else if (tool !== 'default') {
            ToolChain.find((v: any, i: number) => {
              if (v.tool === tool) {
                cornerstoneTools.addToolForElement(element, v.func);
                cornerstoneTools.setToolActiveForElement(element, v.name, { mouseButtonMask: 1 });
                return true;
              } else {
                return false;
              }
            });
          } else {
            cornerstoneTools.addToolForElement(element, StackScrollTool);
            cornerstoneTools.setToolActiveForElement(element, 'StackScroll', { mouseButtonMask: 1 });
          }
        }
      }
    },
    [tool, scrollLoopBool],
  );

  /**
   * 스크롤 루프에 반응하여 실행되는 이펙트
   */
  useEffect(() => {
    const element = ImageViewerElement.current;
    if (!firstMountBool) {
      if (scrollLoopBool) {
        handleStackScrollTool(props.imageurl);
        handleStackScrollMouseWheel(props.imageurl);
        if (choiceTool !== '' && choiceTool !== undefined) {
          const pastTool = ToolChain.find((v: any) => v.tool === choiceTool);
          if (pastTool !== undefined) {
            cornerstoneTools.addToolForElement(element, pastTool?.func);
            cornerstoneTools.setToolActiveForElement(element, pastTool?.name, { mouseButtonMask: 1 });
          }
        }
      } else {
        handleStackScrollTool(props.imageurl);
        handleStackScrollMouseWheel(props.imageurl);
        if (choiceTool !== '' && choiceTool !== undefined) {
          const pastTool = ToolChain.find((v: any) => v.tool === choiceTool);
          if (pastTool !== undefined) {
            cornerstoneTools.addToolForElement(element, pastTool?.func);
            cornerstoneTools.setToolActiveForElement(element, pastTool?.name, { mouseButtonMask: 1 });
          }
        }
      }
    }
  }, [scrollLoopBool]);

  /**
   * 리사이즈 함수
   */
  const handleResize = debounce(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, 300);

  /**
   * 리사이즈 이펙트
   */
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /**
   * playClip 동작중 range input 변화에 반응하는 이펙트
   */
  useEffect(() => {
    if (playClipModal && playClipStateValue === 'play') {
      const element = ImageViewerElement.current;
      cornerstoneTools.playClip(element, playClipSpeedValue);
    }
  }, [playClipSpeedValue, playClipStateValue]);

  /**
   * playClip이 off 기능 이펙트
   */
  useEffect(() => {
    if (playClipModal === false && playClipStateValue === 'play') {
      const element = ImageViewerElement.current;
      setPlayClipStateValue('stop');
      cornerstoneTools.stopClip(element);
    }
  }, [playClipModal, playClipStateValue]);

  /**
   * Dicom영상을 가져오는 함수
   */
  const loadAndViewImage = useCallback(
    async (imageIndex = 0, countValue: any, imageurl: any = null) => {
      let gsps = props.gsps;
      const imageId: any = countValue === 3 ? imageurl : props.imageurl;
      const element = ImageViewerElement.current;
      const topLeft = topLeftDiv.current;
      const topRight = topRightDiv.current;
      const bottomLeft = bottomLeftDiv.current;
      const bottomRight = bottomRightDiv.current;
      const bottomCenter = bottomCenterDiv.current;
      let image: any = null;
      let check: any = null;
      if (props.type === 'default') {
        props.onDataLoaded();
      } else if (props.type === 'comparison') {
        props.onComparisonDataLoaded();
      }
      if (firstStudyIsOneSeries && props.type === 'default') {
        image = await cornerstone.loadAndCacheImage(imageId);
      } else if (comparisonOneSeries && props.type === 'comparison') {
        image = await cornerstone.loadAndCacheImage(imageId);
      } else {
        try {
          check = await cornerstone.loadAndCacheImage(imageId[0]);
        } catch (error) {
          return;
        }
        if (check !== null && check !== undefined) {
          if (
            check.data !== null &&
            check.data !== undefined &&
            check.data.string('x00280008') !== undefined &&
            Number(check.data.string('x00280008')) > 1
          ) {
            image = await cornerstone.loadAndCacheImage(imageId[imageIndex]);
          } else {
            image = check;
            check = null;
          }
        } else {
          return false;
        }
      }
      if (
        image !== null &&
        image.data.string('x00280008') !== undefined &&
        Number(image.data.string('x00280008')) > 1
      ) {
        const frameNumber = image.data.string('x00280008');
        const imageArr = [];

        for (let i = 0; i < frameNumber; i++) {
          imageArr.push(`${imageId[imageIndex]}?frame=${i}`);
        }
        let imageIds = imageArr;
        const stack = {
          currentImageIdIndex: 0,
          imageIds,
        };
        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack);
      }
      element.addEventListener('cornerstoneimagerendered', (event: any) => {
        const { image } = event.detail;
        const seriesLengthNumber = image.imageId.slice(image.imageId.indexOf('series/') + 7, image.imageId.indexOf('series/') + 10).split('/')[0]
        const viewport: any = cornerstone.getViewport(event.target);
        const { data } = image;

        function isExpectedChars(str: any) {
          return /^[A-Za-z0-9가-힣\s\[\]_()\-]*$/.test(str);
        }
        function Dicomdecoder(dicomData: any) {
          const decoder = new TextDecoder();
          const unit16 = new Uint16Array(data.byteArray.buffer, dicomData.dataOffset, dicomData.length / 2);
          if (!isExpectedChars(decoder.decode(unit16))) {
            const decoder1 = new TextDecoder('euc-kr');
            const unit8 = new Uint8Array(data.byteArray.buffer, dicomData.dataOffset, dicomData.length);
            return decoder1.decode(unit8);
          } else {
            return decoder.decode(unit16);
          }
        }
        const filter: any = [];
        let gspsText2;
        const match =
          props.type === 'default'
            ? firstStudyIsOneSeries
              ? props.imageurl.match(/\/series\/(\d+)\//)
              : props.imageurl[0].match(/\/series\/(\d+)\//)
            : comparisonOneSeries
              ? props.imageurl.match(/\/series\/(\d+)\//)
              : props.imageurl[0].match(/\/series\/(\d+)\//);
        if (match) {
          const seriesNumber = match[1];
          gsps.forEach((v: any) => {
            if (Number(v.SERIES_KEY) === Number(seriesNumber)) {
              filter.push(v);
            }
          });
          if (filter.length > 0) {
            if (!gspsTextBool) {
              setGspsTextBool(true);
            }
            const sortedA = filter.sort((item1: any, item2: any) => item1.CURSEQNUM - item2.CURSEQNUM);
            const filterData = sortedA.map((value: any) => {
              const a = JSON.parse(value.PR_CONTENT);
              const b = a.TextObjectSequence;
              if (b.length > 0) {
                const c: any = b.map((j: any) => j.UnformattedTextValue).join('@');
                return c;
              }
            });
            gspsText2 = filterData;
          } else {
            if (gspsTextBool) {
              setGspsTextBool(false);
            }
          }
        }
        data.string('x00100020');
        data.string('x00100010');
        const overlay = {
          topLeft: {
            pID: Dicomdecoder(data.elements.x00100020),
            patientName: Dicomdecoder(data.elements.x00100010),
            // pID:Dicomdecoder(data.string('x00100020')),
            // patientName: Dicomdecoder(data.string('x00100010')),
            patientBirthDate: data.string('x00100030'),
            seriesNumber: data.string('x00200011'),
            instanceNumber: data.string('x00200013'),
            imageComments: data.string('x00204000') !== undefined ? data.string('x00204000') : '',
            studyDate: data.string('x00080020'),
            studyTime: data.string('x00080030'),
          },
          topRight: {
            institutionName: data.string('x00800080') !== undefined ? Dicomdecoder(data.elements.x00800080) : '',
            manufacturer: data.string('x00080070') !== undefined ? data.string('x00080070') : '',
            manufacturerModelName: data.string('x00081090') !== undefined ? data.string('x00081090') : '',
          },
          bottomLeft: {
            seriesDescription: data.string('x0008103E') !== undefined ? data.string('x0008103E') : '',
          },
          bottomRight: {
            rowCol: `${data.uint16('x00280010')}/${data.uint16('x00280011')}`,
            wwwc: `${Math.round(viewport.voi.windowWidth)} / ${Math.round(viewport.voi.windowCenter)}`,
            operatorName: data.string('x00081070') !== undefined ? Dicomdecoder(data.elements.x00081070) : '',
          },
        };
        console.log(seriesLengthNumber)
        topLeft.innerHTML = `
            <span class="block">${overlay.topLeft.pID}</span>
            <span class="block">${overlay.topLeft.patientName}</span>
            <span class="block">${overlay.topLeft.patientBirthDate}</span>
            <span class="block">${overlay.topLeft.seriesNumber}</span>
            <span class="block imageNumber">${firstStudyIsOneSeries ? props.wadonumber + 1 : overlay.topLeft.instanceNumber}/${props.type === 'default' ? firstStudyIsOneSeries ? props.imageLength : seriesLength[seriesLengthNumber] : comparisonOneSeries ? props.imageLength : seriesLength[seriesLengthNumber]}</span>
            <span class="block">${overlay.topLeft.imageComments}</span>
            <span class="block">${overlay.topLeft.studyDate}</span>
            <span class="block">${overlay.topLeft.studyTime}</span>
          `;

        topRight.innerHTML = `
            <span class="block">${overlay.topRight.institutionName}</span>
            <span class="block">${overlay.topRight.manufacturer}</span>
            <span class="block">${overlay.topRight.manufacturerModelName}</span>
            `;

        bottomLeft.innerHTML = `
            <span class="block">${overlay.bottomLeft.seriesDescription}</span>           
            `;

        bottomRight.innerHTML = `
          <span class="block">${overlay.bottomRight.rowCol}</span>
          <span class="block">${overlay.bottomRight.wwwc}</span>
          <span class="block">${overlay.bottomRight.operatorName}</span>
          `;
        if (gspsText2 !== undefined && gspsText2 !== null && gspsText2.length > 0) {
          if (gspsText2[data.string('x00200013') - 1] !== undefined) {
            bottomCenter.innerHTML = `
              <span class="block">${gspsText2[data.string('x00200013') - 1].split('@')[0]}</span>
              <span class="block">${gspsText2[data.string('x00200013') - 1].split('@')[1]}</span>
              `;
          }
        }
      });
      if (element !== null && element !== undefined) {
        if (image.data.string('x60003000') !== undefined) {
          cornerstoneTools.addToolForElement(element, cornerstoneTools.OverlayTool);
          cornerstoneTools.setToolActive('Overlay', {});
        }
        cornerstone.displayImage(element, image);
        cornerstone.updateImage(element, true);
        cornerstone.reset(element);
        image = null;

        if (!firstStudyIsOneSeries && props.type === 'default') {
          handleStackScrollMouseWheel(imageId);
          handleStackScrollTool(imageId);
          if (choiceTool !== '' && choiceTool !== undefined) {
            const pastTool = ToolChain.find((v: any) => v.tool === choiceTool);
            if (pastTool !== undefined) {
              cornerstoneTools.addToolForElement(element, pastTool?.func);
              cornerstoneTools.setToolActiveForElement(element, pastTool?.name, { mouseButtonMask: 1 });
            }
          }
        } else if (!comparisonOneSeries && props.type === 'comparison') {
          handleStackScrollMouseWheel(imageId);
          handleStackScrollTool(imageId);
          if (
            // countValue === 2 &&
            choiceTool !== '' &&
            choiceTool !== undefined
          ) {
            const pastTool = ToolChain.find((v: any) => v.tool === choiceTool);
            if (pastTool !== undefined) {
              if (pastTool.name === 'Crosshairs') {
                const elements = cornerstone.getEnabledElements();
                const crossTool = cornerstoneTools.CrosshairsTool;
                const synchronizer = new cornerstoneTools.Synchronizer(
                  'cornerstonenewimage',
                  cornerstoneTools.updateImageSynchronizer,
                );
                let number = 0;
                elements.forEach(async (v: any) => {
                  if (v.element.classList.value.includes('comparison')) {
                    const imageData: any = await cornerstone.getImage(v.element);
                    if (imageData !== undefined && imageData.data.string('x00080008') !== undefined) {
                      const type =
                        !imageData.data.string('x00080008').includes('SECONDARY') &&
                        !imageData.data.string('x00080008').includes('PROT');
                      const type2 = imageData.data.string('x00280004').includes('MONOCHROME2');
                      if (type && type2) {
                        synchronizer.add(v.element);
                        synchronizer.enabbled = true;
                      }
                    } else {
                      return;
                    }
                  }
                });
                elements.forEach(async (v: any) => {
                  if (v.element.classList.value.includes('comparison')) {
                    const imageData: any = await cornerstone.getImage(v.element);
                    if (imageData !== undefined && imageData.data.string('x00080008') !== undefined) {
                      const type = !(
                        imageData.data.string('x00080008').includes('SECONDARY') ||
                        imageData.data.string('x00080008').includes('PROT')
                      );
                      const type2 = imageData.data.string('x00280004').includes('MONOCHROME2');
                      const oneSeriesCheck = v.element.classList.value.includes('normal');
                      if (type && type2 && oneSeriesCheck) {
                        const imageIds = props.wadourl[number];
                        number++;
                        const stack = {
                          currentImageIdIndex: 0,
                          imageIds,
                        };
                        cornerstoneTools.addStackStateManager(v.element, ['stack', 'Crosshairs']);
                        cornerstoneTools.addToolState(v.element, 'stack', stack);
                        cornerstoneTools.addToolForElement(v.element, crossTool);
                        cornerstoneTools.setToolActiveForElement(v.element, 'Crosshairs', {
                          mouseButtonMask: 1,
                          synchronizationContext: synchronizer,
                        });
                        cornerstoneTools.setToolEnabledForElement(v.element, 'ReferenceLines', {
                          synchronizationContext: synchronizer,
                        });
                      } else {
                        cornerstoneTools.addToolForElement(v.element, cornerstoneTools.StackScrollTool);
                        cornerstoneTools.setToolActiveForElement(v.element, 'StackScroll', { mouseButtonMask: 1 });
                      }
                    } else {
                      return;
                    }
                  }
                });
              } else {
                cornerstoneTools.addToolForElement(element, pastTool?.func);
                cornerstoneTools.setToolActiveForElement(element, pastTool?.name, { mouseButtonMask: 1 });
              }
            }
          }
        } else {
          cornerstoneTools.removeToolForElement(element, 'StackScroll');
          cornerstoneTools.removeToolForElement(element, 'StackScrollMouseWheel');
          cornerstoneTools.removeToolForElement(element, 'ReferenceLines');
          cornerstoneTools.removeToolForElement(element, 'Crosshairs');
          cornerstone.updateImage(element);
          if (choiceTool === 'ReferenceLines') {
            const StackScrollTool = cornerstoneTools.StackScrollTool;
            cornerstoneTools.addToolForElement(element, StackScrollTool);
            cornerstoneTools.setToolActiveForElement(element, 'StackScroll', { mouseButtonMask: 1 });
            cornerstoneTools.removeToolForElement(element, 'StackScroll');
          }
          if (choiceTool !== '' && choiceTool !== undefined) {
            const pastTool = ToolChain.find((v: any) => v.tool === choiceTool);
            if (pastTool !== undefined) {
              cornerstoneTools.addToolForElement(element, pastTool?.func);
              cornerstoneTools.setToolActiveForElement(element, pastTool?.name, { mouseButtonMask: 1 });
            }
          }
        }
      }
      return true;
    },
    [
      props,
      props.gsps,
      firstStudyIsOneSeries,
      playClipSpeedValue,
      seriesImageNumber,
      selectedStudyType,
      comparisonOneSeries,
      tool,
      toolChangeCheckBool,
      choiceTool,
      spinner,
      study_key,
      gspsBool,
      firstStudySeriesLayout,
      comparisonSeries,
      seriesLength
    ],
  );

  /**
   * 워크리스트에서 검사를 클릭하여 였었을 경우
   */
  useEffect(() => {
    if (firstMountBool) {
      const element = ImageViewerElement.current;
      cornerstone.enable(element);
      cornerstoneTools.disableLogger();
      //저장된 annotation값들
      const toolsManager = cornerstoneTools.globalImageIdSpecificToolStateManager.toolState;
      // if (toolsManager !== undefined && toolsManager !== null && JSON.stringify(toolsManager).length < 3) {
      if (toolsManager !== undefined && toolsManager !== null) {
        for (let key in toolsManager) {
          for (let second in toolsManager[key]) {
            ToolChain.find((v: any, i: number) => {
              if (second === v.name) {
                //add && active 둘다 들어가야 annotation이 나타남
                cornerstoneTools.addToolForElement(element, v.func);
                cornerstoneTools.setToolActiveForElement(element, v.name, { mouseButtonMask: 1 });
                return true;
              } else {
                return false;
              }
            });
          }
        }
      }
      if (props.imageurl.length) {
        dispatch(setSpinnerChange(true));
        loadAndViewImage(0, 1).then(() => {
          setCurrentImageNumber(currentSeriesNumber(props.imageurl[0]));
          // HandleGSPS();
        });
      }
      setFirstMountBool((bool) => !bool);
    }
  }, []);

  /**
   * 뷰어페이지에서 이전,다음 검사를 클릭하여 열었을 경우
   */
  useEffect(() => {
    const element = ImageViewerElement.current;
    if (!firstMountBool) {
      cornerstoneTools.stopClip(element);
      const ToolState = cornerstoneTools.getToolState(element, 'stack')?.data[0] ?? '';
      let currentImageIdIndex = 0;
      let currentArraycheck;
      if (ToolState !== '') {
        currentImageIdIndex = ToolState.currentImageIdIndex ?? '';
        currentArraycheck = ToolState.imageIds[0].includes('?frame=') ?? '';
        if (currentArraycheck) {
          currentImageIdIndex = seriesImageNumber;
        } else if (currentArraycheck === '') {
          setSeriesImageNumber(0);
        } else {
          setSeriesImageNumber(currentImageIdIndex);
        }
      }
      if (props.imageurl.length) {
        dispatch(setSpinnerChange(true));
        loadAndViewImage(currentImageIdIndex, 2).then(() => {
          setCurrentImageNumber(currentSeriesNumber(props.imageurl[0]));
          // HandleGSPS();
          // cornerstone.updateImage(element, true);
        });
      }
    }
  }, [
    props.imageurl,
    // study_key,
    firstStudyIsOneSeries,
  ]);

  useEffect(() => {
    if (!firstMountBool) {
      if (props.wadonumber === firstStudyseriesElementNumber) {
        if (currentImageNumber !== currentSeriesNumber(props.imageurl[0])) {
          loadAndViewImage(0, 4).then(() => {
            setCurrentImageNumber(currentSeriesNumber(props.imageurl[0]));
          });
        }
      }
    }
  }, [seriesThumbnailClick]);

  const resize = debounce((element) => {
    cornerstone.updateImage(element, true);
    cornerstone.resize(element);
  }, 0);
  useEffect(() => {
    const elements = cornerstone.getEnabledElements();
    const element = ImageViewerElement.current;
    elements.forEach((v) => {
      if (element === v.element) {
        resize(element);
      }
    });
  }, [
    mobileThumbnailBool,
    selectedElementNumber,
    seriesMax,
    seriesMin,
    firstStudySeriesLayout,
    thumbnailBoxBool,
    toolBoxBool,
    firstStudyIsOneSeries,
    windowSize,
    comparisonCheckBool,
    ComparisonseriesDoubleClickBool,
    comparisonSeries,
    comparisonSeriesMin,
    comparisonSeriesMax,
    comparisonWadoElementNumber
    // study_key
  ]);

  /**
   * 해당 페이지(뷰어)에서 나갈경우 발동되는 함수(wado를 초기화하여 메모리누적 문제를 해결한다)
   */
  useEffect(() => {
    const element = ImageViewerElement.current;
    return () => {
      setPlayClipStateValue('stop');
      cornerstoneTools.stopClip(element);
      setTimeout(() => {
        cornerstone.disable(element);
        cornerstoneWADOImageLoader.webWorkerManager.terminate();
        InitCornerstone();
      }, 5000);
    };
  }, []);
  useEffect(() => {
    const element = ImageViewerElement.current;
    if (!firstMountBool) {
      cornerstone.updateImage(element);
    }
  }, [gspsBool]);

  /**
   * 마우스가 해당 Element 위로 올라갔을 때 시리즈의 전체 사진을 받아오는 함수
   */
  const mouseEnterEvent = useCallback(
    async (event: any) => {
      const imageId = props.imageurl;
      if (props.type === 'default') {
        if (!firstStudyIsOneSeries) {
          await cornerstone
            .loadAndCacheImage(imageId[0])
            .then(() => {
              for (const img of imageId) {
                cornerstone.loadAndCacheImage(img);
              }
              // if (!intervalRef.current) {
              //   let count = intervalCount
              //   intervalRef.current = setInterval(()=>{
              //     cornerstone.loadAndCacheImage(imageId[count]);
              //     count++
              //     setIntervalCount(count);
              //     if (count === imageId.length) {
              //       clearInterval(intervalRef.current)
              //       intervalRef.current =null;
              //       setIntervalCount(0);
              //     }
              //   },10)
              // }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } else if (props.type === 'comparison') {
        if (!comparisonOneSeries) {
          await cornerstone
            .loadAndCacheImage(imageId[0])
            .then(() => {
              for (const img of imageId) {
                cornerstone.loadAndCacheImage(img);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    },
    [props.imageurl, firstStudyIsOneSeries, comparisonOneSeries, intervalCount, intervalRef],
  );

  /**
   * 마우스가 해당 Element를 벗어났을때의 함수
   */
  const mouseLeaveEvent = useCallback(() => {
    // if (intervalRef.current !== null) {
    //   clearInterval(intervalRef.current);
    //   intervalRef.current = null;
    // }
  }, [])

  /**
   * 시리즈 nxn 별로 오버레이의 크기를 변환하기 위한 이펙트
   */
  useEffect(() => {
    if (sessionStorage.getItem('mobile') === 'true') {
      setDefaultFontClassName('mobileFont');
    } else {
      if (props.type === 'default') {
        const seriesValue = firstStudySeriesLayout[0] * firstStudySeriesLayout[1];
        if (seriesValue >= 16) {
          setDefaultFontClassName('small');
        } else if (seriesValue >= 9) {
          setDefaultFontClassName('medium');
        } else if (seriesValue >= 4) {
          setDefaultFontClassName('large');
        } else if (seriesValue > 0) {
          setDefaultFontClassName('XLarge');
        }
      }
    }
  }, [firstStudySeriesLayout]);

  /**
   * 시리즈 nxn 별로 오버레이의 크기를 변환하기 위한 이펙트
   */
  useEffect(() => {
    if (props.type === 'comparison') {
      const seriesValue = comparisonSeries[0] * comparisonSeries[1];
      if (seriesValue >= 16) {
        setComparisonFontClassName('small');
      } else if (seriesValue >= 9) {
        setComparisonFontClassName('medium');
      } else if (seriesValue >= 4) {
        setComparisonFontClassName('large');
      } else if (seriesValue > 0) {
        setComparisonFontClassName('XLarge');
      }
    }
  }, [comparisonSeries]);

  /**
   * 썸네일 드래그 후 해당 Element로 drop시 발동 함수
   */
  const drop = useCallback(
    (event: any) => {
      const items = event.dataTransfer.getData('items').split(',');
      if (props.type === 'default' && selectedStudyType === 'default') {
        if (!firstStudyIsOneSeries) loadAndViewImage(0, 3, items);
        setCurrentImageNumber(currentSeriesNumber(items[0]));
      }
      else if (props.type === 'comparison' && selectedStudyType === 'comparison') {
        if (!comparisonOneSeries) loadAndViewImage(0, 3, items);
        setCurrentImageNumber(currentSeriesNumber(items[0]));

      }
    },
    [firstStudyIsOneSeries, comparisonOneSeries, selectedStudyType],
  );
  return (
    <WadoImageLoaderCss onDragOver={(e) => e.preventDefault()} onDrop={drop}>
      <Box
        ref={ImageViewerElement}
        style={{
          width: '100%',
          height: '100%',
          margin: 'auto',
          overflow: 'hidden',
          position: 'absolute',
        }}
        className={`wadoElement ${props.type}${props.wadonumber} ${props.type} ${props.oneSeries}`}
        onMouseEnter={mouseEnterEvent}
        onMouseLeave={mouseLeaveEvent}
      >
        <Box className={playClipModal ? 'playClipModal' : 'playClipModal displayNone'} style={{ position: 'absolute' }}>
          <Box>
            <Box
              className={playClipStateValue === 'play' ? "playbutton" : 'playbutton active'}
              onClick={playClipStartButton}
              onTouchStart={playClipStartButton}
              data-value="play"
              data-tool="playclip"
            >
              <PlayArrowIcon data-value="play" data-tool="playclip" />
            </Box>
            <Box className="fpsbutton">
              <Box onClick={minusSpeenValue} onTouchStart={minusSpeenValue} className="speedbutton">
                <KeyboardArrowLeftIcon
                  style={{
                    height: '100%',
                  }}
                />
              </Box>
              <p className="fpswords">FPS : {playClipSpeedValue}</p>
              <Box onClick={plusSpeenValue} onTouchStart={plusSpeenValue} className="speedbutton">
                <KeyboardArrowRightIcon
                  style={{
                    height: '100%',
                  }}
                />
              </Box>
            </Box>
            <Box
              className={playClipStateValue === 'stop' ? "stopbutton" : "stopbutton active"}
              onClick={playClipStopButton}
              onTouchStart={playClipStopButton}
              data-value="stop"
              data-tool="playclip"
            >
              <PauseIcon data-value="stop" data-tool="playclip" />
            </Box>
          </Box>
        </Box>
        <Box
          className={
            props.type === 'default' ? `topLeft ${defaultFontClassName}` : `topLeft ${comparisonFontClassName}`
          }
          ref={topLeftDiv}
        ></Box>
        <Box
          className={
            props.type === 'default' ? `topRight ${defaultFontClassName}` : `topRight ${comparisonFontClassName}`
          }
          ref={topRightDiv}
        ></Box>
        <Box
          className={
            props.type === 'default' ? `bottomLeft ${defaultFontClassName}` : `bottomLeft ${comparisonFontClassName}`
          }
          ref={bottomLeftDiv}
        ></Box>
        <Box
          className={
            props.type === 'default' ? `bottomRight ${defaultFontClassName}` : `bottomRight ${comparisonFontClassName}`
          }
          ref={bottomRightDiv}
        ></Box>
        <Box
          className={
            props.type === 'default'
              ? gspsTextBool && gspsBool && props.gspsBool
                ? `bottomCenter ${defaultFontClassName}`
                : `bottomCenter ${defaultFontClassName} displayNone`
              : gspsTextBool && gspsBool && props.gspsBool
                ? `bottomCenter ${comparisonFontClassName}`
                : `bottomCenter ${comparisonFontClassName} displayNone`
          }
          ref={bottomCenterDiv}
        ></Box>
      </Box>
    </WadoImageLoaderCss>
  );
};

export default WadoImageLoader;
