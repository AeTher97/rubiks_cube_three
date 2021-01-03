export const showPopup = (time) => {
    const name = prompt(`Time scored ${(time / 1000).toFixed(2)} s`, "");
    if (name !== null && name !== "") {
        console.log(name);
        saveName(name, time);
    }
}

export const saveName = (name, time) => {
    const results = localStorage.getItem("results");
    if (results == null) {
        const newResults = [{
            time: time,
            name: name
        }]
        localStorage.setItem("results", JSON.stringify(newResults));
    } else {
        const array = JSON.parse(results);
        array.push({
            time: time,
            name: name
        })
        array.sort((a, b) => {
            return a.time - b.time;
        })

        localStorage.setItem("results", JSON.stringify(array));
    }
}

export const showResults = () => {
    const holder = document.getElementById("results");
    const results = localStorage.getItem("results");
    while (holder.firstChild) {
        holder.removeChild(holder.firstChild);
    }

    holder.innerText = "Results:"

    if (results) {
        const array = JSON.parse(results);
        for (let i = 0; i < array.length; i++) {
            if (i === 15) {
                break;
            }
            const div = document.createElement("div")
            div.textContent = `${i + 1}. ${array[i].name} ${(array[i].time / 1000).toFixed(2)} s`;
            holder.appendChild(div);
        }
    }
}
