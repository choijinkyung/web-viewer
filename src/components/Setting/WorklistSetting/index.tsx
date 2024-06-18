import React, { useCallback, useState, useEffect } from 'react';
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
  Switch,
} from '@mui/material';
import { WorklistSettingCss } from './styled';
import { Call } from '@utils/JwtHelper';
import DecryptAES256 from '@utils/DecryptAES256';
import { useTranslation } from 'react-i18next';
import PushPinIcon from '@mui/icons-material/PushPin';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
// import { worklistColumnArr } from '@components/Worklist/WorklistChain';
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
const WorklistSetting = () => {
    const call = new Call()
    const { t } = useTranslation();
    const [worklistSetting,setWorklistSetting] = useState<any>()


  const saveButton = useCallback(async()=> {
    const userID = JSON.parse(localStorage.getItem('user') as string).USERID;
    try {
      await call.put('/api/v1/setting',{UserID:DecryptAES256(userID),worklistSetting :JSON.stringify(worklistSetting)},t('TID02712')).then((res)=> {
        alert(res);
      })
    }catch(error) {
      console.log (error)
    }
  },[worklistSetting])

  
  const reloadButton = useCallback(() => {
    window.location.reload();
  }, []);



  async function getSettingData () {
    const userID = JSON.parse(localStorage.getItem('user') as string).USERID;
    await call.get(`/api/v1/setting?UserID=${DecryptAES256(userID)}`).then(({data})=> {
      const worklistData  = JSON.parse(data.worklistSetting);
      setWorklistSetting(worklistData)
    })
  }
  useEffect(()=> {
    getSettingData()
  },[])

  const handleToggle = useCallback((columnKey: string) => {
    setWorklistSetting((prevColumns: any) => ({
      ...prevColumns,
      [columnKey]: !prevColumns[columnKey],
    }));
  }, []);
  
  const worklistColumnArray = [
    { name: t('TID02821'), desc: t('TID02821'), column: 'pID' },
    { name: t('TID02738'), desc: t('TID02738'), column: 'pName' },
    { name: t('TID00031'), desc: t('TID03091'), column: 'modality' },
    { name: t('TID00045'), desc: t('TID00045'), column: 'studyDesc' },
    { name: t('TID00032'), desc: t('TID03083'), column: 'studyDate' },
    { name: t('TID00033'), desc: t('TID03084'), column: 'ReportStatus' },
    { name: t('TID00034'), desc: t('TID03085'), column: 'seriesCnt' },
    { name: t('TID00035'), desc: t('TID03086'), column: 'imageCnt' },
    { name: t('TID02825'), desc: t('TID03087'), column: 'VerifyFlag' },
    { name: t('TID02481'), desc: t('TID03088'), column: 'pSex' },
    { name: t('TID03081'), desc: t('TID03089'), column: 'PatAge' },
    { name: t('TID02955'), desc: t('TID03090'), column: 'RefPhysicianName' },
    { name: t('TID03082'), desc: t('TID03082'), column: 'InsName' },
    { name: t('TID03075'), desc: t('TID03092'), column: 'AI_Company' },
    { name: t('TID03076'), desc: t('TID03093'), column: 'AI_Model_Name' },
    { name: t('TID02995'), desc: t('TID03094'), column: 'AI_Score' },
    { name: t('TID03077'), desc: t('TID03095'), column: 'AI_Priority' },
    { name: t('TID03078'), desc: t('TID03096'), column: 'AI_Number_Of_Findings' },
    { name: t('TID03079'), desc: t('TID03097'), column: 'AI_Abnormal_YN' },
    { name: t('TID03080'), desc: t('TID03098'), column: 'AI_Finding' },
  ];
  return (
    <ThemeProvider theme={theme}>
      <WorklistSettingCss>
            {worklistSetting !== null && worklistSetting !== undefined && (
          <Box className="worklistToolBox" component={Paper}>            
            <TableContainer className="tablewrapper" component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: '20%' }}>
                      {t('TID01074')}
                    </TableCell>
                    <TableCell align="center" sx={{ width: '75%' }}>
                      {t('TID02056')}
                    </TableCell>
                    <TableCell align="center" sx={{ width: '5%' }}></TableCell>
                  </TableRow>
                </TableHead>
                {worklistSetting !== undefined && worklistColumnArray.map((v: any, i: number) => {
                  return (
                    <TableBody key={i}>
                      <TableRow>
                        <TableCell><span style={{marginLeft :'20px',}}>{v.name}</span></TableCell>
                        <TableCell><span style={{marginLeft :'20px',}}>{v.desc}</span></TableCell>
                        <TableCell align='center'>
                          <Switch checked={worklistSetting[v.column]} onChange={() => handleToggle(v.column)} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )
                })}
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
              > 
                <p style={{
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  }}
                >
                  {t('TID02863')}
                </p>
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
              > 
                <p style={{
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
          )}                           
      </WorklistSettingCss>
    </ThemeProvider>
  );
};
export default WorklistSetting;
