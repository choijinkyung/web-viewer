import styled from '@emotion/styled';

export const ModifyUserModalCss = styled.div`
        position: absolute;
        /* padding: 12px; */
        width: 20%;
        /* height: 40%; */
        background: #242424;
        border:2px solid #ffffff;
        border-radius: 20px;
        box-shadow: 24px;
        z-index: 10000;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);

        .ModifyUserTitle{

            display:flex;
            flex-direction: row;
            justify-items: center;
            justify-content: center;
            align-items: center;
            height: 3em;
            border: 0px;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            border-bottom : 1px solid #ffffff;
            color: white;
            background-color: #393939;
            font-size: 1.25rem;
        }

        .ModifyUserButton{
                display:flex;
                flex-direction: row;
                justify-content: end;
                margin-bottom: 12px;
                margin-right: 12px;
        }

`;