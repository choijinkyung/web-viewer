import React, { useCallback, useState, useEffect } from 'react';
import {
  Box,
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
  Collapse,
} from '@mui/material';
import { UserToolManageCss } from './styled';
import {  ToolChainArray } from '@components/Viewer/ArrChain';
import Switch from '@mui/material/Switch';
import { Call } from '@utils/JwtHelper';
import DecryptAES256 from '@utils/DecryptAES256';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import PushPinIcon from '@mui/icons-material/PushPin';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { alpha, styled } from '@mui/material/styles';
import { pink,red } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';
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

const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: red[600],
    '&:hover': {
      backgroundColor: alpha(red[600], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: red[600],
  },
}));

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

// 각 도구에 대한 인터페이스 정의
interface ITool {
  name: string;
  tool: string;
  desc: string;
  src: string;
}

// 도구들의 상태를 위한 인터페이스
interface IToolsState {
  [key: string]: boolean;
}

const UserToolManage = (props: any) => {
  const call = new Call();
  const { t } = useTranslation();
  const [tools, setTools] = useState<any>(props.toolState);
  const [collapseBool, setCollapseBool] = useState<any>({
    tools: false,
    annotation: false,
    reset: false,
  });


  const saveButton = useCallback(async () => {
    const userID = JSON.parse(localStorage.getItem('user') as string).USERID;
    const tool = JSON.stringify(tools);
    try {
      await call
        .put('/api/v1/setting', { UserID: DecryptAES256(userID), toolSetting: tool }, t('TID02712'))
        .then((res) => {
          alert(res);
        });
    } catch (error) {
      console.log(error);
      return;
    }
  }, [tools]);

  const reloadButton = useCallback(() => {
    window.location.reload();
  }, []);


  const handleToggle = (path: string) => {
    setTools((prev:any) => {
      const keys = path.split('.');
      const rootKey = keys[0];
      
      if (keys.length === 1 && path.endsWith('Bool')) {
        const newState = !prev[path];
        const sectionKey = path.replace('Bool', ''); 
        const updatedSection = Object.fromEntries(
          Object.entries(prev[sectionKey]).map(([key, value]) => [key, newState])
        );
  
        return {
          ...prev,
          [path]: newState,
          [sectionKey]: updatedSection,
        };
      }
  
      const updatedTools = { ...prev };
      let subItem = updatedTools;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          subItem[key] = !subItem[key];
          const allFalse = Object.values(subItem).every((val) => val === false);
          updatedTools[`${rootKey}Bool`] = !allFalse;
        } else {
          if (!subItem[key]) subItem[key] = {};
          subItem = subItem[key];
        }
      });
  
      return updatedTools;
    });
  };
  
  return (
    <ThemeProvider theme={theme}>
      <UserToolManageCss className='toolManageBox'>        
        <TableContainer className="tablewrapper" component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ width: '2%' }}></TableCell>
                <TableCell align="center" sx={{ width: '15%' }}>
                {t('TID01074')}
                </TableCell>
                <TableCell align="center" sx={{ width: '75%' }}>
                {t('TID02056')}
                </TableCell>
                <TableCell align="center" sx={{ width: '5%' }}></TableCell>
              </TableRow>
            </TableHead>
            {ToolChainArray().map((v: any, i: number) => {
              if (v.tool === 'tools' || v.tool === 'annotation' || v.tool === 'reset') {
                return (
                  <TableBody key={i}>
                    <TableRow>
                      <TableCell align='center' onClick={() => setCollapseBool({ ...collapseBool, [v.tool]: !collapseBool[v.tool] })}>
                        {collapseBool[v.tool] ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                      </TableCell>
                      <TableCell align='left'>
                        <img
                          src={require(`@assets/icons/${v.src}`).default}
                          style={{ verticalAlign: 'bottom', marginLeft:'20px' }}
                        />
                        <span style={{marginLeft :'20px', lineHeight: '24px'}}>{v.name}</span>
                      </TableCell>
                      <TableCell><span style={{marginLeft :'20px'}}>{v.desc}</span></TableCell>
                      <TableCell align='center'>
                        <Switch checked={tools[v.bool]} onChange={() => handleToggle(v.bool)} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Collapse in={collapseBool[v.tool]}>
                          <TableContainer className="innerTable" component={Paper}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell align="center" sx={{ width: '15%' }}>
                                    {t('TID01074')}
                                  </TableCell>
                                  <TableCell align="center" sx={{ width: '75%' }}>
                                    {t('TID02056')}
                                  </TableCell>
                                  <TableCell align="center" sx={{ width: '5%' }}></TableCell>
                                </TableRow>
                              </TableHead>
                              {v.modalTools.map((value: any, j: number) => {
                                const toolPath = `${v.tool}.${value.tool}`;
                                return (
                                  <TableBody key={j}>
                                    <TableRow>
                                      <TableCell>
                                        <img
                                          src={require(`@assets/icons/${value.src}`).default}
                                          style={{ verticalAlign: 'bottom', marginLeft:'20px' }}
                                        />
                                        <span style={{marginLeft :'20px', lineHeight: '24px'}}>{value.name}</span>
                                      </TableCell>
                                      <TableCell >
                                        <span style={{marginLeft :'20px'}}>{value.desc}</span>
                                      </TableCell>
                                      <TableCell align='center'>
                                        <Switch
                                          checked={tools[v.tool] && tools[v.tool][value.tool]}
                                          onChange={() => handleToggle(toolPath)}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                );
                              })}
                            </Table>
                          </TableContainer>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                );
              } else {
                return (
                  <TableBody key={i}>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>
                        <img
                          src={require(`@assets/icons/${v.src}`).default}
                          style={{ marginLeft:'20px', verticalAlign: 'bottom' }}
                        />
                        <p style={{marginLeft :'20px', display:'inline-block'}}>{v.name}</p>
                      </TableCell>
                      <TableCell>
                        <span style={{marginLeft :'20px'}}>{v.desc}</span>
                      </TableCell>
                      <TableCell align='center'>
                        <Switch checked={tools[v.tool]} onChange={() => handleToggle(v.tool)} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                );
              }
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
        ><p style={{
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          }}
        >
          {t('TID01543')}</p>
          <PushPinIcon sx={{ color: '#a00000', fontSize: '20px', ml: '5px' }} />
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
          {t('TID00048')}</p>
          <CancelOutlinedIcon sx={{ color: '#a00000', fontSize: '20px', ml: '5px'}} />
        </Button>
        </Box>
      </UserToolManageCss>
    </ThemeProvider>
  );
};
export default UserToolManage;
