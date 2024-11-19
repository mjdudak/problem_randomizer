
const url_object = new URL(document.URL);
const save_link = document.querySelector("#save-link");
const tbody = document.querySelector("#output-body");
const template = document.querySelector("#output-row");
let assignment_dict = [];

function randomize_order(set) {
    let currentIndex = set.length;

    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random()*currentIndex);
        currentIndex--;
        [set[currentIndex], set[randomIndex]] = [set[randomIndex], set[currentIndex]];
    }
    return set;
}

function assign_groups(ev) {
    const problems_textbox = document.querySelector("#problems").value;
    let problems = problems_textbox.split(/\r?\n/);
    const groups_textbox = document.querySelector("#groups").value;
    let groups = groups_textbox.split(/\r?\n/);
    assignment_dict = {
        'p': [],
        'g': []
     }
     problems.forEach(function(value, i) {
        if (value.length > 0){
            assignment_dict['p'].push({
                'p': value,
                'n': i
            });
        }
     });
     groups.forEach(function(value, i) {
        if (value.length > 0){
            assignment_dict['g'].push({
                'g': value,
                'n': i
            });
        }
     });
     if (assignment_dict['g'].length > assignment_dict['p'].length) {
        const double_assign = (document.querySelector('input[name="more-groups"]:checked').value == 'multiple-groups');
        const diff = assignment_dict['g'].length - assignment_dict['p'].length;
        if (double_assign) {
            let double_assigned = randomize_order(assignment_dict['p']).slice(0, diff);
            for (let d of double_assigned) {
                const new_p = structuredClone(d);
                assignment_dict['p'].push(new_p);
            }
        }
        else {
            for (let i=0; i<diff; i++) {
                assignment_dict['p'].push({
                    'p': '',
                    'n': problems.length+1
                });
            }
        }
        
    }
    if (assignment_dict['g'].length < assignment_dict['p'].length) {
        const double_assign = (document.querySelector('input[name="more-probs"]:checked').value == 'multiple-problems');
        const diff = assignment_dict['p'].length - assignment_dict['g'].length;
        if (double_assign) {
            let double_assigned = randomize_order(assignment_dict['g']).slice(0, diff);
            for (let d of double_assigned) {
                const new_g = structuredClone(d);
                assignment_dict['g'].push(new_g);
            }
        }
        else {
            for (let i=0; i<diff; i++) {
                assignment_dict['g'].push({
                    'g': '',
                    'n': groups.length+1
                });
            }
        }
    }
    let randomized_problems = randomize_order(assignment_dict['p']);
    assignment_dict['g'].forEach(function (value, i) {
        value['p'] = randomized_problems[i].p;
        randomized_problems[i]['g'] = value.g;
    })
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
    let encoded_dict = btoa(JSON.stringify(assignment_dict));
    save_link.href = url_object.href + "display.html#" + encoded_dict;
}

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

document.querySelector("#output").addEventListener("click", assign_groups);
document.querySelector("#problem-table-header").addEventListener("click", resort_problems);
document.querySelector("#group-table-header").addEventListener("click", resort_groups);
