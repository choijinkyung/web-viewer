import { useCallback, useState, useEffect } from 'react';
import React from 'react';
import { UserToolSettingCss, ModalCss } from './styled';
import {
  Box,
  Modal,
  Button,
  createTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Divider
} from '@mui/material';
import { ChromePicker } from 'react-color';
import InitCornerstone from '@components/InitCornerstone';
import UserToolManage from '../UserToolManage';
import PushPinIcon from '@mui/icons-material/PushPin';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Call } from '@utils/JwtHelper';
import DecryptAES256 from '@utils/DecryptAES256';
import { useTranslation } from 'react-i18next';
import UserToolTextAndFont from '../UserToolTextAndFont';
declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true; // removes the `xs` breakpoint
    sm: true;
    md: true;
    lg: true;
    xl: true;
    fullhd: true; // adds the `tablet` breakpoint
    laptop: true;
    desktop: true;
    fourk: true;
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      fourk: 1921,
      laptop: 361,
      fullhd: 1281,
      desktop: 641,
    },
  },
});
const UserToolSetting = () => {
  const call = new Call()
  const { t } = useTranslation();
  const [mouseColor, setMouseColor] = useState('');
  const [annotationColor, setAnnotationColor] = useState('');
  const [GSPSColor, setGSPSColor] = useState('');

  const [mouseColorModal, setMouseColorModal] = useState(false);
  const [annotationColorModal, setAnnotationColorModal] = useState(false);
  const [GSPSColorModal, setGSPSColorModal] = useState(false);
  const [tool,setTool] = useState()
  const [textData,setTextData] = useState()

  const [currentViewType,setCurrentViewType] = useState('color')

  const currentViewTypeChange = useCallback((value: any)=> {
    setCurrentViewType(value);
  },[])
  
  const handleMouseColorChange = useCallback(
    (color: string) => {
      setMouseColor(color);
    },
    [mouseColor],
  );
  const handleAnnotationColorChange = useCallback(
    (color: string) => {
      setAnnotationColor(color);
    },
    [annotationColor],
  );
  const handleGSPSColorChange = useCallback(
    (color: string) => {
      setGSPSColor(color);
    },
    [GSPSColor],
  );

  const saveMouseColor = useCallback(() => {
    // localStorage.setItem('mouseColor', mouseColor);
    handleCloseButton();
  }, [mouseColor]);
  const saveAnnotationColorColor = useCallback(() => {
    // localStorage.setItem('annotationColor', annotationColor);
    handleCloseButton();
  }, [annotationColor]);
  const saveGSPSColor = useCallback(() => {
    // localStorage.setItem('GSPSColor', GSPSColor);
    handleCloseButton();
  }, [GSPSColor]);

  const reloadButton = useCallback(() => {
    window.location.reload();
  }, []);
  const saveButton = useCallback(async()=> {
    const userID = JSON.parse(localStorage.getItem('user') as string).USERID;
    const form ={
      mouseColor,
      annotationColor,
      GSPSColor
    }
    try {
      await call.put('/api/v1/setting',{UserID:DecryptAES256(userID),colorSetting :JSON.stringify(form)},t('TID02712')).then((res)=> {
        alert(res);
      })
    }catch(error) {
      console.log (error)
    }
    sessionStorage.setItem('color',JSON.stringify({mouse:mouseColor,annotation:annotationColor,gsps:GSPSColor}))
    InitCornerstone();
  },[annotationColor,mouseColor,GSPSColor])

  const handleCloseButton = useCallback(() => {
    setMouseColorModal(false);
    setAnnotationColorModal(false);
    setGSPSColorModal(false);
  }, []);


  async function getSettingData () {
    const userID = JSON.parse(localStorage.getItem('user') as string).USERID;
    await call.get(`/api/v1/setting?UserID=${DecryptAES256(userID)}`).then(({data})=> {
      const color = JSON.parse(data.colorSetting);
      const tool = JSON.parse(data.toolSetting);
      const text = JSON.parse(data.TextSetting);
      setMouseColor(color.mouseColor);
      setAnnotationColor(color.annotationColor);
      setGSPSColor(color.GSPSColor);
      setTool(tool)
      setTextData(text)
      sessionStorage.setItem('color',JSON.stringify({mouse:color.mouseColor,annotation:color.annotationColor,gsps:color.GSPSColor}))
    })
  }
  useEffect(()=> {
    getSettingData()
  },[])

  function ModalLogic(color: any, state: any, onChangeFunction: any, saveFunction: any, closeFunction: any) {
    return (
      <Modal
        open={state}
        onClose={closeFunction}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalCss>
          <ChromePicker color={color} onChange={(color: any) => onChangeFunction(color.hex)} />
          <Box className="button">
            <button onClick={saveFunction}>{t('TID02813')}</button>
            <button onClick={closeFunction}>{t('TID00052')}</button>
          </Box>
        </ModalCss>
      </Modal>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <UserToolSettingCss>
        {/* {ModalLogic(mouseColor, mouseColorModal, handleMouseColorChange, saveMouseColor, handleCloseButton)} */}
        {ModalLogic(
          annotationColor,
          annotationColorModal,
          handleAnnotationColorChange,
          saveAnnotationColorColor,
          handleCloseButton,
          )}
        {/* {ModalLogic(GSPSColor, GSPSColorModal, handleGSPSColorChange, saveGSPSColor, handleCloseButton)} */}
       
          <Box className="toolBox" component={Paper}>
            <Box className='choiceBox'>
            {/* <span onClick={()=>currentViewTypeChange('tool')} className={currentViewType ==='tool' ? 'active' : ''}>Tool</span>   */}
            <span onClick={()=>currentViewTypeChange('color')}className={currentViewType ==='color' ? 'active' : ''} >Color</span>  
            {/* <span onClick={()=>currentViewTypeChange('text')} className={currentViewType ==='text' ? 'active' : ''}>Text</span>   */}
            <Divider
              sx={{ bgcolor: "#a00000", borderBottomWidth: '2px' }}
            />
            </Box>
            {/* {currentViewType ==='tool' && tool !==undefined &&<UserToolManage className="toolManageBox" toolState={tool}/>
            } */}
            {currentViewType ==='color' && (
              <>
            <TableContainer className="tablewrapper" component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: '33%' }}>
                      {t('TID01074')}
                    </TableCell>
                    <TableCell align="center" sx={{ width: '33%' }}>
                      {t('TID01847')}
                    </TableCell>
                    <TableCell align="center" sx={{ width: '33%' }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* <TableRow>
                    <TableCell align="center">{t('TID03103')} {t('TID01847')}</TableCell>
                    <TableCell align="center">
                      <Box
                        style={{
                          margin: 'auto',
                          width: '24px',
                          height: '24px',
                          background: `${mouseColor}`,
                          border: 'solid 1px #000',
                        }}
                        />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        sx={{color: 'white'}} 
                        onClick={() => setMouseColorModal(true)} 
                        >
                        {t('TID02979')}
                      </Button>
                    </TableCell>
                  </TableRow> */}
                  <TableRow>
                    <TableCell align="center">{t('TID01840')} {t('TID01847')}</TableCell>
                    <TableCell align="center">
                      <Box
                        style={{
                          margin: 'auto',
                          width: '24px',
                          height: '24px',
                          background: `${annotationColor}`,
                          border: 'solid 1px #000',
                        }}
                        />
                    </TableCell>
                    <TableCell align="center">
                      <Button sx={{color: 'white'}} onClick={() => setAnnotationColorModal(true)}>{t('TID02979')}</Button>
                    </TableCell>
                  </TableRow>
                  {/* <TableRow>
                    <TableCell align="center">GSPS {t('TID01847')}</TableCell>
                    <TableCell align="center">
                      <div
                        style={{
                          margin: 'auto',
                          width: '24px',
                          height: '24px',
                          background: `${GSPSColor}`,
                          border: 'solid 1px #000',
                        }}
                        />
                    </TableCell>
                    <TableCell align="center">
                      <Button sx={{color: 'white'}} onClick={() => setGSPSColorModal(true)}>{t('TID02979')}</Button>
                    </TableCell>
                  </TableRow> */}
                </TableBody>
              </Table>
            </TableContainer>
            <Box className="buttonBox">
              <Button 
                sx={{
                  borderRadius: '15px',
                  color: 'white',
                  bgcolor: '#000000',
                  marginRight: {
                    fourk : '20px',
                    fullhd : '20px',
                    desktop : '10px',
                  },
                  marginBottom: {
                    fourk: '10px',
                    fullhd : '10px',
                    desktop: '5px',
                  },
                  width: '120px',
                  height: '28px',
                  size: 'small',
                  fontSize: '11px',
                }}
                onClick={saveButton}
                ><p style={{
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('TID01543')}</p>
                <PushPinIcon sx={{color : '#a00000', fontSize: '20px', ml: '5px'}} />
              </Button>
              <Button 
                sx={{
                  borderRadius: '15px',
                  color: 'white',
                  bgcolor: '#000000',
                  marginRight: {
                    fourk : '20px',
                    fullhd : '20px',
                    desktop : '10px',
                  },
                  marginBottom: {
                    fourk: '10px',
                    fullhd : '10px',
                    desktop: '5px',
                  },
                  width: '120px',
                  height: '28px',
                  size: 'small',
                  fontSize: '11px',
                }}
                onClick={reloadButton}
                ><p style={{
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                >
                {t('TID00048')}
              </p>
                <CancelOutlinedIcon sx={{color : '#a00000', fontSize: '20px', ml: '5px'}} />
              </Button>
            </Box>
            </>
            )}
            {/* {currentViewType ==='text' && textData !==undefined &&<UserToolTextAndFont textState={textData}/>} */}
          </Box>
      </UserToolSettingCss>
    </ThemeProvider>
  );
};
export default UserToolSetting;
