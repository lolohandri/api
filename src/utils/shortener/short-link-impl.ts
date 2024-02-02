import { IShortLink } from "./short-link.interface";

export class ShortLinkImpl implements IShortLink {
    getShortLink(length: number): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter++;
        }
        return result;
    }

}