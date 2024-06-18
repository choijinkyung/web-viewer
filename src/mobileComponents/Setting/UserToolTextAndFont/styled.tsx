import styled from "@emotion/styled";

export const UserToolTextAndFontCss = styled.div`
    
`;

export const ModalCss = styled.div`
        position: absolute;
        background: #393939;
        border: 1px solid #fff;
        border-radius: 10px;
        color: white;
        z-index: 10000;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        .title {
          border-radius: 10px 10px 0 0 ;
          background: #000;
          padding :25px;
          margin-bottom: 10px;
        }
        .input {
          padding: 25px;
          align-items: center;
          text-align: center;
          input {
            width: 70%;
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
            margin-top: 20px;
            width: 48%;
            padding: 5px 0;
            background: #000;
            border: 1px solid #fff;
            border-radius: 5px;
            color:#fff;
          }
        }
        
`;
