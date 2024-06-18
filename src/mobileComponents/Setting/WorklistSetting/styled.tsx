import styled from "@emotion/styled";

export const WorklistSettingCss = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin-left: 10px;
  border-radius: 10px;
  background: transparent;
  .worklistToolBox{
    width: 100%; 
    height: 100%; 
    background : transparent; 
    display : flex; 
    flex-direction: column;
    color: white;
    box-sizing: border-box;
      .buttonBox{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        width: 100%;
      } 
      .tablewrapper{
      align-items: center;
      width: 95%;
      /* position:relative; */
      height: 80%;
      background: #383838;
      box-sizing: border-box;
      table {
          // display: table;
          width:100%;
          height: 100%;
          table-layout:fixed;
          word-break:break-all;
          white-space: nowrap;
          box-sizing: border-box;
          thead {
            tr{
              th {
                color: #cecece;
                background: #090909;
                padding: 8px 0;
                border: 1px solid #242424;
                box-sizing: border-box;
                /* text-align: center; */
              }
            }
          }
          tbody {
            background: #242424;
            /* text-align: center; */
            height: 100%;
            box-sizing: border-box;
            tr {
              :nth-of-type(2n-1) {
                background:#393939;
              }
              :nth-of-type(2n){
                background:#2f2f2f;
              }
              td{
                padding: 8px 0;
                /* text-align: center; */
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