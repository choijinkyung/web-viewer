import React, { useEffect } from "react";
import ViewerContent from "@components/Viewer/ViewerContent";
import { ViewerCss } from "./styles";
import { ReportModal } from "@components/Modal/ReportModal";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@store/index";
import { worklistActions } from "@store/worklist";
import ComparisonCheckListModal from "@components/Modal/ComparisonCheckListModal";

const Viewer = () => {
  const { study_key } = useParams();
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
  };
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
      const payload = {
        study_key,
        headers,
      };
      // dispatch(worklistActions.fetchStudyInfo(payload));
    }, [study_key]);
  
  return (
    <ViewerCss>
      <ViewerContent />
      <ReportModal location='viewer'/>
      <ComparisonCheckListModal/>
    </ViewerCss>
  );
};

export default Viewer;
