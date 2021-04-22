class Animecontainer extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
        this.attachShadow({mode: 'open'});

        let container = document.createElement('div');
        container.setAttribute('class', "anime");


        let name = document.createElement('p');
        name.setAttribute('class', "title");
        let score = document.createElement('p');
        score.setAttribute('class', "score");
        let airs =  document.createElement('p');
        airs.setAttribute('class', "day-airs")
        let description =  document.createElement('p');
        description.setAttribute('class', "description")
        let image = document.createElement('img');
        image.setAttribute('class', "anime-image");

        let containerBody = document.createElement('div');
        containerBody.setAttribute('class', "anime-body");

        let link =  document.createElement('a');



        containerBody.appendChild(name);
        containerBody.appendChild(score);
        containerBody.appendChild(airs);
        containerBody.appendChild(description);
        link.appendChild(image);
        container.appendChild(link);
        container.appendChild(containerBody);
        

        this.name = name;
        this.score = score;
        this.airs = airs;
        this.description = description;
        this.image = image;
        this.link = link;


        const style = document.createElement('style');
        style.textContent = `
            .anime {
                display: flex;
            }
            .anime-body {
                padding: 1rem;
            }

            .description {
                height: 150px;
                overflow-y: auto;
                padding: 5px;
                border: 2px white solid;
                
            }

            .title {
                font-family: 'Ubuntu', sans-serif;
            }

            @media only screen and (max-width: 530px) {
                .anime {
                    display: flex;
                    flex-wrap: wrap;
                }
              }
        `
        this.shadowRoot.append(style, container);
    }
}
customElements.define('anime-container', Animecontainer);