import styled from '@emotion/styled';

export const DicomHeaderModalCss = styled.div`
        position: absolute;
        padding: 12px;
        width: 60vw;
        height: 70vh;
        background: #393939;
        border: 1px solid #fff;
        border-radius: 10px;
        color: white;
        z-index: 10000;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        > h3 {
          margin-bottom: 10px;
        }
        div:nth-of-type(1) {
          height: 90%;
          color: white;
          background: #242424;
          overflow: auto;
          padding: 12px;
        }
        div:nth-of-type(2) {
          margin: 10px 0;
          /* > button {
            display: inline-block;
            padding: 10px 40px;
            margin-left: auto;
            color: white;
            background: #000;
            border-radius: 5px;
            cursor: pointer;
          } */
        }
`;