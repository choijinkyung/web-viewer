/**
 * @Filename    :  BadRequestException.js
 * @Author      :  이교헌(hisaishijjo)
 * @Description :  에러 발생시 catch에 error정보 주는 기능 수행
 */


class BadRequestException extends Error {
    _statusCode : number;
    _field : null | HTMLInputElement;
    constructor(msg = '잘못된 요청 입니다', field = null) {
        super(msg);
        this._statusCode = 400;
        this._field = field;
    }
    get statusCode() {
        return this._statusCode;
    }
    get field() {
        return this._field;
    }
    set field(param) {
        this._field = param;
    }
}

export default BadRequestException;