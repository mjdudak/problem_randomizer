
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
        'problems': [],
        'groups': []
     }
     problems.forEach(function(value, i) {
        if (value.length > 0){
            assignment_dict['problems'].push({
                'problem': value,
                'position': i
            });
        }
     });
     groups.forEach(function(value, i) {
        if (value.length > 0){
            assignment_dict['groups'].push({
                'group': value,
                'position': i
            });
        }
     });
     if (assignment_dict['groups'].length > assignment_dict['problems'].length) {
        const double_assign = (document.querySelector('input[name="more-groups"]:checked').value == 'multiple-groups');
        const diff = assignment_dict['groups'].length - assignment_dict['problems'].length;
        if (double_assign) {
            let double_assigned = randomize_order(assignment_dict['problems']).slice(0, diff);
            for (let d of double_assigned) {
                assignment_dict['problems'].push(d);
            }
        }
        else {
            for (let i=0; i<diff; i++) {
                assignment_dict['problems'].push({
                    'problem': '',
                    'position': problems.length+1
                });
            }
        }
        
    }
    if (assignment_dict['groups'].length < assignment_dict['problems'].length) {
        const double_assign = (document.querySelector('input[name="more-probs"]:checked').value == 'multiple-problems');
        const diff = assignment_dict['problems'].length - assignment_dict['groups'].length;
        if (double_assign) {
            let double_assigned = randomize_order(assignment_dict['groups']).slice(0, diff);
            for (let d of double_assigned) {
                assignment_dict['groups'].push(d);
            }
        }
        else {
            for (let i=0; i<diff; i++) {
                assignment_dict['groups'].push({
                    'group': '',
                    'position': groups.length+1
                });
            }
        }
    }
    let randomized_problems = randomize_order(assignment_dict['problems']);
    assignment_dict['groups'].forEach(function (value, i) {
        value['problem'] = randomized_problems[i].problem;
        randomized_problems[i]['group'] = value.group;
    })
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
    let encoded_dict = btoa(JSON.stringify(assignment_dict));
    save_link.href = url_object.origin + "/display.html#" + encoded_dict;
}

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

document.querySelector("#output").addEventListener("click", assign_groups);
document.querySelector("#problem-table-header").addEventListener("click", resort_problems);
document.querySelector("#group-table-header").addEventListener("click", resort_groups);