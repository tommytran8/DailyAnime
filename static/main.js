document.getElementById("MAL").addEventListener("click", ()=>{
    window.open("https://myanimelist.net/anime/season");
});

document.getElementById("search").addEventListener("click", ()=>{
    document.getElementById("ALL").click();
});

document.getElementById("search").addEventListener("change", (inp)=>{
    console.log(document.getElementById("search").innerText);
})

fetch(`${window.location.href}data`)
    .then(response => response.json())
    .then(data => { 
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "ALL"]
        const row = document.getElementsByClassName("row")[0];
        
        data.forEach(anime => {
            let component = document.createElement('anime-container');
            let score = anime["score"].startsWith("N/A") ? "N/A" : anime["score"].slice(0, anime["score"].indexOf(".") + 3);
            component.setAttribute("class", `col-sm-12 ${anime["day"].slice(0, anime["day"].indexOf("y") + 1)}`);
            component.setAttribute("id", anime["name"]);
            component.link.href = anime["url"];
            component.link.target = "_blank";
            component.name.textContent = `Title: ${anime["name"]}`;
            component.score.textContent = `Score: ${score}`;
            component.airs.textContent = `Boardcast : ${anime["day"]}`;
            component.description.textContent = `Synposis : ${anime["description"]}`;
            component.image.src = `${anime["imageURL"]}`;

            //uses popularity to order the items in the days
            row.append(component);

        });
        days.forEach(day => {
            document.getElementById(day).addEventListener('click', ()=>{
                if (day == "ALL") {
                    // make all anime visible
                    for (const component of document.getElementsByClassName("col-sm-12")) {
                        component.style.display = "block";
                    }
                }
                else {
                    // make all anime not visible
                    for (const component of document.getElementsByClassName("col-sm-12")) {
                        component.style.display = "none";
                    }
                    // makes nav bar visible
                    document.getElementsByClassName("col-sm-12")[0].style.display = "block";
                    // makes anime wuth class <day> visible
                    for (const component of document.getElementsByClassName(day)) {
                        component.style.display = "block";
                    }
                }
            });
        });
        const today = new Date();
        document.getElementById(`${days[today.getDay()]}`).click();
    });         