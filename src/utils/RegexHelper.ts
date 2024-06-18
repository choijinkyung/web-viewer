// import BadRequestException from "./BadRequestException";


// /**
//  * @filename    : RegexHelper.js
//  * @author      : 이교헌
//  * @description : 정규표현식 검사 수행
//  */

// class RegexHelper {

//     /**
//      * 값의 존재 여부를 검사한다.
//      * @param {*} field  검사할 대상에 대한 input 요소의 dom 객체
//      * @param {*} msg    값이 없을 경우 표시할 메세지 내용
//      * @returns 
//      */
//     value(field:string,msg:string) {

//         if (field === undefined || field === null || (typeof field === 'string' && field.trim().length === 0)){
//         throw new BadRequestException(msg);
//         }
//         return true;
//     }
//     /**
//      * 입력값이 지정된 글자수를 초과했는지 검사한다.
//      * @param {*} field     검사할 대상에 대한 input 요소의 dom 객체
//      * @param {*} len       최대 글자수
//      * @param {*} msg       값이 없을 경우 표시할 메세지 내용
//      * @returns 
//      */
//     maxLength(field:string,len:number,msg:string) {
//         this.value(field,msg);

//         if (field.trim().length > len) {
//             throw new BadRequestException(msg);
//         }
//         return true;
//     }

//     /**
//      * 입력값이 지정된 글자수 미만인지 검사한다
//      * @param {*} field     검사할 대상에 대한 input 요소의 dom 객체
//      * @param {*} len       최소 글자수
//      * @param {*} msg       값이 없을 경우 표시할 메세지 내용
//      * @returns 
//      */
//     minLength(field:string,len:number,msg:string) {
//         this.value(field,msg);

//         if (field.trim().length < len) {
//             throw new BadRequestException(msg);
//         }
//         return true;
//     }
//     /**
//      * 두 값이 동일한지 검사한다
//      * @param {*} origin  검사를위한 원본
//      * @param {*} compare 원본값과 비교할 검사대상 
//      * @param {*} msg     검사에 실패할 경우 표시할 메세지
//      * @returns 
//      */
//     compareTo(origin:string,compare:string,msg:string) {
//         this.value(origin,msg);
//         this.value(compare,msg);

//         var src = origin.trim();
//         var dsc = compare.trim();

//         if (src !== dsc) {
//             throw new BadRequestException(msg);
//         }
//         return true;
//     }

//     /**
//      * 라이오나 체크박스가 선택된 항목인지 확인한다
//      * @param {*} field 검사할 대상에 대한 input 요소의 dom 객체
//      * @param {*} msg   검사에 실패할 경우 표시할 메세지
//      */
//     check(field:string,msg:string) {
        
//         const checkedItem = Array.from(field).filter((v:any, i)=> v.checked)
        

//         if (checkedItem.length === 0) {
//             throw new BadRequestException(msg,field[0]);
//         }
//     }
//     /**
//      * 라이오나 체크박스의 최소 선택 갯수를 제한한다.
//      * @param {*} field 검사할 대상에 대한 input 요소의 dom 객체
//      * @param {*} len   최초갯수설정값
//      * @param {*} msg   검사에 실패할 경우 표시할 메세지
//      */
//     checkMin(field:string,len:number,msg:string) {
        
//         const checkedItem = Array.from(field).filter((v:any,i)=> v.checked);

//         if (checkedItem.length < len) {
//             throw new BadRequestException(msg,field[0]);
//         }
//     }
//     /**
//      * 라이오나 체크박스의 최대 선택 갯수를 제한한다.
//      * @param {*} field 검사할 대상에 대한 input 요소의 dom 객체
//      * @param {*} len   최대 갯수 설정값
//      * @param {*} msg   검사에 실패할 경우 표시할 메세지
//      */
//     checkMax(field,len,msg:string) {
        
//         const checkedItem = Array.from(field).filter((v,i)=> v.checked);

//         if (checkedItem.length > len) {
//             throw new BadRequestException(msg,field[0]);
//         }
//     }

//     /**
//      * 입력값이 정규표현식을 충족하는지 검사한다
//      * @param {*} field  검사할 대상에 대한 input 요소의 dom 객체
//      * @param {*} msg    검사에 실패할 경우 표시할 메세지
//      * @param {*} regexExpr 검사할 정규표현식
//      * @returns 
//      */
//     field(field,msg:string,regexExpr:any) {
//         this.value(field,msg);

        
//         const src = field.trim();

//         if (!regexExpr.test(src)) {
//             throw new BadRequestException(msg,field);
//         }
//         return true;
//     }

//     /**
//      * 숫자로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출
//      * @param {*} field 검사할 대상에 대한 input 요소의 dom 객체
//      * @param {*} msg   검사에 실패할 경우 표시할 메세지
//      * @returns 
//      */
//     num(field,msg:string) {
//         return this.field(field,msg,/^[0-9]*$/);
//     }
//     /**
//      * 영문으로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출
//      * @param {*} field 검사할 대상에 대한 input 요소의 dom 객체
//      * @param {*} msg   검사에 실패할 경우 표시할 메세지
//      * @returns 
//      */
//     eng(field,msg:string) {
//         return this.field(field,msg,/^[a-zA-Z]*$/);
//     }
//     /**
//      * 한글로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출
//      * @param {*} field 검사할 대상에 대한 input 요소의 dom 객체
//      * @param {*} msg   검사에 실패할 경우 표시할 메세지
//      * @returns 
//      */
//     kor(field,msg:string) {
//         return this.field(field,msg,/^[ㄱ-ㅎ가-힣]*$/);
//     }
//     /**
//      * 영문과 숫자로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출
//      * @param {*} field 검사할 대상에 대한 input 요소의 dom 객체
//      * @param {*} msg   검사에 실패할 경우 표시할 메세지
//      * @returns 
//      */
//     engNum(field,msg:string) {
//         return this.field(field,msg,/^[a-zA-Z0-9]*$/);
//     }
//     /**
//      * 한글과 숫자로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출
//      * @param {*} field 검사할 대상에 대한 input 요소의 dom 객체
//      * @param {*} msg   검사에 실패할 경우 표시할 메세지
//      * @returns 
//      */
//     korNUm(field,msg:string) {
//         return this.field(field,msg,/^[ㄱ-ㅎ가-힣0-9]*$/);
//     }
//     /**
//      * @Description test받을값이 한글or영어 대문자,소문자로되어있는지 확인하는 정규표현식
//      */
//     korEng(field, msg:string) {
//         return this.field(field,msg, /^[ㄱ-ㅎ가-힣a-zA-Z]*$/);
//     }
//     /**
//      * 이메일주소 형식인지 검사하기 위해 field()를 간접적으로 호출
//      * @param {*} field 검사할 대상에 대한 input 요소의 dom 객체
//      * @param {*} msg   검사에 실패할 경우 표시할 메세지
//      * @returns 
//      */
//     email(field,msg:string) {
//         return this.field(field,msg,/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i);
//     }
//     /**
//      * 핸드폰 번호 형식인지 검사하기 위해 field()를 간접적으로 호출
//      * @param {*} field 검사할 대상에 대한 input 요소의 dom 객체
//      * @param {*} msg   검사에 실패할 경우 표시할 메세지
//      * @returns 
//      */
//     cellphone(field,msg:string) {
//         return this.field(field,msg,/^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/);
//     }
//     /**
//      * 집전화 형식인지 검사하기 위해 field()를 간접적으로 호출
//      * @param {*} field 검사할 대상에 대한 input 요소의 dom 객체
//      * @param {*} msg   검사에 실패할 경우 표시할 메세지
//      * @returns 
//      */
//     telphone(field,msg:string) {
//         return this.field(field,msg,/^\d{2,3}\d{3,4}\d{4}$/);
//     }
//     /**
//      * 핸드폰 형식과 집전화 형식 둘중 하나를 충족하는지 검사
//      * @param {*} field 검사할 대상에 대한 input 요소의 dom 객체
//      * @param {*} msg   검사에 실패할 경우 표시할 메세지
//      * @returns 
//      */
//     phone(field,msg:string) {
//         this.value(field,msg);

//         const content = field.value.trim();
//         var check1 = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
//         var check2 = /^\d{2,3}\d{3,4}\d{4}$/;

//         if (!check1.test(content) && !check2.test(content)) {
//             throw new BadRequestException(msg,field);
//         }
//         return true;
//     }    
// }

// export default new RegexHelper();