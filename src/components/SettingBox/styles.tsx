import styled from '@emotion/styled';

export const SettingBoxCss = styled.div` 
    background: #242424;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 30px;
    margin: 0 0 30px 40px;
    // width: 75px;
    align-items: center;
    @media screen and (max-width:1920px){
      margin: 0 0 0 20px;
    }
    @media screen and (max-width:1280px){
      margin: 0 0 5px 20px;
    }

    .Menuwrapper {
      div {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 40px;
        margin: 28px 13px 0;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        @media screen and (max-width: 1920px) {
        }
        div.icon {
          margin-top: 0px;
          padding: 8px;
          border-radius: 50%;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          border : 1px solid #242424;
          &:hover {
            border: 1px solid #a00000;
            background: #fafafa;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            transition: 0.5s;
          }
          &.active {
            background: #fafafa;
            border: 1px solid #a00000;
            &:hover {
              background: #ccc;
            }
          }
        }
        span.name {
          font-family: Noto Sans;
          width: 100%;
          font-size: 12px;
          font-weight: 700;
          line-height: 12px;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          /* background: white; */
        }
        span.hospital {
          font-family: Noto Sans;
          font-size: 10px;
          font-weight: 400;
          line-height: 15px;
          /* letter-spacing: -0.5em; */
          text-align: center;
        }
        span.settingText {
          font-family: Noto Sans;
          width: 100%;
          font-size: 11px;
          font-weight: 700;
          line-height: 15px;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          /* word-break: break-all; */
          // margin-bottom: 28px;
        }
        span.thumbnailBox{
          font-family: Noto Sans;
          font-size: 11px;
          font-weight: 700;
          line-height: 15px;
          // letter-spacing: -0.5em;
          text-align: center;
          margin-bottom: 28px;
          @media screen and (max-width: 1920px) {
            
          }          
        }
        span.toolBox {
          font-family: Noto Sans;
          font-size: 11px;
          font-weight: 700;
          line-height: 15px;
          text-align: center;
          margin-bottom: 28px;
        }
        span.reportModal {
          font-family: Noto Sans;
          font-size: 11px;
          font-weight: 700;
          line-height: 15px;
          text-align: center;
          margin-bottom: 28px;
        }
        span.comparisonCheck {
          font-family: Noto Sans;
          font-size: 10px;
          font-weight: 700;
          line-height: 15px;
          text-align: center;
          margin-bottom: 28px;
        }
      }
    }
    .Settingwrapper {
      div {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 40px;
        margin: 0 13px 28px;
      }
      .usersetting {
          margin: 0 13px 13px 13px;
          padding: 8px;
          border-radius: 50%;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          border : 1px solid #242424;
          &:hover {
            border: 1px solid #a00000;
            background: #fafafa;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
          }
      }
      .logout {
          margin: 0 13px 28px 13px;
          padding: 8px;
          border-radius: 50%;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          border : 1px solid #242424;
          &:hover {
            border: 1px solid #a00000;
            background: #fafafa;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
          }
      }
    }
`