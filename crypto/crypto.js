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
    if (FILTERID === "earn5") {
        if (FILTERS["main"]["featured"] || FILTERS["main"]["dividend"]) {
            FILTERS["main"]["ver0"] = false;
            FILTERS["main"]["verm1"] = false;
            document.getElementById("f_main_ver0").classList.remove("checked");
            document.getElementById("f_main_verm1").classList.remove("checked");
            document.getElementById("f_main_ver0").classList.add("disabled");
            document.getElementById("f_main_verm1").classList.add("disabled");
            if (FILTERS["main"]["featured"]) {
                FILTERS["rating"]["high"] = false;
                FILTERS["rating"]["medium"] = false;
                FILTERS["rating"]["low"] = false;
                FILTERS["rating"]["lowest"] = false;
                document.getElementById("f_rating_high").classList.remove("checked");
                document.getElementById("f_rating_medium").classList.remove("checked");
                document.getElementById("f_rating_low").classList.remove("checked");
                document.getElementById("f_rating_lowest").classList.remove("checked");
                document.getElementById("f_rating_high").classList.add("disabled");
                document.getElementById("f_rating_medium").classList.add("disabled");
                document.getElementById("f_rating_low").classList.add("disabled");
                document.getElementById("f_rating_lowest").classList.add("disabled");
            }
        } else {
            document.getElementById("f_main_ver0").classList.remove("disabled");
            document.getElementById("f_main_verm1").classList.remove("disabled");
            document.getElementById("f_rating_high").classList.remove("disabled");
            document.getElementById("f_rating_medium").classList.remove("disabled");
            document.getElementById("f_rating_low").classList.remove("disabled");
            document.getElementById("f_rating_lowest").classList.remove("disabled");
        }
    }
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
                const dateA = a.className.match(/added-(\d{1,2})+-(\d{1,2})+-(\d{4})/);
                const dateB = b.className.match(/added-(\d{1,2})+-(\d{1,2})+-(\d{4})/);
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

let filtercCollapsed = window.visualViewport.width < window.visualViewport.height;
function collapseFilters() {
    let filters = document.getElementById("filters");
    let mobile = window.visualViewport.width < window.visualViewport.height;
    if (!filtercCollapsed) {
        if (mobile) {
            filters.style.height = "7vw";
        } else {
            filters.style.height = "calc(3.5vh + 3px)";
            filters.style.gridRow = "span 1";
            filters.style.overflowY = "hidden";
            document.getElementById("main").style.gridColumn = "span 2";
        }
        document.getElementById("collapfilt").style.rotate = "180deg";
        document.querySelector("main").classList.add("pcmarginfix");
    } else {
        if (mobile) {
            filters.style.height = "fit-content";
        } else {
            filters.style.height = "77.5vh";
            filters.style.gridRow = "span 2";
            filters.style.overflowY = "scroll";
            document.getElementById("main").style.gridColumn = "span 1";
        }
        document.getElementById("collapfilt").style.rotate = "0deg";
        document.querySelector("main").classList.remove("pcmarginfix");
    }
    filtercCollapsed = !filtercCollapsed;
}

function viewTab(id) {
    document.getElementById("tabbutton0").classList.remove("selected");
    document.getElementById("tabbutton1").classList.remove("selected");
    document.getElementById("pctab0").classList.remove("selected");
    document.getElementById("pctab1").classList.remove("selected");
    document.getElementById("tabbutton" + id).classList.add("selected");
    document.getElementById("pctab" + id).classList.add("selected");
}

function mobileTab(tabid) {
    document.getElementById("mobileopentab").innerHTML = document.getElementById("mobiletab" + tabid).outerHTML;
}

console.log("list loaded");