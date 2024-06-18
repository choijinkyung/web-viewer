import React, { useCallback, useEffect } from 'react';
import { DicomHeaderModalCss } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { setDicomHeaderModalBool } from '@store/modal';
import { dicomHeaderInfo } from '@typings/etcType';
import Modal from '@mui/material/Modal';
import { RootState } from '@store/index';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const DicomHeaderModal = (props: any) => {
  const dispatch = useDispatch();
  const {t} = useTranslation()
  const { dicomHeaderModalBool} = useSelector((state:RootState)=> state.modal.modal)
  const closeHeaderModalButton = useCallback(() => {
    dispatch(setDicomHeaderModalBool(false));
  }, []);
  return (
    <Modal
      open={dicomHeaderModalBool}
      onClose={closeHeaderModalButton}
    >
    <DicomHeaderModalCss>
      <h3>DICOM Header Info</h3>
      <Box>
        {props.dicomInfo !== null && (
          <>
            <p>DICOM Image Information</p>
            <p>DiCom ImgaNumber : {props.dicomInfo.string('x00200013')}</p>
            <p>
              Photometric : {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00280004')}
            </p>
            <p>DICOM Image Information</p>
            <p>
              Photometric : {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00280004')}
            </p>
            <p>
              SamplesPerPixel : {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280002')}
            </p>
            <p>
              Row : {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280010')}
            </p>
            <p>
              Column : {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280011')}
            </p>
            <p>
              Bits Allocated : {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280100')}
            </p>
            <p>
              Bits Stored : {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280101')}
            </p>
            <p>
              HighBit : {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280102')}
            </p>
            <p>
              Pixel Representation : {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280103')}
            </p>
            <p>
              Smallest Image PixelValue : {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280106')}
            </p>
            <p>
              Largest ImagePixel Value : {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280107')}
            </p>
            <p>
              Number Of Frames : {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00280008')}
            </p>
            <br />
            <p>DICOM Tag Information</p>
            <pre>
              0002:0000 File Meta Information Group Length{' '}
              {props.dicomInfo.elements.x00020000 == undefined ? '' : props.dicomInfo.elements.x00020000.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00020000')}
            </pre>
            <pre>
              0002:0002 Media Storage SOP Class UID{' '}
              {props.dicomInfo.elements.x00020002 == undefined ? '' : props.dicomInfo.elements.x00020002.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00020002')}
            </pre>
            <pre>
              0002:0010 Transfer Syntax UID{' '}
              {Object.keys(props.dicomInfo.elements).length === 0 ? '' : props.dicomInfo.elements.x00020010.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00020010')}
            </pre>
            <pre>
              0008:0005 Specific Characer Set{' '}
              {props.dicomInfo.elements.x00080005 == undefined ? '' : props.dicomInfo.elements.x00080005.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080005')}
            </pre>
            <pre>
              0008:0008 Image Type{' '}
              {props.dicomInfo.elements.x00080008 == undefined ? '' : props.dicomInfo.elements.x00080008.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080008')}
            </pre>
            <pre>
              0008:0016 SOP Class UID{' '}
              {props.dicomInfo.elements.x00080016 == undefined ? '' : props.dicomInfo.elements.x00080016.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080016')}
            </pre>
            <pre>
              0008:0018 SOP Instace UID{' '}
              {props.dicomInfo.elements.x00080018 == undefined ? '' : props.dicomInfo.elements.x00080018.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080018')}
            </pre>
            <pre>
              0008:0020 Study Date{' '}
              {props.dicomInfo.elements.x00080020 == undefined ? '' : props.dicomInfo.elements.x00080020.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080020')}
            </pre>
            <pre>
              0008:0021 Series Date{' '}
              {props.dicomInfo.elements.x00080021 == undefined ? '' : props.dicomInfo.elements.x00080021.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080021')}
            </pre>
            <pre>
              0008:0022 Acquisition Date{' '}
              {props.dicomInfo.elements.x00080022 == undefined ? '' : props.dicomInfo.elements.x00080022.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080022')}
            </pre>
            <pre>
              0008:0023 Content Date{' '}
              {props.dicomInfo.elements.x00080023 == undefined ? '' : props.dicomInfo.elements.x00080023.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080023')}
            </pre>

            <pre>
              0008:0030 Study Time{' '}
              {props.dicomInfo.elements.x00080030 == undefined ? '' : props.dicomInfo.elements.x00080030.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080030')}
            </pre>
            <pre>
              0008:0031 Series Time{' '}
              {props.dicomInfo.elements.x00080031 == undefined ? '' : props.dicomInfo.elements.x00080031.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080031')}
            </pre>
            <pre>
              0008:0032 Acquisition Time{' '}
              {props.dicomInfo.elements.x00080032 == undefined ? '' : props.dicomInfo.elements.x00080032.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080032')}
            </pre>
            <pre>
              0008:0033 Content Time{' '}
              {props.dicomInfo.elements.x00080033 == undefined ? '' : props.dicomInfo.elements.x00080033.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080033')}
            </pre>
            <pre>
              0008:0050 Accession Number{' '}
              {props.dicomInfo.elements.x00080050 == undefined ? '' : props.dicomInfo.elements.x00080050.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080050')}
            </pre>
            <pre>
              0008:0060 Modality{' '}
              {props.dicomInfo.elements.x00080060 == undefined ? '' : props.dicomInfo.elements.x00080060.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080060')}
            </pre>
            <pre>
              0008:0068 Presentation Intent Type{' '}
              {props.dicomInfo.elements.x00080068 == undefined ? '' : props.dicomInfo.elements.x00080068.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080068')}
            </pre>
            <pre>
              0008:0070 Manufacturer{' '}
              {props.dicomInfo.elements.x00080070 == undefined ? '' : props.dicomInfo.elements.x00080070.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080070')}
            </pre>
            <pre>
              0008:0080 Institution Name{' '}
              {props.dicomInfo.elements.x00080080 == undefined ? '' : props.dicomInfo.elements.x00080080.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080080')}
            </pre>
            <pre>
              0008:0081 Institution Address{' '}
              {props.dicomInfo.elements.x00080081 == undefined ? '' : props.dicomInfo.elements.x00080081.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080081')}
            </pre>
            <pre>
              0008:0090 Referring Physician's Name{' '}
              {props.dicomInfo.elements.x00080090 == undefined ? '' : props.dicomInfo.elements.x00080090.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00080090')}
            </pre>
            <pre>
              0008:1010 Station Name{' '}
              {props.dicomInfo.elements.x00081010 == undefined ? '' : props.dicomInfo.elements.x00081010.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00081010')}
            </pre>
            <pre>
              0008:1030 Study Description{' '}
              {props.dicomInfo.elements.x00081030 == undefined ? '' : props.dicomInfo.elements.x00081030.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00081030')}
            </pre>
            <pre>
              0008:1040 Institutional Department Name{' '}
              {props.dicomInfo.elements.x00081040 == undefined ? '' : props.dicomInfo.elements.x00081040.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00081040')}
            </pre>
            <pre>
              0008:1050 Performing Physician Name{' '}
              {props.dicomInfo.elements.x00081050 == undefined ? '' : props.dicomInfo.elements.x00081050.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00081050')}
            </pre>
            <pre>
              0008:1070 Operator's Name{' '}
              {props.dicomInfo.elements.x00081070 == undefined ? '' : props.dicomInfo.elements.x00081070.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00081070')}
            </pre>
            <pre>
              0008:1084 Admitting Diagnoses Code Sequence{' '}
              {props.dicomInfo.elements.x00081084 == undefined ? '' : props.dicomInfo.elements.x00081084.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00081084')}
            </pre>
            <pre>
              0008:1090 Manufacturer's Model Name{' '}
              {props.dicomInfo.elements.x00081090 == undefined ? '' : props.dicomInfo.elements.x00081090.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00081090')}
            </pre>
            <pre>
              0008:1110 Referenced Study Sequence{' '}
              {props.dicomInfo.elements.x00081110 == undefined ? '' : props.dicomInfo.elements.x00081110.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00081110')}
            </pre>
            {/* <!-- <pre>
0008:1150 Referenced SOP Class UID        {
              props.dicomInfo.elements.x00081150 == undefined
                ? ""
                : props.dicomInfo.elements.x00081150.vr
            }
           {
              props.dicomInfo.string("x00081150") == undefined
                ? "NULL"
                : props.dicomInfo.string("x00081150")
            }
           </pre
          >
          <pre>
0008:1155 Referenced SOP Instance UID        {
              props.dicomInfo.elements.x00081155 == undefined
                ? ""
                : props.dicomInfo.elements.x00081155.vr
            }
           {
              props.dicomInfo.string("x00081155") == undefined
                ? "NULL"
                : props.dicomInfo.string("x00081155")
            }
           </pre
          > --> */}
            <pre>
              0008:2142 Start Trim{' '}
              {props.dicomInfo.elements.x00082142 == undefined ? '' : props.dicomInfo.elements.x00082142.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00082142')}
            </pre>
            <pre>
              0008:2112 Source Image Sequence{' '}
              {props.dicomInfo.elements.x00082112 == undefined ? '' : props.dicomInfo.elements.x00082112.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00082112')}
            </pre>
            <pre>
              0008:2143 Stop Trim{' '}
              {props.dicomInfo.elements.x00082143 == undefined ? '' : props.dicomInfo.elements.x00082143.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00082143')}
            </pre>
            <pre>
              0008:2144 Recommended Display Frame Rate{' '}
              {props.dicomInfo.elements.x00082144 == undefined ? '' : props.dicomInfo.elements.x00082144.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00082144')}
            </pre>
            <pre>
              0010:0010 Patient's Name{' '}
              {props.dicomInfo.elements.x00100010 == undefined ? '' : props.dicomInfo.elements.x00100010.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00100010')}
            </pre>
            <pre>
              0010:0020 Patients's ID{' '}
              {props.dicomInfo.elements.x00100020 == undefined ? '' : props.dicomInfo.elements.x00100020.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00100020')}
            </pre>
            <pre>
              0010:0021 Issuer of Patient ID{' '}
              {props.dicomInfo.elements.x00100021 == undefined ? '' : props.dicomInfo.elements.x00100021.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00100021')}
            </pre>
            <pre>
              0010:0030 Patient's Birth Date{' '}
              {props.dicomInfo.elements.x00100030 == undefined ? '' : props.dicomInfo.elements.x00100030.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00100030')}
            </pre>
            <pre>
              0010:0040 Patients Sex{' '}
              {props.dicomInfo.elements.x00100040 == undefined ? '' : props.dicomInfo.elements.x00100040.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00100040')}
            </pre>
            <pre>
              0010:0010 Patient Name{' '}
              {props.dicomInfo.elements.x00100010 == undefined ? '' : props.dicomInfo.elements.x00100010.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00100010')}
            </pre>

            <pre>
              0010:0020 Patient ID{' '}
              {props.dicomInfo.elements.x00100020 == undefined ? '' : props.dicomInfo.elements.x00100020.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00100020')}
            </pre>

            <pre>
              0010:0030 Patient Birth Date{' '}
              {props.dicomInfo.elements.x00100030 == undefined ? '' : props.dicomInfo.elements.x00100030.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00100030')}
            </pre>

            <pre>
              0010:0040 Patient Sex{' '}
              {props.dicomInfo.elements.x00100040 == undefined ? '' : props.dicomInfo.elements.x00100040.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00100040')}
            </pre>
            <pre>
              0010:1010 Patient Age{' '}
              {props.dicomInfo.elements.x00101010 == undefined ? '' : props.dicomInfo.elements.x00101010.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00101010')}
            </pre>
            <pre>
              0010:1020 Patient Size{' '}
              {props.dicomInfo.elements.x00101020 == undefined ? '' : props.dicomInfo.elements.x00101020.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00101020')}
            </pre>
            <pre>
              0010:1030 Patient Weight{' '}
              {props.dicomInfo.elements.x00101030 == undefined ? '' : props.dicomInfo.elements.x00101030.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00101030')}
            </pre>
            <pre>
              0010:2180 Occupation{' '}
              {props.dicomInfo.elements.x00102180 == undefined ? '' : props.dicomInfo.elements.x00102180.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00102180')}
            </pre>
            <pre>
              0010:4000 Patient Comments{' '}
              {props.dicomInfo.elements.x00104000 == undefined ? '' : props.dicomInfo.elements.x00104000.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00104000')}
            </pre>
            <pre>
              0018:0015 Body Part Examined{' '}
              {props.dicomInfo.elements.x00180015 == undefined ? '' : props.dicomInfo.elements.x00180015.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00180015')}
            </pre>
            <pre>
              0018:0060 KVP{' '}
              {props.dicomInfo.elements.x00180060 == undefined ? '' : props.dicomInfo.elements.x00180060.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00180060')}
            </pre>
            <pre>
              0018:1000 Device Serial Number{' '}
              {props.dicomInfo.elements.x00181000 == undefined ? '' : props.dicomInfo.elements.x00181000.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181000')}
            </pre>
            <pre>
              0018:1020 Software Version(s){' '}
              {props.dicomInfo.elements.x00181020 == undefined ? '' : props.dicomInfo.elements.x00181020.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181020')}
            </pre>
            <pre>
              0018:1030 Protocol Name{' '}
              {props.dicomInfo.elements.x00181020 == undefined ? '' : props.dicomInfo.elements.x00181020.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181020')}
            </pre>

            <pre>
              0018:1063 Frame Time{' '}
              {props.dicomInfo.elements.x00181063 == undefined ? '' : props.dicomInfo.elements.x00181063.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181063')}
            </pre>
            <pre>
              0018:1066 Frame Delay{' '}
              {props.dicomInfo.elements.x00181066 == undefined ? '' : props.dicomInfo.elements.x00181066.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181066')}
            </pre>
            <pre>
              0018:1088 Heart Rate{' '}
              {props.dicomInfo.elements.x00181088 == undefined ? '' : props.dicomInfo.elements.x00181088.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181088')}
            </pre>
            <pre>
              0018:1110 Distance Source To Detector{' '}
              {props.dicomInfo.elements.x00181110 == undefined ? '' : props.dicomInfo.elements.x00181110.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181110')}
            </pre>
            <pre>
              0018:1150 Exposure Time{' '}
              {props.dicomInfo.elements.x00181150 == undefined ? '' : props.dicomInfo.elements.x00181150.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181150')}
            </pre>
            <pre>
              0018:1151 X Ray Tube Current{' '}
              {props.dicomInfo.elements.x00181151 == undefined ? '' : props.dicomInfo.elements.x00181151.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181151')}
            </pre>
            <pre>
              0018:1152 Exposure{' '}
              {props.dicomInfo.elements.x00181152 == undefined ? '' : props.dicomInfo.elements.x00181152.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181152')}
            </pre>
            <pre>
              0018:115E Image And Fluoroscopy Area Dose Product{' '}
              {props.dicomInfo.elements.x0018115e == undefined ? '' : props.dicomInfo.elements.x0018115e.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x0018115e')}
            </pre>
            <pre>
              0018:1160 Filter Type{' '}
              {props.dicomInfo.elements.x00181160 == undefined ? '' : props.dicomInfo.elements.x00181160.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181160')}
            </pre>
            <pre>
              0018:1164 Imager Pixel Spacing{' '}
              {props.dicomInfo.elements.x00181164 == undefined ? '' : props.dicomInfo.elements.x00181164.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181164')}
            </pre>
            <pre>
              0018:1166 Grid{' '}
              {props.dicomInfo.elements.x00181166 == undefined ? '' : props.dicomInfo.elements.x00181166.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181166')}
            </pre>
            <pre>
              0018:1201 Time of Last Calibration{' '}
              {props.dicomInfo.elements.x00181201 == undefined ? '' : props.dicomInfo.elements.x00181201.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181201')}
            </pre>
            <pre>
              0018:1242 Actual Frame Duration{' '}
              {props.dicomInfo.elements.x00181242 == undefined ? '' : props.dicomInfo.elements.x00181242.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181242')}
            </pre>
            <pre>
              0018:1244 Preferred Playback Sequencing{' '}
              {props.dicomInfo.elements.x00181244 == undefined ? '' : props.dicomInfo.elements.x00181244.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181244')}
            </pre>
            <pre>
              0018:1251 Transmit Coil Name{' '}
              {props.dicomInfo.elements.x00181251 == undefined ? '' : props.dicomInfo.elements.x00181251.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181251')}
            </pre>

            <pre>
              0018:1310 Acquisition Matrix{' '}
              {props.dicomInfo.elements.x00181310 == undefined ? '' : props.dicomInfo.elements.x00181310.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181310')}
            </pre>
            <pre>
              0018:1312 In-plane Phase Encoding Direction{' '}
              {props.dicomInfo.elements.x00181312 == undefined ? '' : props.dicomInfo.elements.x00181312.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181312')}
            </pre>
            <pre>
              0018:1314 Flip Angle{' '}
              {props.dicomInfo.elements.x00181314 == undefined ? '' : props.dicomInfo.elements.x00181314.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181314')}
            </pre>
            <pre>
              0018:1315 Variable Flip Andgle Flag{' '}
              {props.dicomInfo.elements.x00181315 == undefined ? '' : props.dicomInfo.elements.x00181315.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181315')}
            </pre>
            <pre>
              0018:1316 SAR{' '}
              {props.dicomInfo.elements.x00181316 == undefined ? '' : props.dicomInfo.elements.x00181316.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181316')}
            </pre>
            <pre>
              0018:1318 dB/dt{' '}
              {props.dicomInfo.elements.x00181318 == undefined ? '' : props.dicomInfo.elements.x00181318.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00181318')}
            </pre>

            <pre>
              0018:5100 Patient Position{' '}
              {props.dicomInfo.elements.x00185100 == undefined ? '' : props.dicomInfo.elements.x00185100.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00185100')}
            </pre>
            <pre>
              0018:5101 View Position{' '}
              {props.dicomInfo.elements.x00185100 == undefined ? '' : props.dicomInfo.elements.x00185100.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00185100')}
            </pre>
            <pre>
              0018:6000 Sensitivity{' '}
              {props.dicomInfo.elements.x00186000 == undefined ? '' : props.dicomInfo.elements.x00186000.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00186000')}
            </pre>
            <pre>
              0018:6011 Sequence of Ultrasound Regions{' '}
              {props.dicomInfo.elements.x00186011 == undefined ? '' : props.dicomInfo.elements.x00186011.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00186011')}
            </pre>
            <pre>
              0018:6012 Region Spatial Format{' '}
              {props.dicomInfo.elements.x00186012 == undefined ? '' : props.dicomInfo.elements.x00186012.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00186012')}
            </pre>
            <pre>
              0018:6014 Region Data Type{' '}
              {props.dicomInfo.elements.x00186014 == undefined ? '' : props.dicomInfo.elements.x00186014.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00186014')}
            </pre>
            <pre>
              0018:6016 Region Flags{' '}
              {props.dicomInfo.elements.x00186016 == undefined ? '' : props.dicomInfo.elements.x00186016.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00186016')}
            </pre>
            <pre>
              0018:6018 Region Location Min X 0{' '}
              {props.dicomInfo.elements.x00186018 == undefined ? '' : props.dicomInfo.elements.x00186018.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00186018')}
            </pre>
            <pre>
              0018:601A Region Location Min Y 0{' '}
              {props.dicomInfo.elements.x0018601a == undefined ? '' : props.dicomInfo.elements.x0018601a.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x0018601a')}
            </pre>
            <pre>
              0018:601C Region Location Max X 0{' '}
              {props.dicomInfo.elements.x0018601c == undefined ? '' : props.dicomInfo.elements.x0018601c.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x0018601c')}
            </pre>
            <pre>
              0018:601E Region Location Max Y 0{' '}
              {props.dicomInfo.elements.x0018601e == undefined ? '' : props.dicomInfo.elements.x0018601e.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x0018601e')}
            </pre>
            <pre>
              0018:6020 Reference Pixel X 0{' '}
              {props.dicomInfo.elements.x00186020 == undefined ? '' : props.dicomInfo.elements.x00186020.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00186020')}
            </pre>
            <pre>
              0018:6022 Reference Pixel Y 0{' '}
              {props.dicomInfo.elements.x00186022 == undefined ? '' : props.dicomInfo.elements.x00186022.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00186022')}
            </pre>
            <pre>
              0018:6024 Physical Units X Direction{' '}
              {props.dicomInfo.elements.x00186024 == undefined ? '' : props.dicomInfo.elements.x00186024.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00186024')}
            </pre>
            <pre>
              0018:6026 Physical Units Y Direction{' '}
              {props.dicomInfo.elements.x00186026 == undefined ? '' : props.dicomInfo.elements.x00186026.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00186026')}
            </pre>
            <pre>
              0018:602C Body Part Examined{' '}
              {props.dicomInfo.elements.x0018602c == undefined ? '' : props.dicomInfo.elements.x0018602c.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x0018602c')}
            </pre>
            <pre>
              0018:602E Body Part Examined{' '}
              {props.dicomInfo.elements.x0018602e == undefined ? '' : props.dicomInfo.elements.x0018602e.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x0018602e')}
            </pre>
            <pre>
              0018:6030 Body Part Examined{' '}
              {props.dicomInfo.elements.x00186030 == undefined ? '' : props.dicomInfo.elements.x00186030.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00186030')}
            </pre>
            <pre>
              0018:6060 Unknown{' '}
              {props.dicomInfo.elements.x00186060 == undefined ? '' : props.dicomInfo.elements.x00186060.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00186060')}
            </pre>
            <pre>
              0018:7004 Detector Type{' '}
              {props.dicomInfo.elements.x00187004 == undefined ? '' : props.dicomInfo.elements.x00187004.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00187004')}
            </pre>
            <pre>
              0018:7022 Detector Element Spacing{' '}
              {props.dicomInfo.elements.x00187022 == undefined ? '' : props.dicomInfo.elements.x00187022.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00187022')}
            </pre>
            <pre>
              0018:7060 Exposure Control Mode{' '}
              {props.dicomInfo.elements.x00187060 == undefined ? '' : props.dicomInfo.elements.x00187060.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00187060')}
            </pre>
            <pre>
              0020:000D Study Instance UID{' '}
              {props.dicomInfo.elements.x0020000d == undefined ? '' : props.dicomInfo.elements.x0020000d.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x0020000d')}
            </pre>
            <pre>
              0020:000E Series Instance UID{' '}
              {props.dicomInfo.elements.x0020000e == undefined ? '' : props.dicomInfo.elements.x0020000e.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x0020000e')}
            </pre>
            <pre>
              0020:0010 Study ID{' '}
              {props.dicomInfo.elements.x00200010 == undefined ? '' : props.dicomInfo.elements.x00200010.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00200010')}
            </pre>
            <pre>
              0020:0011 Series Number{' '}
              {props.dicomInfo.elements.x00200011 == undefined ? '' : props.dicomInfo.elements.x00200011.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00200011')}
            </pre>
            <pre>
              0020:0013 Instance Number{' '}
              {props.dicomInfo.elements.x00100013 == undefined ? '' : props.dicomInfo.elements.x00100013.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00100013')}
            </pre>
            <pre>
              0020:0020 Patient Orientation{' '}
              {props.dicomInfo.elements.x00200020 == undefined ? '' : props.dicomInfo.elements.x00200020.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00200020')}
            </pre>
            <pre>
              0020:0032 Image Position (Patient){' '}
              {props.dicomInfo.elements.x00200032 == undefined ? '' : props.dicomInfo.elements.x00200032.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00200032')}
            </pre>
            <pre>
              0020:0037 Image Orientation (Patient){' '}
              {props.dicomInfo.elements.x00200037 == undefined ? '' : props.dicomInfo.elements.x00200037.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00200037')}
            </pre>
            <pre>
              0020:0052 Frame of Reference UID{' '}
              {props.dicomInfo.elements.x00200052 == undefined ? '' : props.dicomInfo.elements.x00200052.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00200052')}
            </pre>
            <pre>
              0020:0060 Laterality{' '}
              {props.dicomInfo.elements.x00200060 == undefined ? '' : props.dicomInfo.elements.x00200060.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00200060')}
            </pre>
            <pre>
              0020:0062 Image Laterality{' '}
              {props.dicomInfo.elements.x00200062 == undefined ? '' : props.dicomInfo.elements.x00200062.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00200062')}
            </pre>
            <pre>
              0020:1040 Position Reference Indicator{' '}
              {props.dicomInfo.elements.x00201040 == undefined ? '' : props.dicomInfo.elements.x00201040.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00201040')}
            </pre>
            <pre>
              0020:1041 Slice Location{' '}
              {props.dicomInfo.elements.x00201041 == undefined ? '' : props.dicomInfo.elements.x00201041.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00201041')}
            </pre>
            <pre>
              0028:0002 Sample Per Pixel{' '}
              {props.dicomInfo.elements.x00280002 == undefined ? '' : props.dicomInfo.elements.x00280002.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00280002')}
            </pre>
            <pre>
              0028:0004 Photometric Interpretation{' '}
              {props.dicomInfo.elements.x00280004 == undefined ? '' : props.dicomInfo.elements.x00280004.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00280004')}
            </pre>
            <pre>
              0028:0006 Planar Configuration{' '}
              {props.dicomInfo.elements.x00280006 == undefined ? '' : props.dicomInfo.elements.x00280006.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00280006')}
            </pre>
            <pre>
              0028:0008 Number of Frames{' '}
              {props.dicomInfo.elements.x00280008 == undefined ? '' : props.dicomInfo.elements.x00280008.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00280008')}
            </pre>
            <pre>
              0028:0009 Frame Increment Pointer{' '}
              {props.dicomInfo.elements.x00280009 == undefined ? '' : props.dicomInfo.elements.x00280009.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00280009')}
            </pre>
            <pre>
              0028:0010 Rows{' '}
              {props.dicomInfo.elements.x00280010 == undefined ? '' : props.dicomInfo.elements.x00280010.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280010')}
            </pre>
            <pre>
              0028:0011 Columns{' '}
              {props.dicomInfo.elements.x00280011 == undefined ? '' : props.dicomInfo.elements.x00280011.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280011')}
            </pre>
            <pre>
              0028:0030 Pixel Spacing{' '}
              {props.dicomInfo.elements.x00280030 == undefined ? '' : props.dicomInfo.elements.x00280030.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00280030')}
            </pre>
            <pre>
              0028:0034 Pixel Aspect Ratio{' '}
              {props.dicomInfo.elements.x00280034 == undefined ? '' : props.dicomInfo.elements.x00280034.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00280034')}
            </pre>
            <pre>
              0028:0100 Bits Allocated{' '}
              {props.dicomInfo.elements.x00280100 == undefined ? '' : props.dicomInfo.elements.x00280100.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280100')}
            </pre>
            <pre>
              0028:0101 Bits Stored{' '}
              {props.dicomInfo.elements.x00280101 == undefined ? '' : props.dicomInfo.elements.x00280101.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280101')}
            </pre>
            <pre>
              0028:0102 High Bit{' '}
              {props.dicomInfo.elements.x00280102 == undefined ? '' : props.dicomInfo.elements.x00280102.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280102')}
            </pre>
            <pre>
              0028:0103 Pixel Representation{' '}
              {props.dicomInfo.elements.x00280103 == undefined ? '' : props.dicomInfo.elements.x00280103.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280103')}
            </pre>
            <pre>
              0028:0106 Smallest Image Pixel Value{' '}
              {props.dicomInfo.elements.x00280106 == undefined ? '' : props.dicomInfo.elements.x00280106.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280106')}
            </pre>
            <pre>
              0028:0107 Largest Image Pixel Value{' '}
              {props.dicomInfo.elements.x00280107 == undefined ? '' : props.dicomInfo.elements.x00280107.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00280107')}
            </pre>
            <pre>
              0028:1050 Window Center{' '}
              {props.dicomInfo.elements.x00281050 == undefined ? '' : props.dicomInfo.elements.x00281050.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00281050')}
            </pre>
            <pre>
              0028:1051 Window Width{' '}
              {props.dicomInfo.elements.x00281051 == undefined ? '' : props.dicomInfo.elements.x00281051.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00281051')}
            </pre>
            <pre>
              0028:1055 Window Center & Width Explanation{' '}
              {props.dicomInfo.elements.x00281055 == undefined ? '' : props.dicomInfo.elements.x00281055.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00281055')}
            </pre>
            <pre>
              0028:0301 Burned In Annotation{' '}
              {props.dicomInfo.elements.x00280301 == undefined ? '' : props.dicomInfo.elements.x00280301.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00280301')}
            </pre>
            <pre>
              0028:1040 Pixel Intensity Relationship{' '}
              {props.dicomInfo.elements.x00281040 == undefined ? '' : props.dicomInfo.elements.x00281040.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00281040')}
            </pre>
            <pre>
              0028:1041 Pixel Intensity Relationship Sign{' '}
              {props.dicomInfo.elements.x00281041 == undefined ? '' : props.dicomInfo.elements.x00281041.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00281041')}
            </pre>
            <pre>
              0028:1050 Window Center{' '}
              {props.dicomInfo.elements.x00281050 == undefined ? '' : props.dicomInfo.elements.x00281050.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00281050')}
            </pre>
            <pre>
              0028:1051 Window Width{' '}
              {props.dicomInfo.elements.x00281051 == undefined ? '' : props.dicomInfo.elements.x00281051.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00281051')}
            </pre>
            <pre>
              0028:1054 Rescale Type{' '}
              {props.dicomInfo.elements.x00281054 == undefined ? '' : props.dicomInfo.elements.x00281054.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00281054')}
            </pre>
            <pre>
              0028:2110 Lossy Image Compression{' '}
              {props.dicomInfo.elements.x00282110 == undefined ? '' : props.dicomInfo.elements.x00282110.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00282110')}
            </pre>
            <pre>
              0028:2112 Lossy Image Compression{' '}
              {props.dicomInfo.elements.x00282112 == undefined ? '' : props.dicomInfo.elements.x00282112.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00282112')}
            </pre>
            <pre>
              0032:1032 Requesting Physician{' '}
              {props.dicomInfo.elements.x00321032 == undefined ? '' : props.dicomInfo.elements.x00321032.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00321032')}
            </pre>
            <pre>
              0032:1033 Requesting Service{' '}
              {props.dicomInfo.elements.x00321033 == undefined ? '' : props.dicomInfo.elements.x00321033.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.uint16('x00321033')}
            </pre>
            <pre>
              0032:1060 Requested Procedure Description{' '}
              {props.dicomInfo.elements.x00321060 == undefined ? '' : props.dicomInfo.elements.x00321060.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00321060')}
            </pre>
            <pre>
              0040:0244 Performed Procedure Step Start Date{' '}
              {props.dicomInfo.elements.x00400244 == undefined ? '' : props.dicomInfo.elements.x00400244.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00400244')}
            </pre>
            <pre>
              0040:0245 Performed Procedure Step Start Time{' '}
              {props.dicomInfo.elements.x00400245 == undefined ? '' : props.dicomInfo.elements.x00400245.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00400245')}
            </pre>
            <pre>
              0040:0253 Performed Procedure Step ID{' '}
              {props.dicomInfo.elements.x00400253 == undefined ? '' : props.dicomInfo.elements.x00400253.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00400253')}
            </pre>
            <pre>
              0040:0254 Performed Procedure Step Description{' '}
              {props.dicomInfo.elements.x00400254 == undefined ? '' : props.dicomInfo.elements.x00400254.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00400254')}
            </pre>
            <pre>
              0040:0275 Request Attributes Sequence{' '}
              {props.dicomInfo.elements.x00400275 == undefined ? '' : props.dicomInfo.elements.x00400275.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00400275')}
            </pre>
            <pre>
              0040:0280 Comments On The Performed Procedure Step{' '}
              {props.dicomInfo.elements.x00400280 == undefined ? '' : props.dicomInfo.elements.x00400280.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00400280')}
            </pre>
            <pre>
              0054:0220 View Code Sequence{' '}
              {props.dicomInfo.elements.x00540220 == undefined ? '' : props.dicomInfo.elements.x00540220.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x00540220')}
            </pre>
            <pre>
              2050:0020 Presentation LUT Shape{' '}
              {props.dicomInfo.elements.x20500020 == undefined ? '' : props.dicomInfo.elements.x20500020.vr}
              {Object.keys(props.dicomInfo.elements).length === 0 ? 'NULL' : props.dicomInfo.string('x20500020')}
            </pre>
            <pre>
              7FE0:0010 Pixel Data{' '}
              {props.dicomInfo.elements.x7fe00010 == undefined ? '' : props.dicomInfo.elements.x7fe00010.vr}
              {props.dicomInfo.elements.x7fe00010 == undefined ? '' : props.dicomInfo.elements.x7fe00010.length}
            </pre>

            <br />
          </>
        )}
      </Box>
      <Box
        sx={{
          display :'flex',
          flexDirection : 'row-reverse',
        }}
      >
        <Button 
          onClick={closeHeaderModalButton}
          sx={{
            borderRadius: '15px',
            color: 'white',
            bgcolor: '#000000',
            marginTop: '10px',
            marginRight: '15px',
            width: '120px',
            height: '28px',
            size: 'small',
            fontSize: '11px',
            border :'1px solid transparent',
            '&:hover': {
              transitionDelay: '0.1s',
              background: '#000000',
              border: '1px solid #a00000' 
           },
          }}>
            {t('TID00052')}
          </Button>
      </Box>
    </DicomHeaderModalCss>
    </Modal>
  );
};

export default DicomHeaderModal;
