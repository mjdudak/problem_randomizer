const url_object = new URL(document.URL);
const hash = url_object.hash.substring(1);
const assignment_dict = JSON.parse(atob(hash));
const tbody = document.querySelector("#output-body");
const template = document.querySelector("#output-row");


function resort_problems(ev) {
    assignment_dict['p'].sort(function(a,b) {
        return a.n - b.n;
    })
    tbody.innerHTML = "";
    for (let p of assignment_dict['p']) {
        const clone = template.content.cloneNode(true)
        let td = clone.querySelectorAll("td")
        td[0].textContent = p['p']
        td[1].textContent = p['g']
        tbody.appendChild(clone)
    }
}

function resort_groups(ev) {
    assignment_dict['g'].sort(function(a,b) {
        return a.n-b.n;
    })
    tbody.innerHTML = "";
    for (let g of assignment_dict['g']){
        const clone = template.content.cloneNode(true)
        let td = clone.querySelectorAll("td")
        td[0].textContent = g['p']
        td[1].textContent = g['g']
        tbody.appendChild(clone)
    }
}

resort_problems({});

document.querySelector("#problem-table-header").addEventListener("click", resort_problems);
document.querySelector("#group-table-header").addEventListener("click", resort_groups);


console.log(assignment_dict);
