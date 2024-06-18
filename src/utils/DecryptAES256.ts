import CryptoJS from 'crypto-js';
/**
 * //aes256 으로 암호화된 텍스트를 복호화하는 함수
 * @param text aes로 암호화되어 있는 텍스트
 */
const DecryptAES256 = (text: string) => {
    let secretKey,bytes,originalText :any;
    try {

        secretKey = process.env.REACT_APP_AES_SECRET as string;
        bytes = CryptoJS.AES.decrypt(text, secretKey);
        originalText = bytes.toString(CryptoJS.enc.Utf8);
    }
    catch(error) {
        console.log (error)
        // localStorage.clear()
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        alert("Please Log in Again!")
    }
    return originalText.replace(/\"/gi, "")

}
export default DecryptAES256;
