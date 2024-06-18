import styled from '@emotion/styled';

export const WadoImageLoaderCss = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  color: white;
  .imageDivBox {
    width: 100%;
    height: 100%;
    background: black;
    position: absolute;
 
    .image {
    
      width: auto;
      height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  span {
    display: block;
  }
  .playClipModal {
          border: 1px solid white;
          border-radius: 10px;
          position: absolute;
          height: auto !important;
          z-index: 1000;
          bottom: 1%;
          left: 50%;
          transform: translate(-50%,0);
          background:#393939;
          width: 170px;
          height: 15%;
          padding: 5px;

          &.displayNone {
            display: none;
          }
          &.active-tool {
            background: #000;
            color: black;
            border-radius: 10%;
          }
          >p {
            
          }
          >input {
            display: block;
            margin-bottom: 5px;
            width: 100%;
          }
          >input[type="range"]{
            accent-color: #393939;
          }
          >div{
            width: 100%;
            display: flex;
            justify-content: space-between;
            >div.playbutton {
              background: #aaa;
              border-radius: 5px;
              text-align: center;
              padding: 5px 0;
              width: 15%;
              &:hover {
                background: #000000;
                color: #fff;
              }
              &.active {
               background: #242424;
              }
            }
            >div.stopbutton {
              background: #aaa;
              border-radius: 5px;
              text-align: center;
              padding: 5px 0;
              width: 15%;
              &:hover {
                background: #fff;
                color: #010101;
              }
              &.active {
                background: #242424;
              }
            }
            >div.fpsbutton {
              display: flex;
              flex-direction: row;
              position: relative;
              font-size: 15px;
              width:100%;
              .speedbutton{
                width: 20%;
                :hover{
                  color: #A00000;
                  transition : 0.1s linear;
                }
              }
              > p.fpswords {
                vertical-align: middle;
                text-align: center;
                color: white;
                width: 60%;
                line-height: 30px;
              }
              > div.speedrange {
                width: 110px;
                height: 30px;
                background: #393939;
                position: absolute;
                top: 0;
                left: 0;
                transform: translate(0, -100%);
                > input[type=range] {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%,-50%);
                  width: 80%;
                  accent-color: #A00000;
                }
              }
            }
          }
        }
  .imageNotFound{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    font-size: 30px;
  }
  .mobileFont{
    font-size: 12px;
  }
  .XLarge {
    font-size: 0.9vw;
  }
  .large {
    font-size: 0.7vw;
  }
  .medium {
    font-size: 0.6vw;
  }
  .small {
    font-size: 0.5vw;
  }
  .topLeft {
    position:absolute;
    top: 10;
    left: 10;
  }
  .topRight {
    position: absolute;
    top: 10;
    right: 10;
  }
  .bottomLeft {
    position: absolute;
    bottom: 10;
    left: 10;
    
  }
  .bottomRight {
    position: absolute;
    bottom: 10;
    right: 10;
  }
  .bottomCenter {
    position: absolute;
    bottom: 10;
    right: 50%;
    transform: translate(50%,0);
    &.displayNone {
      display: none;
    }
  }
  .playClip {
    position: absolute;
    bottom: 10;
    left: 50%;
    border-radius: 5px;
    border: 1px solid white;
    background-color: #383838;
    transform: translate(-50%,0);
    padding: 5px;
    >div{
      display: flex;
      justify-content: space-between;
      >span {
        background: white;
        border: 1px solid black;
        padding: 5px 0;
        border-radius: 5px;
        margin-top: 5px;
        color: black;
        text-align: center;
        display: block;
        width: 48%;

      }
    }
  }
`;
