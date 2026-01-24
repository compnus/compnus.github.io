export function rndm(min: number, max: number, step: number): number {
    if (min > max) {
        const t = min;
        min = max;
        max = t;
    }

    const getDecimals = (v: number) => {
        const s = String(v);
        if (s.toLowerCase().includes("e")) {
            const match = s.match(/(?:\.(\d+))?e([+-]?\d+)$/i);
            if (!match) return 0;
            const fracLen = match[1] ? match[1].length : 0;
            const exp = parseInt(match[2], 10);
            return Math.max(0, fracLen - exp);
        }
        return (s.split(".")[1] || "").length;
    };

    const decimals = Math.max(getDecimals(min), getDecimals(max), getDecimals(step));
    const factor = Math.pow(10, decimals);

    const minInt = Math.round(min * factor);
    const maxInt = Math.round(max * factor);
    const stepInt = Math.round(step * factor);

    const maxSteps = Math.floor((maxInt - minInt) / stepInt);
    if (maxSteps < 0) return parseFloat((min).toFixed(decimals));

    const stepIndex = Math.floor(Math.random() * (maxSteps + 1));
    const valueInt = minInt + stepIndex * stepInt;

    return parseFloat((valueInt / factor).toFixed(decimals));
}