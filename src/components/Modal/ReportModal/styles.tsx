import styled from '@emotion/styled';
export const ReportModalCSS = styled.div`
  margin: 0;
  position: absolute;
  top: 15%;
  left: 25%;
  transform: translate(-50% -50%);
  width : 50%;
  height: 70%;
  background-color: #242424;
  border: 2px solid #ffffff;
  border-radius: 20px;
  box-shadow: 24px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  overflow:auto;
  @media all and (max-width : 1920px){
    transform: translate(-50% -50%);
    top: 5%;
    left: 15%;
    width: 70%;
    height: 90%;
  }
  @media all and (max-width : 1280px){
    transform: translate(-50% -50%);
    top: 5%;
    left: 15%;
    width: 70%;
    height: 90%;
  }

  .ReportItem {
    display: flex;
    width: calc(100%);
    height: calc(100%);
    .ReportTextArea {
      display: flex;
      flex-direction: column;
      width: 70%;
      height: 100%;
      textarea.comment {
        height: 40%;
        margin-bottom: 15px;
        margin-top: 12px;
        margin-left: 15px;
        padding: 5px;
        background: #393939;
        color: white;
        border-radius: 10px;
      }
      textarea.finding {
        height: calc(60%);
        margin-bottom: 15px;
        margin-left: 15px;
        padding: 5px;
        background: #393939;
        color: white;
        border-radius: 10px;
        @media screen and (max-width: 1920px) {

        }
        &::placeholder {
          z-index: 99;
          color: #aaa;
        }
        &.color {
          z-index: 99;
          color: #aaa;
        }
      }
      /* textarea.conclusion {
        height: calc(25%);
        margin-bottom: 15px;
        margin-left: 15px;
        padding: 5px;
        background: #393939;
        color: white;
        border-radius: 10px;
        @media screen and (max-width: 1920px) {
        }
      }
      textarea.recommendation {
        height: 25%;
        margin-bottom: 15px;
        margin-left: 15px;
        padding: 5px;
        background: #393939;
        color: white;
        border-radius: 10px;
        @media screen and (max-width: 1920px) {
        }
      } */
    }
    .ReportSearchBox {
      display: flex;
      flex-direction: column;
      width: 30%;
      height: 100%;
      margin-right: 15px;  
      justify-content: space-between;
      select {
        width: 80%;
        height: 25px;
        margin-top: 10px;
        background: #090900;
        color: white;
        border-radius:10px;
        font-size: 12px;
        @media screen and (max-width: 1920px) {
          margin-top: 1%;
        }
      }

      .readingWrapper{
        width:90%;
        padding-left:5%;
        margin-top:12px;
        @media screen and (max-width:1920px) {
          margin-top : 12px;
        }
        
        .reading{    
            background: #090900;
            width: 100%;        
            text-align: left;
            padding-left: 10px;
            border: 1px solid #767676;
            border-radius:10px;
            font-size: 12px; 
            height: 25px;
            line-height: 22px;
        }

        .unreading{
            background: #090900;
            width: 100%;
            height: 25px;   
            margin-top:12px;
            border: 1px solid #767676;
            border-radius:10px;
        }
      }
    }
  }
`;
