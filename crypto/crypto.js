function allFiltersFalse() {
    let isit = true;
    for (j of Object.values(FILTERS)) {
        for (k of Object.values(j)) {
            if (k) {
                isit = false;
                break;
            }
        }
        if (!isit) break;
    }
    return isit;
}

function individualFiltersFalse(i) {
    let isit = true;
    for (j of Object.values(FILTERS[i])) {
        if (j) {
            isit = false;
            break;
        }
    }
    return isit;
}

function filter(x, y) {
    FILTERS[x][y] = !FILTERS[x][y];
    document.getElementById("f_" + x + "_" + y).classList.toggle("checked");
    search(document.getElementById("searchbarinput").value);
}

function sortUpdate(use) {
    let mdiv = document.getElementById("main");
    switch (use) {
        case "0":
            mdiv.innerHTML = "";
            DEFAULT.forEach(i => mdiv.appendChild(i));
            break;
        case "1":
            let els = Array.from(mdiv.children);
            els.sort((a, b) => {
                const dateA = a.className.match(/added-(\d)+-(\d)+-(\d{4})/);
                const dateB = b.className.match(/added-(\d)+-(\d)+-(\d{4})/);
                const dA = dateA ? new Date(`${dateA[3]}-${dateA[1]}-${dateA[2]}`) : new Date(0);
                const dB = dateB ? new Date(`${dateB[3]}-${dateB[1]}-${dateB[2]}`) : new Date(0);
                if (dB - dA !== 0) return dB - dA;
                const nameA = a.querySelector('h1')?.textContent.trim() || '';
                const nameB = b.querySelector('h1')?.textContent.trim() || '';
                return nameA.localeCompare(nameB);
            });
            mdiv.innerHTML = "";
            els.forEach(i => mdiv.appendChild(i));
            break;
        case "2":
            let els2 = Array.from(mdiv.children);
            els2.sort((a, b) => {
                const nameA = a.querySelector('h1')?.textContent.trim() || '';
                const nameB = b.querySelector('h1')?.textContent.trim() || '';
                return nameA.localeCompare(nameB);
            });
            mdiv.innerHTML = "";
            els2.forEach(i => mdiv.appendChild(i));
            break;
    }
}

let filtercCollapsed = false;
function collapseFilters() {
    let filters = document.getElementById("filters");
    if (!filtercCollapsed) {
        filters.style.height = "calc(3.5vh + 3px)";
        filters.style.gridRow = "span 1";
        filters.style.overflowY = "hidden";
        document.getElementById("collapfilt").style.rotate = "180deg";
        document.getElementById("main").style.gridColumn = "span 2";
    } else {
        filters.style.height = "77.5vh";
        filters.style.gridRow = "span 2";
        filters.style.overflowY = "scroll";
        document.getElementById("collapfilt").style.rotate = "0deg";
        document.getElementById("main").style.gridColumn = "span 1";
    }
    filtercCollapsed = !filtercCollapsed;
}

console.log("list loaded");