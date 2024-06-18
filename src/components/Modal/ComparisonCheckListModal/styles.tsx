import styled from '@emotion/styled';

export const ComparisonCheckListModalCss = styled.div`
  width: 50%;
  height: 70%;
  position: absolute;
  z-index: 1000000;
  top: 15%;
  left: 25%;
  border: 2px solid #ffffff;
  border-radius: 20px;
  box-shadow: 24px;
  background-color: #242424;
  padding: 15px;
  @media screen and (max-width: 1920px){
    width: 70%;
    left: 15%;
  }
  @media screen and (max-width: 1280px){
    width: 90%;
    height: 90%;
    left: 5%;
    top: 5%;
  }
  .textfield{
        ::before{
            display:inline-block;
            margin-top: 24px;
            margin-left:10px;
            content:'';
            width:5px;
            height:40px;
            background:#621212;
        }
        :nth-of-type(1){
            ::before{
                margin-left:32px;
            }
        }
    }
  .selectfield{
      ::before{
          display:inline-block;
          margin-left:10px;
          margin-top:24px;
          content:'';
          width:5px;
          height:40px;
          background:#621212;
      }
      &.Mui-focused {
        border-color: white;
      }
      .select {
        color: white;
        border-color: white;
        svg {
          color: white;
        }
      }
      > div {
        :focus{
          background-color: #000;
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
          color: #ffffff;
        }
      }
    }
  h2 {
    color: white;
    margin:0;
    @media screen and (max-height: 1280px){
      font-size: 16px;
    }
  }
  .comparisontable{
    ::-webkit-scrollbar {
      display:none;
    }
    overflow: auto;
    height: 45%;
    table {
      width: 100%;
      box-sizing: border-box;
      overflow: scroll;
      thead{
        th {
          background: black;
          color: white;
          border: 2px solid #242424;
          padding: 8px 5px;
          /* padding: 5px 12px; */
        }
      }
      tbody {
        tr {
          text-align: center;
          color: #cecece;
          :nth-of-type(2n-1) {
            background:#393939;
          }
          :nth-of-type(2n){
            background:#2f2f2f;
          }
          &:hover {
            background: #959595;
            color: black;
            transition: all 0.1s ease-in;
          }
          td {
            color: #cecece;
            overflow: hidden;
            padding: 8px 5px;
            &:nth-of-type(1){
              text-align: left;
              padding-left: 12px;
            }
            &:nth-of-type(3) {
              text-align: left;
            }
            border: 2px solid #242424;
          }
        }
      }
    }  
  }
     
  .comparisonPreviousTable{
    ::-webkit-scrollbar {
      display:none;
    }
    overflow: auto;
    height: 45%;
    max-height: calc(45% - 70px);
    table {
      width: 100%;
      box-sizing: border-box;
      overflow: scroll;
      thead{
        th {
          background: black;
          color: white;
          border: 2px solid #242424;
          padding: 8px 5px;
          /* padding: 5px 12px; */
        }
      }
      tbody {
        tr {
          text-align: center;
          color: #cecece;
          :nth-of-type(2n-1) {
            background:#393939;
          }
          :nth-of-type(2n){
            background:#2f2f2f;
          }
          &:hover {
            background: #959595;
            color: black;
            transition: all 0.1s ease-in;
          }
          td {
            color: #cecece;
            overflow: hidden;
            padding: 8px 5px;
            &:nth-of-type(1){
              text-align: left;
              padding-left: 12px;
            }
            &:nth-of-type(3) {
              text-align: left;
            }
            border: 2px solid #242424;
          }
        }
      }
    }
  }
  /* button {
    margin-top:20px;
    margin-right: 10px;
    padding: 10px 20px;
    font-weight: bold;
  } */
`;
