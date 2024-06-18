import styled from '@emotion/styled';

export const ViewerMenuCss = styled.div`
  width: 15%;
  padding: 0;
  margin-right: 12px;
  height: 100%;
  /* border: 1px solid white; */
  border-radius: 10px;
  text-align: center;
  color: white;
  box-sizing: border-box;
  background: #242424;

  .menuTitle{
    padding: 10px 0;
    display: block;
    font-size: 1.2em;
    font-weight: bold;
    background: #242424;
    color: white;
    text-align: center;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    /* border: 1px solid #fff; */
  }
  select{
    width: 100%;
    padding: 5px 0;
    color: white;
    background: #000;
  }
  .thumbnailTable{
    background:#242424;
    @media screen and (max-width:1920px){
      /* height: calc(100% - 60px);       */
    }
    /* overflow: auto; */
    ::-webkit-scrollbar {
            display:none;
          }
    border-bottom: 0px; 
    .thumbnailTitle{
      padding: 10px 0;
      font-size: 1.2em;
      font-weight: bold;
      background: #242424;
      color: white;
      text-align: center;
    }

    .thumbnailBox {
      height: 100%;
      ::-webkit-scrollbar {
            display:none;
        /* width: 5px; */
      }
      /* ::-webkit-scrollbar-track {
        :hover{
          ::-webkit-scrollbar-thumb{
            background: rgba(255, 255, 255, 1);
            transition-delay: 0.2s;
          }
        }
        display:none;
      }
      ::-webkit-scrollbar-thumb {
        background: #f1f1f1;
        opacity: 0.1;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 25px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.1);
        transition-delay: 2s;
      } */
      overflow: scroll;
      box-sizing: border-box;
      text-align: left;
      font-size: 0.8em;
      .thumbnailParent{
        height: 150px;
        display: flex;
        flex-direction: column;
        padding: 1px;
        background: #181818;
        border : 1px solid #484848;
        color: #dedede;
        &:hover {
          background: #484848;
          border: 1px solid #787878;
        }
        &.active-thumbnail{
          background: #484848;
          border: 1px solid #dedede;
        }
        .textBox {
          p {
            overflow: hidden;
          }
        }
      }
    }
  }
`;
