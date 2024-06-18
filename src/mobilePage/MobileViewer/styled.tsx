import styled from "@emotion/styled";

export const MobileViewerCss = styled.div`
    width: 100vw;
    height: calc(100vh - 55px);
    position: relative;
    .spinner-wrapper{
    position:absolute;
    width:100%;
    height:100%;
    background-color: rgba(0,0,0, 0.5);
    z-index:999999;
     .spinner-Box{
        position: absolute;
        top: 35%;
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
    .parentDiv{
        width: 100%;
        height: 100%;
    }
    .swiper {
        width: 100%;
        height: 90%;
        &.thumbnail{
            height: 70%;
        }
    }
    .displayNone {
        display: none;
      }
`;