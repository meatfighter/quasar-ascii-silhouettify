import { getHtmlColors } from 'src/app/colors';
import { EOL, getGlyphInfo } from 'src/app/glyphs';
import { getEOL } from 'src/utils/os';

export class Ascii {
    constructor(public imageStateId: string,
                public id: string,
                public coloredGlyphs: ColoredGlyphs[],
                public matched: number) {
    }
}

export class ColoredGlyphs {

    glyphIndices: Uint8Array;

    constructor(glyphIndices: number[],
                public colorIndex: number) {
        this.glyphIndices = new Uint8Array(glyphIndices);
    }
}

async function toHtml(coloredGlyphs: ColoredGlyphs[], title: string, fontSize: number, lineHeight: number) {
    const { glyphs } = await getGlyphInfo();
    const htmlColors = getHtmlColors();

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#0C0C0C">
    <meta name="date" content="${new Date().toISOString()}" scheme="YYYY-MM-DDTHH:mm:ssZ">
    <link href="https://fonts.cdnfonts.com/css/cascadia-code" rel="stylesheet">
    <title>${title}</title>   
    <style>
      html, body {
        background: #0C0C0C;
        color: #CCCCCC;
        text-align: center;
      }
      pre {
        font-family: 'Cascadia Code', sans-serif;
        font-size: ${fontSize}pt; 
        line-height: ${lineHeight};
      }        
    </style>    
</head>
<body>
    <pre>`;

    coloredGlyphs.forEach(segment => {
        if (segment.colorIndex >= 0) {
            html += `<span style="color: #${htmlColors[segment.colorIndex]};">`;
        }
        segment.glyphIndices.forEach(index => html += (index === EOL) ? getEOL() : glyphs[index].htmlEscapedCharacter);
        if (segment.colorIndex >= 0) {
            html += '</span>';
        }
    })

    html += `    </pre>   
</body>
</html>`

    return html;
}

console.log(toHtml([], '', 0, 0)); // TODO REMOVE