const jwt = require("jsonwebtoken")
export function generateId(x: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';

    for (let i = 0; i < x; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        id += chars[randomIndex];
    }

    return id;
}

export function generateJWTToken(payload: any): string {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

    return token;
}

export function decodeJWTToken(token: string): any {
    const decoded = jwt.verify(token, "acnasjcnasjcnejfn3r823923r900239funcajsc");

    return decoded;
}