import React, { useRef, useCallback, useEffect, useState } from 'react';
import cornerstone from 'cornerstone-core';
import { imageURLIndex } from '@typings/etcType';
import { ThumbnailCss } from './styles';
import { useSelector, useDispatch } from 'react-redux';
import cornerstoneTools from 'cornerstone-tools';
import { ToolChain } from '@components/Viewer/ArrChain';
import { debounce } from 'lodash';
import { RootState } from '@store/index';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Thumbnail = (props: imageURLIndex) => {
  const {t} = useTranslation();
  const ThumbnailElement = useRef() as React.MutableRefObject<HTMLDivElement>;
  const { thumbnailBoxBool } = useSelector((state: RootState) => state.setting.setting);
  const { tool } = useSelector((state: RootState) => state.tool.toolbar);
  const [windowSize, setWindowSize] = useState({
    width: Math.floor(window.innerWidth * 0.11),
    height: Math.floor(window.innerHeight * 0.11),
  });
  const [description,setDescription] = useState('');
  const [imageNotFound,setImgaeNotFound] = useState(false);

  const loadAndViewImage = useCallback(async (imageId: string) => {
    const element = ThumbnailElement.current;
    cornerstone.disable(element);
    cornerstone.enable(element);
    let image :any = await cornerstone.loadImage(imageId[0]).catch((error)=> {
      return;
    });
    if (image === undefined) {
      return false;
    }

    const {data} = image;
    const decoder = new TextDecoder();
    const description = data.elements.x0008103e;
    if (description !== undefined) {
      const description1 = new Uint16Array(image.data.byteArray.buffer, description.dataOffset, description.length / 2);
      const description2 = decoder.decode(description1);
      setDescription(description2)
    }else {
      const decode = decodeURIComponent(escape(image.data.string('x0008103e')));
      if (decode !== undefined && decode !== null && decode !== 'undefined' && decode !== null) {
        setDescription(decodeURIComponent(escape(image.data.string('x0008103e'))))
      }else {
        setDescription('N/A')
      }
    }
    try {
      if (image.data.string('x60003000') !== undefined) {
        cornerstoneTools.addToolForElement(element,cornerstoneTools.OverlayTool)
        cornerstoneTools.setToolActive("Overlay",{})
      }
      cornerstone.displayImage(element, image);
      image = null;
    } catch (err) {
      console.log(err);
    }
    return true
  }, []);
  const handleResize = debounce(() => {
    setWindowSize({
      width: Math.floor(window.innerWidth * 0.12),
      height: Math.floor(window.innerHeight * 0.11),
    });
  }, 300);
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const element = ThumbnailElement.current;
    if (props.imageURLIndex.length) {
      let imageNotFound :any = setInterval(()=> {
        setImgaeNotFound(true)
        clearInterval(imageNotFound)
      },1000)
      loadAndViewImage(props.imageURLIndex).then((data) => {
        if (data)  {
          cornerstone.reset(element);
          clearInterval(imageNotFound)
          setImgaeNotFound(false)
        }
      });
    }
    return () => {
      cornerstone.disable(element);
      // cornerstone.imageCache.purgeCache();
    };
  }, [props.imageURLIndex]);
  useEffect(() => {
    const element = ThumbnailElement.current;
    const currentToolIndex = ToolChain.findIndex((e) => e.tool === tool);
    if (currentToolIndex > -1 && props.imageURLIndex.length) {
      // cornerstoneTools.removeToolForElement(element, ToolChain[currentToolIndex].name);
      // cornerstoneTools.removeTool(ToolChain[currentToolIndex].name);
      // cornerstoneTools.removeToolState(element, ToolChain[currentToolIndex].name);
    }
  }, [tool]);

  useEffect(() => {
    if (props.imageURLIndex.length) {
      const element = ThumbnailElement.current;
      cornerstone.resize(element);
      cornerstone.updateImage(element,true)
    }
  }, [thumbnailBoxBool, windowSize,props.imageURLIndex]);
  const dropEnter = useCallback((event:any)=> {
    for (const img of props.imageURLIndex) {
      cornerstone.loadAndCacheImage(img);
    }
    event.dataTransfer.setData('items',props.imageURLIndex)
  },[props])

  return (
    <ThumbnailCss
    onDragStart={dropEnter}
    draggable={true}
    >
      <Box style={{
        margin:"0",
        padding:'0',
        width: '100%',
        height:'100%',
        // overflow:'hidden',
        position:'absolute',
        zIndex: '1000',
      }}>
          {t('TID02361')} : {props.ThunmnailNumber}<br/>
      </Box>
        <Box
          ref={ThumbnailElement}
          className="thumbnail"
          // style={{ width: `${windowSize.width}`, height: `${windowSize.height}`, overflow: 'auto' }}
          style={{
            width:  '100%',
            height: '100%',
            margin: '0 auto',
            position: 'absolute',
            // zIndex: '9999',
          }}
        >
          {imageNotFound && (
          <img className='image' src={require('@assets/imageNotFound.png').default}/>
         )}
      </Box>
    </ThumbnailCss>
  );
};

export default Thumbnail;
