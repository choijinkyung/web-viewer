import styled from "@emotion/styled";

export const Filter = styled.div`
/**
 유저이름 Box, search Box ,햄버거 button이 있는 Box
*/
/**
달력(calender) 가 포함된 box
*/
// .calender {
//   border: 1px solid red;
//   width: 42.8rem;

//   .react-calendar__tile--now {
//     background: ;
//     color: ;
//   }
//   .react-calendar__tile--now:enabled:hover,
//   .react-calendar__tile--now:enabled:focus {
//     color: ;
//   }
//   .react-calendar__navigation__label > span {
//     font-size: ;
//     font-weight: ;
//     color: ;
//   }
//   .react-calendar__tile {
//     color: ;
//     background: ;
//     text-align: ;
//   }
//   .react-calendar__tile:enabled:hover,
//   .react-calendar__tile:enabled:focus {
//     background-color: ;
//     border-radius: ;
//     color: ;
//   }
// }
/**
 달력(calender) 가 포함된 box
*/
 background: #242424;
 color: white;
 border-radius: 10px;
 display: flex;
 flex-direction: column;
 width: 300px;
 height: 100%;
 padding: 5px;
 margin-left: 12px;
 /**
  달력(calender) 가 포함된 box
*/
@media all and (max-width : 1280px){
  height: calc(100%);
  width: 300px;
};
 .react-calendar {
   width: 100%;
   max-width: 100%;
   background: transparent;
   border: none;
   color: white;
   font-family: Arial, Helvetica, sans-serif;
   line-height: 1.125em;
 }
 .react-calendar--doubleView {
   width: 700px;
 }
 .react-calendar--doubleView .react-calendar__viewContainer {
   display: flex;
   margin: -0.5em;
 }
 .react-calendar--doubleView .react-calendar__viewContainer > * {
   width: 50%;
   margin: 0.5em;
 }
 .react-calendar,
 .react-calendar *,
 .react-calendar *:before,
 .react-calendar *:after {
   -moz-box-sizing: border-box;
   -webkit-box-sizing: border-box;
   box-sizing: border-box;
 }
 .react-calendar button {
   margin: 0;
   border: 0;
   outline: none;
 }
 .react-calendar button:enabled:hover {
   cursor: pointer;
 }
 .react-calendar__navigation {
   display: flex;
   height: 44px;
   margin-bottom: 1em;
 }
 .react-calendar__navigation button {
   min-width: 44px;
   background: none;
   color: #d3d3d3;
 }
 .react-calendar__navigation button:disabled {
   background-color: #f0f0f0;
 }
 .react-calendar__navigation button:enabled:hover,
 .react-calendar__navigation button:enabled:focus {
   background-color: #373737 !important;
 }
 .react-calendar__month-view__weekdays {
   text-align: center;
   text-transform: uppercase;
   font-weight: bold;
   font-size: 0.75em;
 }
 .react-calendar__month-view__weekdays__weekday {
   padding: 0.5em;
 }
 .react-calendar__month-view__weekNumbers .react-calendar__tile {
   display: flex;
   align-items: center;
   justify-content: center;
   font-size: 0.75em;
   font-weight: bold;
 }
 .react-calendar__month-view__days__day--weekend {
   color: #d10000 !important;
 }
 .react-calendar__month-view__days__day--neighboringMonth {
   color: #757575;
 }
 .react-calendar__year-view .react-calendar__tile,
 .react-calendar__decade-view .react-calendar__tile,
 .react-calendar__century-view .react-calendar__tile {
   padding: 2em 0.5em;
 }
 .react-calendar__tile {
   max-width: 100%;
   padding: 10px 6.6667px;
   background: none;
   text-align: center;
   line-height: 16px;
   color:#919191;
 }
 .react-calendar__tile:disabled {
   background-color: #f0f0f0;
 }
 .react-calendar__tile:enabled:hover,
 .react-calendar__tile:enabled:focus {
   background-color: #474747 !important;
   color: white !important;
 }
 .react-calendar__tile--now {
   background: #737373;
   color: white;
   border-radius: 50%;
 }
 .react-calendar__tile--now:enabled:hover,
 .react-calendar__tile--now:enabled:focus {
   background: #ffffa9;
   border-radius: 50%;
 }
 .react-calendar__tile--hasActive {
   background: #76baff;
   border-radius: 50%;
 }
 .react-calendar__tile--hasActive:enabled:hover,
 .react-calendar__tile--hasActive:enabled:focus {
   background: #a9d4ff;
   border-radius: 50%;
 }
 .react-calendar__tile--active {
   background: #737373;
   color: white;
   border-radius:50%;
 }
 .react-calendar__tile--active:enabled:hover,
 .react-calendar__tile--active:enabled:focus {
   background: #1087ff;
 }
  .react-calendar--selectRange .react-calendar__tile--hover {
   background-color: #e6e6e6;

 }
 /**날짜 픽업 Box**/
 .date{
   margin-top:32px;
   width:100%;
   label{
     width: 100%;
     .date-title{
      ::before{
        content: '';
        display: inline-block;
        position:relative;
        top: 4px;
        width:3px;
        height:13px;
        margin-right:5px;
        background: #a00000;
      }
       display: block;
       width: 100%;
       height: 16px;
       margin-left: 10px;
       margin-bottom: 10px;
       font-weight: 700;
       font-size: 12px;
     }
     .date-select{
       width: 100%;
       .date-start{
         width: 40%;
         height: 28px;
         font-size: 12px;
         margin-left: 10px;
         line-height: 14px;         
         background: #171717;
         color:#fff;
         border-radius: 25px;
         border:none;
         padding-left:10px;
         padding-right: 10px;
         ::-webkit-calendar-picker-indicator {
          filter: invert(1);
         }
         @media screen and (max-width: 1280px){
          width: 90%;
         }
       }
       span {
         display:inline-block;
         width:11%;
         text-align:center;
         @media screen and (max-width: 1280px){
          width: 90%;
         }
       }
       .date-end{
         width: 40%;
         height: 28px;
         font-size: 12px;
         margin-right: 10px;
         line-height: 14px;
         background: #171717;
         color:#fff;
         border-radius: 25px;
         border: none;
         padding-left:10px;
         padding-right: 10px;
         ::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
        @media screen and (max-width: 1280px){
          margin-left: 10px;
          width: 90%;
         }
       }
     }        
   }
 }
 /**Modality select**/
 .modality{
   margin-top: 32px;
   width: 100%;
   height: 52px;
   label{
     width:100%;
     .modality-title{
      ::before{
        content: '';
        display: inline-block;
        position:relative;
        top: 4px;
        width:3px;
        height:13px;
        margin-right:5px;
        background: #a00000;
      }
       width: 100%;
       height: 16px;
       margin-left: 10px;
       font-weight: 700;
       font-size: 12px;
       line-height: 16px;
     }
     select {
       background-color: #171717;
       color: white;
       margin-top: 10px;
       margin-left: 10px;
       border-radius: 36px;
       width: calc(100% - 20px);
       height: 28px;
       padding: 0px 10px;
       border: 0px;
       outline: none;
       font-weight: 400;
       font-size: 10px;
     }
   }
 }
 /**Verify select**/
 .verify{
   margin-top: 32px;
   width: 100%;
   height: 52px;
   label{
     width:100%;
     .verify-title{
      ::before{
        content: '';
        display: inline-block;
        position:relative;
        top: 4px;
        width:3px;
        height:13px;
        margin-right:5px;
        background: #a00000;
      }
       width: 100%;
       height: 16px;
       margin-left: 10px;
       font-weight: 700;
       font-size: 12px;
       line-height: 16px;
     }
     select {
       background-color: #171717;
       color: white;
       margin-top: 10px;
       margin-left: 10px;
       border-radius: 36px;
       width: calc(100% - 20px);
       height: 28px;
       padding: 0px 10px;
       border: 0px;
       outline: none;
       font-weight: 400;
       font-size: 10px;
     }
   }
 }
`