import styled from "@emotion/styled";

export const MainFilter = styled.div`
width: 100%;
    .searchheader {
        color: #fff;
        margin-top: 22px;
        margin-left: 25px;
        @media screen and (max-width:1920px){
            margin-top: 15px;
        }
        @media screen and (max-width: 1280px){
            margin-top: 10px;
            margin-left: 11px;
            font-size: 14px;
        }
    }
    .textfield{
      &.before {
        ::before{
            display:inline-block;
            margin-top: 24px;
            margin-left:10px;
            content:'';
            width:5px;
            height:40px;
            background:#621212;
            @media screen and (max-width:1920px){
              margin-top: 15px;
            }
            @media screen and (max-width: 1280px){
                margin-top: 5px;
                margin-left: 5px;
            }
        }
      }
        :nth-of-type(1){
            ::before{
                margin-left:32px;
                @media screen and (max-width: 1280px){
                    margin-left: 10px;                   
                }
            }
        }
    }
    .selectfield{
      &.before {
        ::before{
            display:inline-block;
            margin-left:10px;
            margin-top:24px;
            content:'';
            width:5px;
            height:40px;
            background:#621212;
            @media screen and (max-width:1920px){
                margin-top: 15px;
              }
            @media screen and (max-width: 1280px){
                margin-top: 5px;
                margin-left: 5px;
              }
        }
      }
      /* > label{
        position: relative;

      } */
      svg {
        color: white;
      }
      > div {
        :hover{
          background-color: #000;
          color:#fff !important;
        }
        ::before{
            display:inline;
            margin-left:0px;
            content:'';
            width:5px;
            height:40px;
            /* background:#621212; */
          }
        > div {
          /* line-height: 32px; */
          color: white;
        }
      }
    }
`;