export default class Glyph {
    constructor(public character: string,
                public htmlEscapedCharacter: string,
                public neofetchEscapedCharacter: string,
                public count: number) {
    }
}