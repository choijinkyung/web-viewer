import styled from '@emotion/styled';

export const UserInfoSettingCss = styled.div`
  width: 100%;
  height: calc(100%);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin-left: 10px;
  border-radius: 10px;
  background: transparent;

  .tableBox {
    width: calc(100% - 40px);
    height: calc(100% - 30px);
    background: #242424;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    @media all and (max-width: 1280px){
      width: calc(100% - 20px);
      height: calc(100% - 5px);
    }
    .tablewrapper {
      width: calc(100% - 40px);
      /* position:relative; */
      height: 100%;
      margin: 20px 20px;
      background: #383838;
      @media all and (max-width: 1280px){
        width: calc(100% - 20px);
        margin : 10px 10px;
      }
      table {
        // display: table;
        width: 100%;
        table-layout: fixed;
        word-break: break-all;
        white-space: nowrap;
        box-sizing: border-box;
        @media all and (max-width: 1280px){
          
        }
        thead {
          tr {
            th {
              color: #cecece;
              background: #090909;
              padding: 8px 0;
              border: 1px solid #242424;
              box-sizing: border-box;
              text-align: center;
            }
          }
        }
        tbody {
          background: #242424;
          text-align: center;
          height: 100%;
          tr {
            :nth-of-type(2n-1) {
              background: #393939;
            }
            :nth-of-type(2n) {
              background: #2f2f2f;
            }
            td {
              padding: 8px 0;
              text-align: center;
              border: 1px solid #242424;
              color: #cecece;
              box-sizing: border-box;
            }
            &:hover {
              background: #959595;
            }
          }
        }
      }
    }
  }
`;