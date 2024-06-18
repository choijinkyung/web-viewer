import styled from "@emotion/styled";

export const Report = styled.div`
  /**
 하단 Report 영역
*/
  border-radius: 8px;
  background: #242424;
  margin: 0 40px 0 12px;
  width: 50%;
  height: 100%;
  color: white;
  &.displayNone {
    display: none;
  }
  @media screen and (max-width: 1280px){
    margin: 0 20px 0 12px;
  }
  .ButtonWrapper {
    margin-top: 1%;
    width: calc(100% - 30px);
    height: 35px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    @media screen and (max-width : 1280px){
      width: calc(100% - 10px);
      margin-top: 10px;
    }

    .ReportTitle{
      color: fff;
      margin-left: 17px;
      @media screen and (max-width : 1280px){
        margin-top: 0px;
        margin-left: 10px;
        font-size: 15px;
      }
    }
  }

  .ReportItem {
    display: flex;
    width: calc(100% - 40px);
    height: calc(100% - 35px);
    @media screen and (max-width: 1280px){
      width: calc(100% - 10px);
      height: calc(100% - 15px);
      /* margin-top: 1%; */
    }
    .ReportTextArea {
      display: flex;
      flex-direction: column;
      width: 70%;
      height: 100%;
      @media screen and (max-width: 1920px){
        width: 60%;
      }
      @media screen and (max-width: 1280px){
        width: 60%;
      }
      textarea.comment {
        height: 40%;
        margin-bottom: 15px;
        margin-top: 1%;
        margin-left: 15px;
        padding: 5px;
        background: #393939;
        color: white;
        border-radius: 10px;
        @media screen and (max-width: 1920px) {
          height: 30%;
        }
        @media screen and (max-width: 1280px){
          height: 30%;
          margin-top: 1%;
          margin-bottom:5px;
          margin-left: 5px;
        }
        &::placeholder {
          z-index: 99;
          color: #aaa;
        }
      }
      textarea.finding {
        height: calc(60% - 60px);
        /* margin-bottom: 15px; */
        margin-left: 15px;
        padding: 5px;
        background: #393939;
        color: white;
        border-radius: 10px;
        @media screen and (max-width: 1920px) {
          height : calc(70% - 60px);
        }
        @media screen and (max-width: 1280px){
          height: calc(70% - 45px);
          /* margin-bottom: 5px; */
          margin-left: 5px;
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
        height: calc(25% - 15px);
        margin-bottom: 15px;
        margin-left: 15px;
        padding: 5px;
        background: #393939;
        color: white;
        border-radius: 10px;
        @media screen and (max-width: 1920px) {

        }
        @media screen and (max-width: 1280px){
          height: calc(25% - 5px);
          margin-bottom: 5px;
          margin-left: 5px;
        }
      }
      textarea.recommendation {
        height: calc(25% - 35px);
        margin-bottom: 35px;
        margin-left: 15px;
        padding: 5px;
        background: #393939;
        color: white;
        border-radius: 10px;
        @media screen and (max-width: 1920px) {
          height: calc(25% - 35px);
          margin-bottom: 35px;
        }
        @media screen and (max-width: 1280px){
          height: calc(25% - 35px);
          margin-bottom: 35px;
          margin-left: 5px;
        }
      } */
    }
    .ReportSearchBox {
      display: flex;
      flex-direction: column;
      width: 30%;
      height: calc(100% - 5px);
      margin-top: 5px;
      margin-bottom: 5px;
      justify-content: space-between;
      overflow: auto;
      @media screen and (max-width: 1920px){
        width: 40%;
        margin-top : 0px;
      }
      @media screen and (max-width: 1280px){
        width: 40%;
        margin-top : 0px;
        height: 100%;
      }
      select {
        width: 80%;
        height: 25px;
        margin-top: 1%;
        background: #090900;
        color: white;
        border-radius:10px;
        font-size: 12px;
        @media screen and (max-width: 1920px){
          width: 90%;
          height: 18px;
          margin-top: 1%;
        }
        @media screen and (max-width: 1280px){
          width: 90%;
        }
      }

      .readingWrapper{
        width:90%;
        padding-left:5%;
        margin-top:1%;
        @media screen and (max-width:1920px) {
          margin-top : 5px;
          padding-left: 0%;
          width:95%;
        }
        @media screen and (max-width: 1280px){
          padding-left: 0%;
          margin-top: 2px;
          width: 95%;
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
            @media screen and (max-width: 1920px){
              width: 100%;  
              height: 20px;
              font-size: 10px;
              line-height: 15px;
              margin-top: 1%;
          }
        }
        .unreading{
            background: #090900;
            width: 100%;
            height: 25px;   
            border: 1px solid #767676;
            border-radius:10px;
        }
      }
    }
  }
`;