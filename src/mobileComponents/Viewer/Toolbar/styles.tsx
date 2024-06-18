import styled from '@emotion/styled';

export const ViewerToolCss = styled.ul`
  padding: 10px 0 10px 20px;
  display: flex;
  background-color: #000;
  width: 100vw;
  height: auto;
  box-sizing: border-box;
  overflow: auto;
  position: fixed;
  bottom: 0;
  z-index: 10;
  .active-tool {
    background: #000;
    color: black;
    border-radius: 10%;
  }
  .disable {
    filter: contrast(15%);
    &:hover {
      background: none !important;
      z-index: 1000;
    }
  }
  .playClipParent {
    position: relative;
    .playClipModal {
      border: 1px solid white;
      border-radius: 10px;
      position: absolute;
      height: auto !important;
      z-index: 10000;
      top: 100%;
      left: 0;
      background: #242424;
      width: 200px;
      padding: 5px;
      &.displayNone {
        display: none;
      }
      &.active-tool {
        background: #000;
        color: black;
        border-radius: 10%;
      }
      > p {
      }
      > input {
        display: block;
        margin-bottom: 5px;
      }
      > div {
        width: 100%;
        display: flex;
        justify-content: space-between;
        > span {
          background: white;
          border-radius: 5px;
          width: 48%;
          text-align: center;
          padding: 5px 0;
          &:hover {
            background: #aaa;
            color: white;
          }
        }
      }
    }
  }
  button {
    list-style: none;
    padding: 10px 15px;
    margin-right: 10px;
    box-shadow: none;
    align-items: center;
    border: 0;
    background: transparent;
    position: relative;
    display: flex;
    flex-direction: column;
    &.displyaNone {
      display: none;
    }
    &.toolModalParent {
      position: relative;
      .toolModalChildren {
        border: 1px solid white;
        border-radius: 10px;
        position: absolute;
        z-index: 1000000;
        top: 100%;
        left: 0;
        background: #242424;
        width: 200%;
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        padding: 5px;
        &.displayNone {
          display: none;
        }
        > div {
          width: 50%;
          > div {
            padding: 5px;
            &:hover {
              background: #000;
              border-radius: 10%;
            }
            &.active-tool {
              background: #000;
              color: black;
              border-radius: 10%;
            }
            > span {
              margin-top: 3px;
              display: block;
              font-size: 10px;
              color: white;
            }
          }
        }
        .playClipButton {
          background: white;
          border-radius: 5px;
          width: 50%;
          color: black;
          padding: 5px;
          font-size: 13px;
          :nth-of-type(1) {
            margin-right: 3px;
          }
          &:hover {
            background: #aaa;
          }
        }
      }
      &.active-tool-modal {
        background: #000;
        color: black;
        border-radius: 10%;
      }
    }
    &.playClip {
      position: relative;
      > .playClipChildren {
        position: absolute;
        &.displayNone {
          display: none;
        }
      }
    }
    &.currentTool {
      &.active-tool {
        background: #242424;
        color: black;
        border-radius: 10%;
      }
      &.disable {
        filter: contrast(15%);
        &:hover {
          background: none !important;
          z-index: 1000;
        }
      }
    }
    > div {
      > img {
        margin-right: 3px;
        vertical-align: middle;
      }
    }
    > span {
      margin-top: 5px;
      display: block;
      color: white;
      font-size: 10px;
      white-space: nowrap;
      @media screen and (max-width: 1280px) {
        font-size: 10px !important;
      }
    }
    &:hover {
      cursor: pointer;
      background: #393939;
      color: black;
      border-radius: 10%;
    }
  }
  .playClip {
    position: relative;
    > button {
    }
    > div {
      position: absolute;
      top: 60;
      background: #393939;
      border: 1px solid white;
      border-radius: 5px;
      padding: 5px;
      z-index: 1000;
      &.displayNone {
        display: none;
      }
    }
  }
`;
export const TogleCss = styled.div`
  .togleBox {
    margin: 4px 5px 4px 0px;
    width: 133px;
    height: 133px;
    border: solid 0.5px white;
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 999999;
    background: black;
    top: 94%;
    left: 0;
  }
  .vertical-align {
  }
  .table {
    margin: 2px;
    width: 22px;
    height: 22px;
    border: solid 0.1px slategray;
    float: left;
  }
`;
