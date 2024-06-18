import styled from '@emotion/styled';

export const PacsCss = styled.div`
  width: 100vw;
  min-height: 100vh;
  height: auto;
  header {
    &.mobileHeader {
      width: 100vw;
      height: 55px;
      display: flex;
      justify-content: center;
      position: relative;
      > .logo {
        width: 55%;
        background: #383838;
        border: none;
        text-align: center;
        @media screen and (min-width: 470px) {
          width: 50%;
        }
        @media screen and (min-width: 530px) {
          width: 45%;
        }
        @media screen and (min-width: 600px) {
          width: 37%;
        }
        @media screen and (min-width: 750px) {
          width: 31%;
        }
        @media screen and (min-width: 900px) {
          width: 27%;
        }
        @media screen and (min-width: 1080px) {
          width: 23%;
        }
        @media screen and (min-width: 1200px) {
          width: 20%;
        }
        @media screen and (min-width: 1400px) {
          width: 18%;
        }
        @media screen and (min-width: 1650px) {
          width: 15%;
        }
        @media screen and (min-width: 1650px) {
          width: 12%;
        }
        @media screen and (min-width: 2050px) {
          width: 10%;
        }
        > img {
          width: 100%;
          height: auto;
          margin: 10px 0;
        }
      }
      .menuButton {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
        svg {
          @media screen and (min-width: 830px) {
            font-size: 5vw;
          }
          @media screen and (min-width: 950px) {
            font-size: 4.5vw;
          }
          @media screen and (min-width: 1130px) {
            font-size: 4vw;
          }
          @media screen and (min-width: 1250px) {
            font-size: 3.5vw;
          }
          @media screen and (min-width: 1550px) {
            font-size: 3vw;
          }
          @media screen and (min-width: 2050px) {
            font-size: 2.5vw;
          }
        }
      }
    }
    &.desktopHeader {
      width: 100vw;
      height: 90px;
      > button {
        background: #383838;
        border: none;
        > img {
          width: 15vw;
          height: auto;
          margin: 18px 0 11px 40px;
        }
      }
      @media screen and (max-width: 1920px) {
        height: 60px;
        > button {
          background: #383838;
          border: none;
          > img {
            width: 12vw;
            height: auto;
            margin: 18px 0 11px 40px;
          }
        }
      }
      @media screen and (max-width: 1280px) {
        height: 40px;
        > button {
          background: #383838;
          border: none;
          > img {
            width: 150px;
            height: auto;
            margin: 10px 0 0 20px;
          }
        }
      }
    }
  }
  .mainBox {
    width: 100%;
    height: calc(100% - 90px);
    display: flex;
    align-items: stretch;
    @media screen and (max-width: 1920px) {
      /* width: 1920px; */
      height: calc(100% - 70px);
    }
    @media screen and (max-height: 1025px) {
      /* height:960px; */
    }
    @media screen and (max-width: 1280px) {
      /* width: 1280px; */
      height: calc(100% - 55px);
    }
    @media screen and (max-width: 1280px) and (max-height: 800px) {
      /* height: 760px; */
    }
    @media screen and (max-width: 900px) {
      /* width: 100vw; */
      /* height: calc(100vh - 55px); */
    }
  }
`;
