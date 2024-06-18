import styled from "@emotion/styled";

export const UserSettingCss = styled.div`
    width: 100vw; 
    height: 100vh;    

    .toolBox{
    width: 100vw; 
    height: 840px !important;
    background : #242424; 
    display : flex; 
    flex-direction: column;
    border-radius: 10px;
    .choiceBox{
        margin: 20px;
      >span {
        font-size: 14px;
        line-height: 38px;
        color: white;
        padding: 12px 12px;
        border-radius: 10px 10px 0 0;
        &.active {
          line-height: 35px;
          background: #242424;
          border: 2px solid #a00000;
          border-bottom: none;

        }
      }
    }
    }
`;