import styled from "@emotion/styled";

export const MobileSigninCss = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .content{
        width: 70%;
        height: 50%;
        .inputBox{ 
            width: 100%;
            margin-top: 40px;
            display: flex;
            flex-direction: column;
            input {
                border: none;
                border-radius: 20px;
                font-size: 16px;
                padding: 15px;
                margin-bottom: 20px;
                &:focus {
                    border: 1px solid blue;
                }
            }
        }
        button {
            background-color: #dd322f;
            color: white;
            width: 100%;
            padding: 15px;
            border-radius: 20px;
            font-size: 16px;
            box-shadow: none;
            border: 1px solid #dd322f;
        }
    }
`;