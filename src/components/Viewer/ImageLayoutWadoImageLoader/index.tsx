import React, { useRef, useCallback, useState, useEffect, MutableRefObject, useLayoutEffect } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import { ImageLayoutWadoImageLoaderCss } from './styles';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { SeriesArray } from '@typings/etcType';
import { debounce } from 'lodash';
import {
  setComparisonImageLayoutDoubleClickBool,
  setComparisonImageLayoutElementNumber,
  setComparisonWadoElementNumberChange,
  // setImageLoaderTypeChnage,
} from '@store/comparison';
import { setSelectedStudyType } from '@store/viewerStatus';

import { setImageLayoutDoubleClickBoolChange, setImageLayoutElementNumberChange } from '@store/imagelayout';
import { RootState } from '@store/index';
import { current } from '@reduxjs/toolkit';
import { contextMenuLocation } from '@typings/etcType';
import { setViewerContextMenuBool } from '@store/modal';
import { setContextMenuLocationChange, setWadoElementInfoChange } from '@store/viewer';

const ImageLayoutWadoImageLoader = (props: SeriesArray) => {
  const { study_key } = useParams();
  const dispatch = useDispatch();
  const { contextMenuLocation } = useSelector((state: RootState) => state.viewer.viewer);
  const { imageLayout } = useSelector(
    (state: RootState) => state.imagelayout.imagelayout,
  );
  const { oneSeries, comparisonOneSeries } = useSelector((state: RootState) => state.serieslayout.seriesLayout);
  ///
  const { isOneSeries: firstStudyIsOneSeries } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)
  const { imageLayout: firstImageLayout, imageLayoutDoubleClickBool:firstImageLayoutDoubleClickBool } = useSelector((state: RootState) => state.studyStatus[0].imageLayout)

  ///
  
  const { comparisonImageLayoutElementNumber } = useSelector((state: RootState) => state.comparison.comparison);
  const { tool, gspsBool } = useSelector((state: RootState) => state.tool.toolbar);
  const { comparisonImageLayout, comparisonImageLayoutDoubleClickBool, comparisonCheckBool } =
    useSelector((state: RootState) => state.comparison.comparison);
  const { selectedStudyType } = useSelector((state: RootState) => state.viewerStatus)

  const { viewerContextMenuBool, dicomHeaderModalBool } = useSelector((state: RootState) => state.modal.modal);
  const ImageViewerElement = useRef() as MutableRefObject<HTMLDivElement>;
  const topLeftDiv = useRef() as MutableRefObject<HTMLDivElement>;
  const topRightDiv = useRef() as MutableRefObject<HTMLDivElement>;
  const bottomLeftDiv = useRef() as MutableRefObject<HTMLDivElement>;
  const bottomRightDiv = useRef() as MutableRefObject<HTMLDivElement>;
  const bottomCenterDiv = useRef() as MutableRefObject<HTMLDivElement>;

  //첫번째 마운트 이후 처리를 위한 상태값
  const [firstMountBool, setFirstMountBool] = useState(true);

  const [lastTouchTime, setLastTouchTime] = useState(0);

  /**
   * Dicom 영상을 가져오는 함수
   */
  const loadAndViewImage = useCallback(async () => {
    let gsps = props.gsps;
    const imageId = props.imageurl;
    const element = ImageViewerElement.current;
    const topLeft = topLeftDiv.current;
    const topRight = topRightDiv.current;
    const bottomLeft = bottomLeftDiv.current;
    const bottomRight = bottomRightDiv.current;
    const bottomCenter = bottomCenterDiv.current;
    // cornerstone.disable(element);
    // cornerstone.enable(element);
    let image: any = null;
    let check: any = null;
    if (props.type === 'default') {
      if (firstImageLayout[0] !== 1 || firstImageLayout[1] !== 1) {
        image = await cornerstone.loadImage(imageId);
      }
    } else if (props.type === 'comparison') {
      if (comparisonImageLayout[0] !== 1 || comparisonImageLayout[1] !== 1) {
        image = await cornerstone.loadImage(imageId);
      }
    }
    // else {
    //   image = await cornerstone.loadImage(imageId[0]);
    // }
    element.addEventListener('cornerstoneimagerendered', (event: any) => {
      const { image } = event.detail;
      const viewport: any = cornerstone.getViewport(event.target);
      const { data } = image;
      function Dicomdecoder(dicomData: any) {
        const decoder = new TextDecoder();
        const unit16 = new Uint16Array(data.byteArray.buffer, dicomData.dataOffset, dicomData.length / 2);
        return decoder.decode(unit16);
      }

      const filter: any = [];
      let gspsText2;
      const match = props.imageurl.match(/\/series\/(\d+)\//);
      if (match) {
        const seriesNumber = match[1];
        gsps.forEach((v: any) => {
          if (Number(v.SERIES_KEY) === Number(seriesNumber)) {
            filter.push(v);
          }
        });
        if (filter.length > 0) {
          const sortedA = filter.sort((item1: any, item2: any) => item1.IMAGE_KEY - item2.IMAGE_KEY);
          const filterData = sortedA.map((value: any) => {
            const a = JSON.parse(value.PR_CONTENT);
            const b = a.TextObjectSequence;
            if (b.length > 0) {
              const c: any = b.map((j: any) => j.UnformattedTextValue).join(',');
              return c;
            }
          });
          gspsText2 = filterData;
        }
      }
      const overlay = {
        topLeft: {
          pID: data.string('x00100020'),
          patientName: Dicomdecoder(data.elements.x00100010),
          patientBirthDate: data.string('x00100030'),
          seriesNumber: data.string('x00200011'),
          instanceNumber: data.string('x00200013'),
          imageComments: data.string('x00204000') !== undefined ? data.string('x00204000') : '',
          studyDate: data.string('x00080020'),
          studyTime: data.string('x00080030'),
        },
        topRight: {
          institutionName:
            data.string('x00800080') !== undefined ? decodeURIComponent(escape(data.string('x00800080'))) : '',
          manufacturer: data.string('x00080070') !== undefined ? data.string('x00080070') : '',
          manufacturerModelName: data.string('x00081090') !== undefined ? data.string('x00081090') : '',
        },
        bottomLeft: {
          seriesDescription: data.string('x0008103E') !== undefined ? data.string('x0008103E') : '',
        },
        bottomRight: {
          rowCol: `${data.uint16('x00280010')}/${data.uint16('x00280011')}`,
          wwwc: `${Math.round(viewport.voi.windowWidth)} / ${Math.round(viewport.voi.windowCenter)}`,
          operatorName:
            data.string('x00081070') !== undefined ? decodeURIComponent(escape(data.string('x00081070'))) : '',
        },
      };

      topLeft.innerHTML = `
            <span class="block">${overlay.topLeft.pID}</span>
            <span class="block">${overlay.topLeft.patientName}</span>
            <span class="block">${overlay.topLeft.patientBirthDate}</span>
            <span class="block">${overlay.topLeft.seriesNumber}</span>
            <span class="block imageNumber">${overlay.topLeft.instanceNumber}</span>
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
                  <span class="block">${gspsText2[data.string('x00200013') - 1].replace(/,/g, '\n')}</span>
                  `;
        }
      }
    });
    // setTimeout(() => {
    cornerstone.displayImage(cornerstone.getEnabledElement(element).element, image);
    cornerstone.updateImage(element, true);
    // }, 500);
  }, [props.imageurl, firstStudyIsOneSeries, props.gsps, gspsBool]);

  useEffect(() => {
    if (firstMountBool) {
      const element = ImageViewerElement.current;
      cornerstone.enable(element);
      loadAndViewImage();
      setFirstMountBool((bool) => !bool);
    }
  }, [props]);

  /**
   * 마운트 시 Dicom영상을 가져오기 위해 함수(loadAndViewImage)를 호출하는 이펙트
   */
  useEffect(() => {
    const element = ImageViewerElement.current;
    if (!firstMountBool) {
      // cornerstone.disable(element);
      loadAndViewImage().then(() => {
        // cornerstone.draw(element);
        cornerstone.reset(element);
        cornerstone.updateImage(element, true);
      });
    }
  }, [props.imageurl, study_key, firstStudyIsOneSeries]);

  useEffect(() => {
    const element = ImageViewerElement.current;
    if (!firstMountBool) {
      cornerstone.updateImage(element);
    }
  }, [gspsBool]);

  useEffect(() => {
    // if (Number(firstImageLayout[0]) !==1 && Number(firstImageLayout[1]) !== 1){
    //   const handleResize = debounce(() => {
    //     const element = ImageViewerElement.current;
    //     cornerstone.updateImage(element);
    //     // cornerstone.draw(element);
    //     cornerstone.resize(element);
    //   }, 10);
    //   handleResize();
    // }
    const element = ImageViewerElement.current;
    cornerstone.updateImage(element, true);
    cornerstone.resize(element, true);
  }, [
    firstImageLayout,
    firstImageLayoutDoubleClickBool,
    comparisonImageLayout,
    comparisonImageLayoutDoubleClickBool,
    comparisonCheckBool,
  ]);

  useEffect(() => {
    const element = ImageViewerElement.current;
    return () => {
      // cornerstone.imageCache.purgeCache();
      let canvas = element.querySelector('canvas');
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
      }
      setTimeout(() => {
        cornerstone.disable(element);
      }, 5000);
    };
  }, []);

  /**
   * 이미지 클릭 시 함수
   */
  const ElementClickButton = useCallback(
    (event: any) => {
      const parent = event.target.closest('.imageLayoutParentDiv');
      const currentNumber = Number(ImageViewerElement.current.classList.value.split(' ')[1].replace(/[^0-9]/g, ''));
      const timeNow = Date.now();
      // const ActiveCheck = parent.classList.value.includes('border-active');
      // if (ActiveCheck) {
      //   return
      // }else {
      //   document.querySelector('.border-active')?.classList.remove('border-active');
      //   parent.classList.add('border-active');
      // }
      // if (timeNow - lastTouchTime < 300) {
      //   // 300ms 내에 두 번 터치했는지 확인
      //   ElementDoubleClickButton(event);
      //   event.preventDefault(); // 다음 터치 이벤트를 막음 (옵션)
      // }

      // setLastTouchTime(timeNow);

      if (props.type === 'default') {
        dispatch({ type: 'setImageLayoutElementNumber/0', payload: currentNumber })
      } else if (props.type === 'comparison') {
        dispatch(setComparisonImageLayoutElementNumber(currentNumber));
      }
      if (selectedStudyType !== props.type) {
        if (props.type === 'default') {
          dispatch(setSelectedStudyType('default'));
        } else {
          dispatch(setSelectedStudyType('comparison'));
        }
      }
    },
    [selectedStudyType, lastTouchTime],
  );

  /**
   * 이미지 우클릭시 발동 함수 (우클릭 모달 생성)
   */
  const onContextMenuClick = useCallback(
    (event: any) => {
      event.preventDefault();
      const parent = event.target.closest('.imageLayoutElement');
      const parentValueNumber = Number(parent.classList.value.split(' ')[1].replace(/[^0-9]/g, ''));
      const typeCheck = parent.classList.value.includes(selectedStudyType);
      let url;
      if (parent === null || parent === undefined) {
        return;
      }
      if (!typeCheck) {
        if (selectedStudyType === 'default') {
          dispatch(setSelectedStudyType('comparison'));
          dispatch(setComparisonImageLayoutElementNumber(parentValueNumber));
        } else {
          dispatch(setSelectedStudyType('default'));
          dispatch({ type: 'setImageLayoutElementNumber/0', payload: parentValueNumber })

        }
      } else {
        if (selectedStudyType === 'default') {
          dispatch({ type: 'setImageLayoutElementNumber/0', payload: parentValueNumber })
        } else {
          dispatch(setComparisonImageLayoutElementNumber(parentValueNumber));
        }
      }
      if (parent !== null) {
        const value = cornerstone.getEnabledElement(parent);
        const slice = value.image?.imageId.split('dicom/');
        if (slice !== undefined) {
          url = slice[1];
        }
      }

      dispatch(setWadoElementInfoChange(url));
      const x = event.pageX + 'px';
      const y = event.pageY + 'px';
      dispatch(
        setContextMenuLocationChange({
          x: x,
          y: y,
        }),
      );
      dispatch(setViewerContextMenuBool(true));
    },
    [contextMenuLocation, selectedStudyType],
  );

  /**
   * 이미지 Element를 더블클릭 하였을때의 함수(1x1 || nxn)
   */
  const ElementDoubleClickButton = useCallback(
    (event: any) => {
      const currentNumber = Number(ImageViewerElement.current.classList.value.split(' ')[1].replace(/[^0-9]/g, ''));
      
      // if (firstImageLayoutDoubleClickBool) {
      //   // Array.from(document.querySelectorAll('.imageLayoutParentDiv')).map((v,i)=> {
      //   //   if (v.classList.value.includes('displayNone')) {
      //   //     v.classList.remove('displayNone');
      //   //   }
      //   // })
      //   dispatch(setImageLayoutDoubleClickBoolChange(!firstImageLayoutDoubleClickBool))
      //   dispatch(setImageLayoutElementNumberChange(currentNumber))
      // }else {
      //   // Array.from(document.querySelectorAll('.imageLayoutParentDiv')).map((v,i)=> {
      //   //   if (!(v.classList.value.includes('displayNone'))) {천호역 5호선
      //   //     v.classList.add('displayNone');
      //   //   }
      //   // })
      //   dispatch(setImageLayoutDoubleClickBoolChange(!firstImageLayoutDoubleClickBool))
      //   dispatch(setImageLayoutElementNumberChange(currentNumber))
      // }
      if (tool === 'TextMarker') {
        return;
      }
      if (selectedStudyType !== props.type) {
        if (props.type === 'default') {
          dispatch(setSelectedStudyType('default'));
        } else {
          dispatch(setSelectedStudyType('comparison'));
        }
      }
      if (props.type === 'default' && selectedStudyType === props.type) {
        dispatch({ type: 'setImageLayoutDoubleClickBool/0', payload: !firstImageLayoutDoubleClickBool })
        dispatch({ type: 'setImageLayoutElementNumber/0', payload: currentNumber })

      } else if (props.type === 'comparison' && selectedStudyType === props.type) {
        dispatch(setComparisonImageLayoutDoubleClickBool(!comparisonImageLayoutDoubleClickBool));
        dispatch(setComparisonImageLayoutElementNumber(currentNumber));
      }
    },
    [firstImageLayoutDoubleClickBool, selectedStudyType, comparisonImageLayoutDoubleClickBool, tool],
  );

  const [defaultFontClassName, setDefaultFontClassName] = useState('XLarge');
  const [comparisonFontClassName, setComparisonFontClassName] = useState('XLarge');

  useEffect(() => {
    if (props.type === 'default') {
      const seriesValue = firstImageLayout[0] * firstImageLayout[1];
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
  }, [firstImageLayout]);

  useEffect(() => {
    if (props.type === 'comparison') {
      const seriesValue = comparisonImageLayout[0] * comparisonImageLayout[1];
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
  }, [comparisonImageLayout]);
  return (
    <ImageLayoutWadoImageLoaderCss>
      <div
        ref={ImageViewerElement}
        style={{
          width: '100%',
          height: '100%',
          margin: 'auto',
          overflow: 'hidden',
          position: 'absolute',
        }}
        className={`imageLayoutElement ${props.type}${props.wadonumber} ${props.type}`}
        onClick={ElementClickButton}
        onDoubleClick={ElementDoubleClickButton}
        onContextMenu={onContextMenuClick}
        // onTouchStart={sessionStorage.getItem('mobile') === 'true' ? ElementClickButton : () => {}}
      >
        <div
          className={
            props.type === 'default' ? `topLeft ${defaultFontClassName}` : `topLeft ${comparisonFontClassName}`
          }
          ref={topLeftDiv}
        ></div>
        <div
          className={
            props.type === 'default' ? `topRight ${defaultFontClassName}` : `topRight ${comparisonFontClassName}`
          }
          ref={topRightDiv}
        ></div>
        <div
          className={
            props.type === 'default' ? `bottomLeft ${defaultFontClassName}` : `bottomLeft ${comparisonFontClassName}`
          }
          ref={bottomLeftDiv}
        ></div>
        <div
          className={
            props.type === 'default' ? `bottomRight ${defaultFontClassName}` : `bottomRight ${comparisonFontClassName}`
          }
          ref={bottomRightDiv}
        ></div>
        <div
          className={
            props.type === 'default'
              ? gspsBool && props.gspsBool
                ? `bottomCenter ${defaultFontClassName}`
                : `bottomCenter ${defaultFontClassName} displayNone`
              : gspsBool && props.gspsBool
              ? `bottomCenter ${comparisonFontClassName}`
              : `bottomCenter ${comparisonFontClassName} displayNone`
          }
          ref={bottomCenterDiv}
        ></div>
      </div>
    </ImageLayoutWadoImageLoaderCss>
  );
};

export default ImageLayoutWadoImageLoader;
