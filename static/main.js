document.getElementById("ALL").addEventListener("click", ()=>{
    window.open("https://myanimelist.net/anime/season");
});

fetch(`${window.location.href}data`)
    .then(response => response.json())
    .then(data => { 
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const row = document.getElementsByClassName("row")[0];
        days.forEach(day => {
            data.forEach(anime => {
                if (anime["day"].startsWith(day)){
                    let component = document.createElement('anime-container');
                    let score = anime["score"].startsWith("N/A") ? "N/A" : anime["score"].slice(0, anime["score"].indexOf(".") + 3);
                    component.setAttribute("class", `col-sm-12 ${day}`);
                    component.link.href = anime["url"];
                    component.link.target = "_blank";
                    component.name.textContent = `Title: ${anime["name"]}`;
                    component.score.textContent = `Score: ${score}`;
                    component.airs.textContent = `Boardcast : ${anime["day"]}`;
                    component.description.textContent = `Synposis : ${anime["description"]}`;
                    component.image.src = `${anime["imageURL"]}`;

                    //use popularity to order the items in the days
                    row.append(component);
                }
            });

            document.getElementById(day).addEventListener('click', ()=>{
                for (const component of document.getElementsByClassName("col-sm-12")) {
                    component.style.display = "none";
                }
                document.getElementsByClassName("col-sm-12")[0].style.display = "block";
                for (const component of document.getElementsByClassName(day)) {
                    component.style.display = "block";
                }
            });
        });
        for (const component of document.getElementsByClassName("col-sm-12")) {
            component.style.display = "none";
        }
        document.getElementsByClassName("col-sm-12")[0].style.display = "block";
        for (const component of document.getElementsByClassName("Sunday")) {
            component.style.display = "block";
        }

    });         