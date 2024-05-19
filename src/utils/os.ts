let eol: string | undefined;

export function getEOL() {
    if (eol) {
        return eol;
    }

    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('win')) {
        eol = '\r\n';
    } else if (userAgent.includes('mac')) {
        eol = '\r';
    } else {
        eol = '\n';
    }

    return eol;
}