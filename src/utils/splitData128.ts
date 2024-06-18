export function splitData128(x : any) {
    let a = x
    let aa = Array.from(x);
    let b = Math.ceil(a.length/127)

    let c = [];


    for (let i=0; i < b; i++) {
        const d = aa.splice(0,127);
        c.push(d.join(''))
    }

    return c;
}