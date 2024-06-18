import React,{ useCallback, useState, useEffect } from "react";
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
  } from '@mui/material';
import { UserToolTextAndFontCss,ModalCss } from "./styled";
import PushPinIcon from '@mui/icons-material/PushPin';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Call } from '@utils/JwtHelper';
import { useTranslation } from 'react-i18next';
import DecryptAES256 from "@utils/DecryptAES256";

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

const UserToolTextAndFont = (props:any)=> {
    const call = new Call()
    const { t } = useTranslation();

    const [annotationFont,setAnnotationFont] = useState('');
    const [overlayFont,setOverlayFont] = useState('');
    const [textMarker,setTextMarker] = useState<any>('');

    const [annotationFontModal,setAnnotationModal] = useState(false);
    const [overlayFontModal,setOverlayFontModal] = useState(false);
    const [textMarkerModal,setTextMarkerModal] = useState(false);

    const [annotationFontDataStorage,setAnnotationFontDataStorage]  = useState('');
    const [overlayFontDataStorage,setOverlayFontDataStorage]  = useState('');
    const [textMarkerDataStorage,setTextMarkerDataStoarge]  = useState({
        1:'',
        2:'',
        3:'',
        4:'',
        5:''
    });


    const handleCloseButton = useCallback(() => {
        setTextMarkerModal(false);
        setOverlayFontModal(false);
        setAnnotationModal(false);
      }, []);

    const annotationFontChange = useCallback(()=> {
        setAnnotationFont(annotationFontDataStorage)
        setAnnotationModal(false);
    },[annotationFontDataStorage])
    
    const overlayFontChange = useCallback(()=> {
        setOverlayFont(overlayFontDataStorage)
        setOverlayFontModal(false);
    },[overlayFontDataStorage])

    const textMarkerChnage = useCallback(()=> {
        setTextMarker(textMarkerDataStorage)
        setTextMarkerModal(false);
    },[textMarkerDataStorage])

    const reloadButton = useCallback(() => {
      window.location.reload();
    }, []);

    const saveButton = useCallback(async()=> {
      const userID = JSON.parse(localStorage.getItem('user') as string).USERID;
      const form ={
        annotation : annotationFont,
        overlay :overlayFont,
        textMarker: textMarker
      }
      try {
        await call.put('/api/v1/setting',{UserID:DecryptAES256(userID),textSetting :JSON.stringify(form)},t('TID02712')).then((res)=> {
          alert(res);
        })
      }catch(error) {
        console.log (error)
      }
    },[annotationFont,overlayFont,textMarker])

    function ModalLogic(title:any,state: any, saveFunction: any, closeFunction: any,type :any,defaultValue:any,inputChnage:any) {
        return (
          <Modal
            open={state}
            onClose={closeFunction}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <ModalCss>
                <Box className="title">
                    <h2>{title}</h2>
                </Box>
            {type ==='textMarker' ? (
                <Box className="input">
                    <input defaultValue={textMarker['1']} onChange={(event:any)=> inputChnage({...textMarkerDataStorage,1:event.target.value})}/>
                    <input defaultValue={textMarker['2']}onChange={(event:any)=> inputChnage({...textMarkerDataStorage,2:event.target.value})}/>
                    <input defaultValue={textMarker['3']}onChange={(event:any)=> inputChnage({...textMarkerDataStorage,3:event.target.value})}/>
                    <input defaultValue={textMarker['4']}onChange={(event:any)=> inputChnage({...textMarkerDataStorage,4:event.target.value})}/>
                    <input defaultValue={textMarker['5']}onChange={(event:any)=> inputChnage({...textMarkerDataStorage,5:event.target.value})}/>
                </Box>
            ): (
                <Box className="input">
                  <input type="number" min={1} max={200} defaultValue={defaultValue} onChange={(event:any)=>inputChnage(event.target.value)} />
                </Box>
            )}
              <Box className="button">
                <Button onClick={saveFunction}>{t('TID02813')}</Button>
                <Button onClick={closeFunction}>{t('TID00052')}</Button>
              </Box>
            </ModalCss>
          </Modal>
        );
    }

    useEffect(()=> {
      const a = props.textState;
        setAnnotationFont(a.annotation);
        setAnnotationFontDataStorage(a.annotation);
        setOverlayFont(a.overlay);
        setOverlayFontDataStorage(a.overlay);
        setTextMarker(a.textMarker);
        setTextMarkerDataStoarge(a.textMarker);
        sessionStorage.setItem('text',JSON.stringify({annotation:a.annotation,overlay:a.overlay,textMarker:a.textMarker}));
    },[props.textState])


    
  return (
      <ThemeProvider theme={theme}>
            <UserToolTextAndFontCss>
          {ModalLogic('Annotation Font Modify',annotationFontModal,annotationFontChange,handleCloseButton,'annotation',annotationFont,setAnnotationFontDataStorage)}
          {ModalLogic('Overlay Font Modify',overlayFontModal,overlayFontChange,handleCloseButton,'overlay',overlayFont,setOverlayFontDataStorage)}
          {ModalLogic('Text Marker Modify',textMarkerModal,textMarkerChnage,handleCloseButton,'textMarker',textMarker,setTextMarkerDataStoarge)}
          <Box className="toolBox" component={Paper}>            
            <TableContainer className="tablewrapper" component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: '20%' }}>
                      {t('TID01074')}
                    </TableCell>
                    <TableCell align="center" sx={{ width: '45%' }}>
                    {t('TID03149')}
                    </TableCell>
                    <TableCell align="center" sx={{ width: '10%' }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">Annotation Font Size</TableCell>
                    <TableCell align="center">
                        {`${annotationFont} px`}
                    </TableCell>
                    <TableCell align="center">
                    <Button
                        sx={{color: 'white'}} 
                        onClick={()=>setAnnotationModal(!annotationFontModal)}
                      >
                        {t('TID02979')}
                        
                      </Button>
                    </TableCell>
                  </TableRow>
                  {/* <TableRow>
                    <TableCell align="center">오버레이 폰트크기</TableCell>
                    <TableCell align="center">
                        {`${overlayFont} px`}
                    </TableCell>
                    <TableCell align="center">
                    <Button
                        sx={{color: 'white'}} 
                        onClick={()=>setOverlayFontModal(!overlayFontModal)}
                      >
                        {t('TID02979')}
                      </Button>
                    </TableCell>
                  </TableRow> */}
                  <TableRow>
                    <TableCell align="center">TextMarker Setting</TableCell>
                    <TableCell align="center">
                        {/* {JSON.stringify(textMarker)}; */}
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Contents</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.keys(textMarker).map((v:any,i:number)=> {
                                        return (
                                            <TableRow key={i}>
                                                <TableCell align="center">{textMarker[v]}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
       
                    </TableCell>
                    <TableCell align="center">
                    <Button
                        sx={{color: 'white'}} 
                        onClick={()=>setTextMarkerModal(!textMarkerModal)}
                      >
                        {t('TID02979')}
                      </Button>
                    </TableCell>
                  </TableRow>
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
          </Box>
      
        </UserToolTextAndFontCss>
    </ThemeProvider>  
  );
}
export default UserToolTextAndFont;