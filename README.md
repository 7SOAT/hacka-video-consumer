<h1 align="center"> ⚙️ Hackathon - Video Consumer</h1>

<h2 id="quality-gate"> 📃 Descrição </h2>

<p align="justify">
  Responsável por realizar a extração dos frames do vídeo e armazenar o arquivo compactado.
</p>

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

<h2>🏗️ Estrutura do projeto</h2>

```
devops
├── docker
└── k8s
src
├── core
|   ├── entities
|   ├── utils
├── infra
|   ├── aws
|   ├── repositories
|   ├── services
└── main.ts
```

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

<h2 id="requisitos"> ⚙️ Rodando o projeto</h2>

<ol start="1">
  <li>
    <h3>Clonando o repositório</h3>

    git clone https://github.com/7SOAT/hacka-video-consumer.git
    cd hacka-video-consumer
  </li>
  <li>
    <h3>Instalar bibliotecas</h3>
    <p>Para instalar as bibliotecas, abra o terminal na raiz do projeto e execute o seguinte comando:</p>

    npm install
  </li>
  <li>
    <h3> Rodar instâncias no Docker 🚢</h3>
    <p>No terminal rode o seguinte código:</p>
    <p> - Para windows:</p>

      docker build -t hacka-video-consumer-latest -f devops/docker/dockerfile .

   <p> - Para Linux/macOS</p>

     sudo docker build -t hacka-video-consumer-latest -f devops/docker/dockerfile .


  <li>
    <h3>Testar aplicação</h3>
    <p>Execute o seguinte comando para fazer os testes com coverage do microsserviço:</p>

    npm run test:cov
  </li>

</ol>

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

[Acesse o diagrama no draw.io](https://viewer.diagrams.net/index.html?tags=%7B%7D&lightbox=1&highlight=0000ff&layers=1&nav=1&title=hackathon-video-framer.drawio#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1iZKwTulRhUoC2yItYfIwjQlRbT8_YyDv%26export%3Ddownload#%7B%22pageId%22%3A%22Kp5rze23rEPJkmFxVfdC%22%7D)

[Acesse a documentação no Notion](https://www.notion.so/Hackathon-Extra-o-de-Frames-17eebb738629801bb3dcf92ab0b4d4fc)



![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

<h2 id="requisitos"> 👤 Integrantes</h2>

[<img src="https://avatars.githubusercontent.com/u/76217994?v=4" width=115 > <br> <sub> Aureo Alexandre </sub>](https://github.com/Aureo-Bueno) | [<img src="https://avatars.githubusercontent.com/u/97612275?v=4" width=115 > <br> <sub> Fauze Cavalari </sub>](https://github.com/devfauze) | [<img src="https://avatars.githubusercontent.com/u/53823656?v=4" width=115 > <br> <sub> Gabriella Andrade </sub>](https://github.com/GabiAndradeD) | [<img src="https://avatars.githubusercontent.com/u/61785785?v=4" width=115 > <br> <sub> Luiz H. L. Paino </sub>](https://github.com/luizhlpaino) |
| :---: | :---: | :---: | :---: |
