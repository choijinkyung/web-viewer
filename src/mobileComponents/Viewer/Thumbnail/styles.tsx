import styled from '@emotion/styled';

export const ThumbnailCss = styled.div`
    margin: 0;
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    /* border: 1px solid #fff; */
    .thumbnail{
        /* margin : 5px;         */
        @media screen and (max-width: 1920px) {
            width: 100%;
            height: 100px;  
        }
        .image {
            position: absolute;
            text-align: center;
            z-index: 10000;
            width: 80%;
            height: 100%;
            object-fit: cover;
        } 
        img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            &.w {
                width: 100%;
            }
            &.h {
                height: 100%;
            }
        }
    }
`;