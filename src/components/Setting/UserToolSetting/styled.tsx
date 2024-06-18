import styled from "@emotion/styled";

export const UserToolSettingCss = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin-left: 10px;
  border-radius: 10px;
  /* background: transparent; */

  .toolBox{
    width: calc(100% - 40px); 
    height: calc(100% - 30px); 
    background : #242424; 
    display : flex; 
    flex-direction: column;
    border-radius: 10px;
    /* color: white; */
    @media all and (max-width: 1280px){
      width: calc(100% - 20px);
      height: calc(100% - 5px);
    }
    .choiceBox{
      /* height: 5%;  */
      margin: 40px 20px;
      border-bottom : 1px solid #cecece;
      >span {
        font-size: 24px;
        line-height: 38px;
        color: white;
        padding: 5px 20px;
        border-radius: 10px 10px 0 0;
        &.active {
          line-height: 35px;
          background: #242424;
          border: 1px solid #cecece;
          border-bottom: none;
        }
      }
    }

      .buttonBox{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        width: 100%;
      } 
      .tablewrapper{
        width: calc(100% - 40px);
        /* position:relative; */
        /* height: 90%; */
        max-height: 100%;
        margin : 20px 20px;
        background: #383838 !important;
        @media all and (max-width: 1280px){
          width: calc(100% - 20px);
          margin : 10px 10px;
        }
        table {
          // display: table;
          width:100%;
          table-layout:fixed;
          word-break:break-all;
          white-space: nowrap;
          box-sizing: border-box;
          thead {
            tr{
              th {
                color: #cecece;
                background: #090909 !important;
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
      .toolManageBox{
        height: 80%;
        .tablewrapper{
        width: calc(100% - 40px);
        /* position:relative; */
        /* height: 100%; */
        margin : 20px 20px;
        background: #383838 !important;
        @media all and (max-width: 1280px){
          width: calc(100% - 20px);
          margin : 10px 10px;
        }
        table {
          // display: table;
          width:100%;
          /* height: 100%; */
          table-layout:fixed;
          word-break:break-all;
          white-space: nowrap;
          box-sizing: border-box;
          thead {
            tr{
              th {
                color: #cecece;
                background: #090909 !important;
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
                .innerTable{
                  width: 99%;
                  margin: 0.5%;
                  table-layout: fixed;
                  /* background-color: white; */
                }              
              }
              &:hover {
                background: #959595;
                }
              }
            }
          }
        }
      }
    .textBox{
    width: 100%; 
    /* height: calc(100%);  */
    background : #242424; 
    display : flex; 
    flex-direction: column;
    border-radius: 10px;
    /* color: white; */
    @media all and (max-width: 1280px){
      width: calc(100% - 20px);
      height: calc(100% - 5px);
    }
      .buttonBox{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        width: 100%;
      } 
      .tablewrapper{
        width: calc(100% - 40px);
        /* position:relative; */
        height: 90%;
        /* max-height: 100%; */
        margin : 20px 20px;
        background: #383838 !important;
        @media all and (max-width: 1280px){
          width: calc(100% - 20px);
          margin : 10px 10px;
        }
        table {
          // display: table;
          width:100%;
          table-layout:fixed;
          word-break:break-all;
          white-space: nowrap;
          box-sizing: border-box;
          thead {
            tr{
              th {
                color: #cecece;
                background: #090909 !important;
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
                table {
                  // display: table;
                  width:100%;
                  margin: 0;
                  /* height: 100%; */
                  table-layout:fixed;
                  word-break:break-all;
                  white-space: nowrap;
                  box-sizing: border-box;

                  tbody {
                    background: #242424;
                    /* text-align: center; */
                    height: 100%;
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
                        border-left: none;
                        border-right: none;
                        color: #cecece;
                        box-sizing: border-box;  
                       .innerTable{
                          width: 100%;
                          /* margin: 0.5%; */
                          table-layout: fixed;
                          /* background-color: white; */
                        }              
                      }
                    }
                  }
                }       
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

export const ModalCss = styled.div`
        position: absolute;
        padding: 25px;
        background: #393939;
        border: 1px solid #fff;
        border-radius: 10px;
        color: white;
        z-index: 10000;
        top: 50%;
        left: 50%;
        transform: translate(-25%,-25%);
        .title{
          font-size: 12px;
        }
        >.button {
          display: flex;
          justify-content: space-around;
          button {
            margin-top: 20px;
            width: 30%;
            padding: 5px 0;
            background: #000;
            border: 1px solid #fff;
            border-radius: 5px;
            color:#fff;
          }
        }
        
`;
