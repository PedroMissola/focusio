# Organizador de Rotinas para Pessoas com TDAH

Este repositório contém o código-fonte de um projeto desenvolvido como Trabalho de Conclusão de Curso (TCC). O objetivo principal é auxiliar pessoas com Transtorno de Déficit de Atenção e Hiperatividade (TDAH) a organizarem suas rotinas de estudo de maneira eficiente, clara e prática.

## Tecnologias Utilizadas

- **Node.js**: Plataforma para execução do JavaScript no lado do servidor.
- **Express.js**: Framework web rápido e minimalista para Node.js.
- **EJS (Embedded JavaScript)**: Motor de templates para renderização de páginas dinâmicas no servidor.
- **TailwindCSS**: Framework de CSS para estilização rápida e responsiva.

## Funcionalidades

- Cadastro de tarefas e rotinas de estudo.
- Visualização de rotinas organizadas em uma interface amigável.
- Marcação de tarefas como concluídas.
- Design responsivo e intuitivo para facilitar o uso por pessoas de todas as idades.

## Badges

![Node.js](https://img.shields.io/badge/Node.js-v16.20.0-green)
![Express.js](https://img.shields.io/badge/Express.js-4.19.2-blue)
![EJS](https://img.shields.io/badge/EJS-3.1.10-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.7-blueviolet)

## Como Executar o Projeto

### Pré-requisitos

Antes de começar, você precisará ter o Node.js e o npm instalados em sua máquina. Caso ainda não tenha, faça o download e instalação no [site oficial do Node.js](https://nodejs.org/).

### Passo a Passo

1. Clone este repositório:

   ```bash
   git clone https://github.com/MissolaPedro/TDAH.git
   ```
2. Acesse o diretório do projeto:

   ```bash
   cd TDAH
   ```
3. Instale as dependências:

   ```bash
   npm install
   ```
4. Inicie o servidor:

   ```bash
   npm start
   ```
5. Acesse o sistema no seu navegador:

   ```
   http://localhost:3000
   ```

## Dependências

### Dependências de Produção

- **axios**: ^1.7.5
- **bcryptjs**: ^2.4.3
- **cookie-parser**: ^1.4.6
- **csrf**: ^3.1.0
- **date-fns**: ^3.6.0
- **dotenv**: ^16.4.5
- **ejs**: ^3.1.10
- **express**: ^4.19.2
- **express-ejs-layouts**: ^2.5.1
- **express-session**: ^1.18.0
- **firebase**: ^10.12.4
- **firebase-admin**: ^12.4.0
- **flatpickr**: ^4.6.13
- **fs**: ^0.0.1-security
- **helmet**: ^7.1.0
- **https**: ^1.0.0
- **morgan**: ^1.10.0
- **nodemailer**: ^6.9.14
- **nodemailer-mailjet-transport**: ^1.0.4
- **owasp-password-strength-test**: ^1.3.0
- **rotating-file-stream**: ^3.2.3

### Dependências de Desenvolvimento

- **autoprefixer**: ^10.4.19
- **concurrently**: ^8.2.2
- **postcss**: ^8.4.40
- **postcss-cli**: ^11.0.0
- **tailwindcss**: ^3.4.7

## Estrutura de Pastas

```
TDAH/
├── public/         # Arquivos estáticos (CSS, JS, imagens)
├── views/          # Templates EJS
├── routes/         # Definição de rotas
├── controllers/    # Lógica do aplicativo
├── models/         # Definição de modelos de dados
└── app.js          # Arquivo principal do servidor
```

## Contribuidores

Agradecimentos especiais aos contribuidores deste projeto:

- **Pedro Missola**: Desenvolvedor principal ([GitHub](https://github.com/MissolaPedro))
- **jhoutromund0** ([GitHub](https://github.com/jhoutromund0))
- **heitorsinistro** ([GitHub](https://github.com/heitorsinistro))

## Contribuição

Contribuições são bem-vindas! Caso deseje contribuir com melhorias ou correções, siga os passos abaixo:

1. Faça um fork deste repositório.
2. Crie uma nova branch com sua feature ou correção de bug:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça suas alterações e commit:
   ```bash
   git commit -m "Minha contribuição"
   ```
4. Envie para sua branch:
   ```bash
   git push origin minha-feature
   ```
5. Abra um pull request neste repositório.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## Contato

Para dúvidas ou sugestões, entre em contato:

- **Autor**: Pedro Missola
- **GitHub**: [MissolaPedro](https://github.com/MissolaPedro)

---

_Ajude pessoas com TDAH a alcançarem seus objetivos com mais organização e clareza!_
