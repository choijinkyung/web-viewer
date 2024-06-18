import styled from '@emotion/styled';

export const ViewerMenuCss = styled.div`
  width: 100%;
  padding: 0;
  margin-right: 12px;
  height: 20%;
  /* border: 1px solid white; */
  border-radius: 10px;
  text-align: center;
  color: white;
  box-sizing: border-box;
  background: #242424;
  .thumbnailTable{
    background:#242424;
    border-bottom: 0px; 
    height: 100%;
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
      overflow: scroll;
      box-sizing: border-box;
      text-align: left;
      font-size: 0.8em;
      display: flex;
      .thumbnailParent{
        height: 100%;
        width: 100px;
        margin: 0 5px ;
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
