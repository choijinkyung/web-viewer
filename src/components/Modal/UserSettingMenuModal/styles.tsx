import styled from '@emotion/styled';

export const SettingMenuModalCss = styled.div`
  background: #242424;
  color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  width: 200px;
  min-width: 200px;
  height: calc(100% - 30px);
  padding: 5px;
  margin-left: 12px;
  @media screen and (max-width: 1920px) {
    height: calc(100% - 30px);
  }
  @media screen and (max-width: 1280px) {
    width: 150px;
    min-width: 150px;
    height: calc(100% - 5px);
  }

   .Menuwrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      /* width: 40px; */        
      margin: 10px 0 0;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      @media screen and (max-width: 1920px) {
      
      }
      ul{
        display: flex;
        flex-direction: column;
        li{
          width: 100%;
          div{
            display: flex;
            flex-direction: column;
            align-items: center;         
            div.icon {
              margin-top: 0px;
              padding: 8px;
              border-radius: 50%;
              box-sizing: border-box;
              -webkit-box-sizing: border-box;
              -moz-box-sizing: border-box;
              border : 1px solid #242424;
              &:hover {
                border: 1px solid #a00000;
                background: #fafafa;
                box-sizing: border-box;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
              }
              &.active {
                background: #fafafa;
                border: 1px solid #a00000;
                &:hover {
                  background: #ccc;
                }
              }
            }
          }
          span {
            font-size: 14px;
          }
        }
      }
    }
  `;
