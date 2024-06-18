import cornerstoneTools from 'cornerstone-tools';
import { useTranslation } from 'react-i18next';


export function worklistColumnArr() {
    const { t } = useTranslation();
    /**
     * 유저 세팅 페이지를 위한 배열
     */
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
    return worklistColumnArray;
  }