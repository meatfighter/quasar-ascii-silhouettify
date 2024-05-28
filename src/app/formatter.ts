import { getHtmlColors } from 'src/app/colors';
import ColoredGlyphs from 'src/types/coloredGlyphs';
import { getGlyphInfo } from 'src/types/glyphInfo';
import { getEOL } from 'src/utils/os';

const { glyphs } = getGlyphInfo();

export function toHtml(coloredGlyphsArray: ColoredGlyphs[], title: string, fontSize: number, lineHeight: number) {
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

    for (let i = 0; i < coloredGlyphsArray.length; ++i) {
        const coloredGlyphs = coloredGlyphsArray[i];
        if (coloredGlyphs.color && (i === 0 || coloredGlyphsArray[i - 1].colorIndex !== coloredGlyphs.colorIndex)) {
            html += `<span style="color: #${htmlColors[coloredGlyphs.colorIndex]};">`;
        }
        coloredGlyphs.glyphIndices.forEach(index => html += glyphs[index].htmlEscapedCharacter);
        if (coloredGlyphs.endOfLine) {
            html += getEOL();
        }
        if (coloredGlyphs.color && (i === coloredGlyphsArray.length - 1
                || coloredGlyphs.colorIndex !== coloredGlyphsArray[i + 1].colorIndex)) {
            html += '</span>';
        }
    }

    html += `    </pre>   
</body>
</html>`

    return html;
}