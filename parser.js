const url_object = new URL(document.URL);
const hash = url_object.hash.substring(1);
const assignment_dict = JSON.parse(atob(hash));
const tbody = document.querySelector("#output-body");
const template = document.querySelector("#output-row");


function resort_problems(ev) {
    assignment_dict['problems'].sort(function(a,b) {
        return a.position - b.position;
    })
    tbody.innerHTML = "";
    for (let p of assignment_dict['problems']) {
        const clone = template.content.cloneNode(true)
        let td = clone.querySelectorAll("td")
        td[0].textContent = p['problem']
        td[1].textContent = p['group']
        tbody.appendChild(clone)
    }
}

function resort_groups(ev) {
    assignment_dict['groups'].sort(function(a,b) {
        return a.position-b.position;
    })
    tbody.innerHTML = "";
    for (let g of assignment_dict['groups']){
        const clone = template.content.cloneNode(true)
        let td = clone.querySelectorAll("td")
        td[0].textContent = g['problem']
        td[1].textContent = g['group']
        tbody.appendChild(clone)
    }
}

resort_problems({});

document.querySelector("#problem-table-header").addEventListener("click", resort_problems);
document.querySelector("#group-table-header").addEventListener("click", resort_groups);


console.log(assignment_dict);
