import styled from '@emotion/styled';

export const UserLanguageSettingCss = styled.div`
  width: 100%;
  height: calc(100%);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin-left: 10px;
  border-radius: 10px;
  background: transparent;

  .languageBox{
    width: calc(100% - 40px); 
    height: calc(100% - 30px); 
    background : #242424; 
    display : flex; 
    flex-direction: column;
    border-radius: 10px;
    @media all and (max-width: 1280px){
      width: calc(100% - 20px);
      height: calc(100% - 5px);
    }
    .language{
      width: calc(100% - 40px);
      /* position:relative; */
      height: 100%;
      margin : 20px 20px;
      background: #383838;
      @media all and (max-width: 1280px){
        width: calc(100% - 20px);
        margin : 10px 10px;
      }
      .languageselect {
        width: calc(100% - 40px);
        margin: 20px;
        background-color: white;
      }
    }
  }  
`;