import styled from '@emotion/styled';

export const WorklistSearchCss = styled.div`
  margin-top: 10px;
  margin-bottom: 15px;
  width: 100vw;
  height: auto;
  display: flex;
  flex-direction: column;
  .normalSearch {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    form {
      height: 100%;
      width: 70%;
      display: flex;
      justify-content: space-between;
      position: relative;
      > input {
        height: 100%;
        width: 100%;
        padding: 10px 10px;
        border-radius: 15px;
      }
      button {
        border: none;
        background: none;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translate(0, -50%);
      }
    }
    > button {
      width: 25%;
      border-radius: 15px;
      /* Flexbox 설정 */
      display: flex;
      align-items: center; /* 수직 중앙 정렬 */
      justify-content: center; /* 수평 중앙 정렬 (필요한 경우) */
      /* 버튼의 기타 스타일 */
      cursor: pointer;
      font-size: 14px; /* 텍스트 크기 */
      svg {
        font-size: 20px; /* 아이콘 크기 */
        margin-left: 5px; /* 텍스트와 아이콘 사이의 간격 */
        color: #a00000; /* 아이콘 색상 */
      }
    }
  }
  .detailSearch {
    width: 100%;
    height: auto;
    padding: 10px 10px 0 10px;
    .first {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      form {
        width: 50%;
        input {
          height: 100%;
          width: 100%;
          padding: 10px 10px;
          border-radius: 15px;
        }
      }
      select {
        height: 100%;
        width: 24%;
        padding: 10px 10px;
        border-radius: 15px;
      }
    }
    .second {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      input {
        height: auto;
        width: 28%;
        padding: 10px 10px;
        border-radius: 15px;
      }
      span {
        color: white;
      }
      button {
        height: auto;
        width: 19%;
        padding: 10px 10px;
        border-radius: 15px;
      }
    }
  }
`;
