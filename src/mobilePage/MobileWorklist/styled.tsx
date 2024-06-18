import styled from '@emotion/styled';

export const MobileWorklistCss = styled.div`
  width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  .studyTable {
    width: 100%;
    height: 100%;
    margin-bottom: 5px;
    .studyTableTitle{
      width: 100%;
      text-align: center;
      background: #000;
      color: white;
      padding: 10px 0;
    }
    .tablebox {
      background: #242424;
      /* width: calc(100% - 70px); */
      width: auto;
      height: calc(100% - 41px);
      border: 1px solid #242424;
      box-shadow: none !important;
      table-layout: fixed;
      overflow: scroll;
      table {
        // display: table;
        width: 100%;
        /* table-layout:fixed; */
        /* word-break:break-all;
          white-space: nowrap; */
        thead {
          width: 100%;
          cursor: pointer;
          tr {
            height: 10%;
            th {
              height: 100%;
              /* :nth-of-type(1) {
                background: #242424;
              } */
              white-space: nowrap;
              color: #cecece;
              background: #090909;
              padding: 10px;
              border: 1px solid #242424;
              /* font-size: 40px; */
            }
          }
        }
        tbody {
          background: #242424;
          text-align: center;
          cursor: pointer;
          tr {
            height: 10%;
            :nth-of-type(2n-1) {
              background: #393939;
            }
            :nth-of-type(2n) {
              background: #2f2f2f;
            }
            td {
              height: 100%;
              /* :nth-of-type(1) {
                background: #242424;
              } */
              white-space: nowrap;
              padding: 10px;
              border: 1px solid #242424;
              color: #cecece;
              word-break: break-all;
              /* font-size: 40px; */
            }
            &:hover {
              background: #959595;
              td {
                color: #242424;
              }
            }
          }
        }
      }
    }
  }

  .previousList {
    width: 100vw;
    height: 35%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin: 40px 0 0 0;
    overflow: hidden;
    /**
        하단 Previous 영역
      */
    .previousListTitle{
      width: 100%;
      text-align: center;
      background: #000;
      color: white;
      padding: 10px 0;
    }
    .prevInfo{
      display: flex;
      padding: 0 10px;
      color: white;
      >p {
        width: 45%;
      }
    }
    .Previous {
      display: block;
      border-radius: 10px;
      background: #242424;
      width: 100%;
      height: 100%;
      color: white;
      .Previoustitle {
        color: #fff;
        margin-top: 11px;
        margin-left: 22px;
      }
      /**
          table 영역
         */
      .previousTable {
        width: auto;
        height: 100%;
        max-height: calc(100%);
        overflow: auto;
        table {
            width: 100%;
          thead {
            width: 100%;
            th {
            white-space: nowrap;
              color: #cecece;
              background: #090909;
              padding: 15px;
              border: 1px solid #242424;
              /* font-size: 40px; */
            }
          }
          tbody {
            background: #242424;
          text-align: center;
          height: 100%;
          cursor: pointer;
            tr {
              :nth-of-type(2n) {
                background: #2f2f2f;
              }
              td {
                white-space: nowrap;
              padding: 15px;
              border: 1px solid #242424;
              color: #cecece;
              word-break: break-all;
              /* font-size: 40px; */
              }
              &:hover {
                background: #959595;
                td {
                  color: #242424;
                }
              }
            }
          }
        }
      }
    }
  }

  .report {
    width: 100vw;
    height: 25%;
    .reportTitle{
      width: 100%;
      text-align: center;
      background: #000;
      color: white;
      padding: 10px 0;
    }
  }
`;
