import styled from "@emotion/styled";

export const WorklistReportBoxCss = styled.div`
    width: 100vw;
    height: 100%;
    .ReportTextArea{
        height: 100%;
        display: flex;
        flex-direction: column;
        >.comment{
            height: 30%;

            background: #393939;
            padding: 10px;
            color: white;
        }
        >.finding{
            height: 50%;
            background: #393939;
            padding: 10px;
            color: white;
        }
        >.button {
            display: flex;
            justify-content: space-around;
            button {
                margin-top: 5px;
                width: 33%;
                padding: 10px 0;
            }
        }
    }
`;