import styled from '@emotion/styled';

export const ViewerContentCss = styled.div`
  width: 100%;
  height: calc(100% - 35px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #383838;
  position: relative;
  @media (max-width:1280px){
    height: calc(100% - 10px);
  }
  .mobilePrev{
    position: absolute;
    z-index: 1000002;
    top:50%;
    left: 1%;
    padding: 15px;
    opacity: 20%;
    &:active {
      opacity: 100%;
    }
  }
  .mobileNext{
    position: absolute;
    z-index: 1000002;
    top:50%;
    right: 1%;
    padding: 15px;
    opacity: 20%;
    &:active {
      opacity: 100%;
    }
  }
  .spinner-wrapper{
    position:absolute;
    width:100%;
    height:100%;
    background-color: rgba(0,0,0, 0.5);
    z-index:999999;
     .spinner-Box{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
     }
    .spinners{
      border-color:#E50915;
    }
    .spinners-loading{  
      font-size: 19px;
      color: white;
    }
  }
  .active-red {
    box-sizing: border-box;
    border: 3px solid #dd322f !important;
  }
  .displayNone {
        display: none;
      }
      .imageLayoutParentDiv {
        border: 3px solid #383838;
        width: 100%;
        height: 100%;
        &.border-active {
          border: 3px solid #ff0 !important;
        }
        &.displayNone {
          display: none;
        }
      }
  .contentDivBox {
    display: flex;
    margin-left:12px;
    position: relative;
    width: calc(100% - 40px);
    height: calc(100%);
    &.backgroundGray {
      filter: brightness(65%);
    }
    @media screen and (max-width: 1280px){
      margin-left: 6px;
      width: calc(100% - 20px);
    };
    .parentDiv {
      background-color: black;
        width: 100%;
        height: 100%;
        border: 3px solid #383838;
    }
    .wadoBox {
      width: calc(100vw - 150px);
      height: 100%;
      display: grid;
      background-color: black;
      grid-column-gap: 1;
      grid-row-gap: 1;
      position: relative;
      @media screen and (max-width: 1280px) {
        width: calc(100vw - 150px);
      }
      @media screen and (max-width: 720px) {
        width: calc(100vw - 100px);
      }
      .contextMenuCss {
        color: white;
        text-align: center;
        /* border: 1px solid white; */
        border-radius: 5px;
        background: black;
        position: fixed;
        z-index: 1000;
        > div {
          padding: 7px 15px;
          /* border: 1px solid white; */
          /* border-radius: 5px; */
          :first-of-type{
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            border: 1px solid #eee;
          }
          :last-of-type{
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            border: 1px solid #eee;
            border-top: none;
          }
          &:hover {
            color: black;
            background: #dedede;
          }
        }
      }
      .imageLayoutParentDiv {
        border: 3px solid #383838;
        width: 100%;
        height: 100%;
        &.border-active {
          border: 3px solid #ff0 !important;
        }
        &.displayNone {
          display: none;
        }
      }
      .parentDiv {
        background-color: black;
        width: 100%;
        height: 100%;
        border: 3px solid #383838;
      }
      .displayNone {
        display: none;
      }
      .modalBox{
        position: absolute;
        padding: 12px;
        width: 60vw;
        height: 70vh;
        background: #fff;
        z-index: 10000;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        >h3 {
          margin-bottom: 10px;
        }
        div:nth-of-type(1) {
          height: 90%;
          background: #242424;
        }
        div:nth-of-type(2) {
          margin: 10px 0;
          >span {
            display: inline-block;
            padding: 10px 40px;
            margin-left: auto;
            color: white;
            background: #000;
            border-radius: 5px;
            cursor: pointer;
          }
        }
      }
    }
  }
`;
