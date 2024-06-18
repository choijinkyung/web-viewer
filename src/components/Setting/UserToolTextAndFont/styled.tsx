import styled from "@emotion/styled";

export const UserToolTextAndFontCss = styled.div`
    
`;

export const ModalCss = styled.div`
        width: 20%;
        position: absolute;
        background: #242424;
        border: 1px solid #fff;
        border-radius: 20px;
        box-shadow: 24px;
        color: white;
        z-index: 10000;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        .title {
          border-radius: 20px 20px 0 0 ;
          background: #000;
          padding :10px;
          margin-bottom: 10px;
          font-size: 15px;
          font-weight: 400;
        }
        .input {
          padding: 5px;
          align-items: center;
          text-align: center;
          input {
            width: 95%;
            padding: 5px 10px;
            font-size: 18px;
            margin-bottom: 15px;
          }
        }
        >.button {
          display: flex;
          padding: 20px 25px;
          justify-content: space-around;
          button {
            margin-top: 10px;
            width: 48%;
            padding: 5px 0;
            background: #000;
            border: 1px solid #242424;
            border-radius: 5px;
            color:#fff;
          }
        }
        
`;
