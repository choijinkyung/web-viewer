import styled from "@emotion/styled";
import 'react-calendar/dist/Calendar.css';

// export const Container = styled.div`
//   width:100%;
//   // position: relative;
// `;


// export const Table = styled.table`
//   table-layout: auto; 
// `;

// export const Th = styled.th`
//   font-size: 0.875rem;
//   line-height: 1.25rem; 
//   border-width: 1px; 
// `;

export const WorkListCss = styled.div`
  transition-duration: 0.5s;
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: calc(100% - 30px);
  align-items: stretch;
  box-sizing: border-box;
  @media screen and (max-width: 1920px){
    height: calc(100%);
  }
  @media screen and (max-width: 1280px){
    height: calc(100%);
  }
  /**
  워크리스트가 표출 (table)이 있는 box
  */
  .listbox {
    transition-duration: 0.5s;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    margin-left: 6px;
    width: 100%;
    height: auto;
  
    /**
      상단영역
    */
    .Total {
      position: relative;
      background: #242424;
      border-radius: 10px;
      /* width :calc(100% - 40px); */
      width: calc(100% - 40px);
      height: 60%;
      display: flex;
      flex-direction: column;
      @media (min-width: 1281px) and (max-width: 1920px){
        height: 55%;
      }
      @media screen and (max-width: 1280px) {
        width: calc(100% - 20px);
        height: 50%;  
      }      
        .totalcases{
          ::before{
            display:inline-block;
            position:relative;
            top:4px;
            content: ' ';
            width: 5px;
            height: 17px;
            margin-left: 13px;
            margin-right: 10px;
            background:#621212;
          }
          color: white;
          margin-left: 20;
          margin-top : 2;
          @media screen and (max-width: 1280px){
            margin-left: 10;
            font-size: 12px;
          }
        }
        .selectBoxWrapper{
          width: 100%;
          display: flex;
          flex-direction: row-reverse;
          .selectBox{
            margin: 16px 0 0;
          }
        }
      
      /**
        상단영역의 table 영역
      */
      .tablebox {
        ::-webkit-scrollbar {
          display:none;
        }
        overflow: auto;
        margin: 16px 32px;
        background: #242424;
        width: calc(100% - 70px);
        height: 500px;
        border: 1px solid #242424;
        box-sizing: border-box;
        box-shadow: none !important;
        table-layout:fixed;
        /* font-size: 14px; */
        @media screen and (max-width:1920px){
          margin: 16px 32px;
          height: 430px;
        }
        @media screen and (max-width:1280px){
          width: calc(100% - 35px);
          margin: 8px 16px;
        }
        .contextMenuCss {
        color: white;
        text-align: center;
        border: 1px solid white;
        border-radius: 5px;
        background: #242424;
        position: fixed;
        z-index: 1000;
        height: auto !important;
        tr{
          :first-of-type td{
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            border-bottom:1px solid #fff;
          }
          :last-of-type td{
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
          }
          td {
            cursor: pointer;
            padding: 7px 15px;
            /* border: 1px solid white; */
            /* border-radius: 5px; */
            &:hover {
              color: black;
              background: white;
            }
          }
        }
      }
        table {
          // display: table;
          width:100%;
          table-layout:fixed;
          /* word-break:break-all;
          white-space: nowrap; */
          box-sizing: border-box;       
          thead {
            cursor: pointer;
            tr{
              th {
                :nth-of-type(1){
                  background: #242424;
                }
                color: #cecece;
                background: #090909;
                padding: 8px 0;
                border: 1px solid #242424;
                box-sizing: border-box;
                font-size: 14px;
                @media screen and (max-width: 1920px) {
                  font-size: 14px;
                }
                @media screen and (max-width: 1280px) {
                  font-size: 12px;
                }
              }
            }
          }
          tbody {
            background: #242424;
            text-align: center;
            height: 100%;
            cursor: pointer;
            tr {
              :nth-of-type(2n-1) {
                background:#393939;
              }
              :nth-of-type(2n){
                background:#2f2f2f;
              }
              td{
                :nth-of-type(1){
                  background: #242424;
                }
                padding: 8px 5px;
                border: 1px solid #242424;
                color: #cecece;
                box-sizing: border-box;
                word-break: break-all;
                font-size: 14px;
                @media screen and (max-width: 1920px) {
                  font-size: 14px;
                }
                @media screen and (max-width: 1280px) {
                  font-size: 10px;
                }
              }
              &:hover {
                background: #959595;
                td{
                  color: #242424;
                }                
                }
              }
            }
          }
        }
      }
    }
    /**
      하단영역
    */
    .list2 {
      display: flex;
      justify-content: space-around;
      box-sizing:border-box;
      width: calc(100%);
      height: 40%;
      margin: 12px 0 0 0;
      @media screen and (max-width: 1920px){
        height: 45%;
        margin: 12px 0 0 0;
      }
      @media screen and (max-width: 1280px){
        width: calc(100% - 20px);
        height: 50%;
        margin: 6px 0 0 0;
      }
      /**
        하단 Previous 영역
      */
      .Previous {
        display: block;
        border-radius: 10px;
        background: #242424;
        width: 50%;
        height: 100%;
        color: white;
        &.smallScreen {
          width: 100%;
        }
        .Previoustitle{
          color:#fff;
          margin-top: 11px;
          margin-left:22px;
          @media screen and (max-width:1280px){
            margin-top: 10px;
            margin-left: 11px;
            font-size: 15px;
          }
        }
        /**
          table 영역
         */
        .PreviousPatientInformation{
          ::before{
            display:inline-block;
            position:relative;
            top:4px;
            content: ' ';
            width: 3px;
            height: 17px;
            margin-right: 5px;
            background:#621212;
          }
          /* font-size: 14px; */
          @media screen and (max-width: 1280px){
            ::before{
            display:inline-block;
            position:relative;
            top:4px;
            content: ' ';
            width: 3px;
            height: 15px;
            margin-right: 5px;
            background:#621212;
            }
            font-size: 12px;
          }
        }
        .previousTable {
          ::-webkit-scrollbar{
            display:none;
          }
          margin-top: 14px;
          margin-left: 32px;
          width: calc(100% - 70px);
          height: auto;
          max-height: calc(100% - 110px);
          overflow: auto;
          @media screen and (max-width : 1280px){
            margin-top: 10px;
            margin-left: 10px;
            width: calc(100% - 20px);
          }
          .contextMenuCss {
            color: white;
            text-align: center;
            border: 1px solid white;
            border-radius: 5px;
            background: #242424;
            position: fixed;
            z-index: 1000;
            height: auto !important;
            td {
              cursor: pointer;
              padding: 10px 20px;
              border: 1px solid white;
              border-radius: 5px;
              &:hover {
                color: black;
                background: white;
              }
            }
          }
          table {
            table-layout: fixed;
            word-break:break-all;
            thead {
              th {
                text-align:center;
                color: white;
                background: #090909;
                padding: 8px 0;
                border: 1px solid #242424;
                box-sizing: border-box;
                font-size: 14px;
                @media screen and (max-width: 1920px) {
                  font-size: 14px;
                }
                @media screen and (max-width: 1280px) {
                  font-size: 12px;
                }
              }
            }
            tbody {
              background: #393939;
              text-align: center;
              tr {
                :nth-of-type(2n){
                  background:#2f2f2f;
                }
                td{
                  padding:8px 5px;
                  border:1px solid #242424;
                  color: #cecece;
                  box-sizing: border-box;
                  font-size: 14px;
                  @media screen and (max-width: 1920px) {
                    font-size: 14px;
                  }
                  @media screen and (max-width: 1280px) {
                    font-size: 10px;
                  }
                }
                &:hover {
                  background: #959595;
                  td{
                    color: #242424;
                  }
                }
              }
            }
          }
        }
      }
    }
`;