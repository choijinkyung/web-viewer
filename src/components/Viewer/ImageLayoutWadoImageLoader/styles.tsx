import styled from '@emotion/styled';

export const ImageLayoutWadoImageLoaderCss = styled.div`

  width: 100%;
  height: 100%;
  position: relative;
  color: white;
  span {
    display: block;
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
`;
