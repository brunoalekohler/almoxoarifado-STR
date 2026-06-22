# Santa Rosa Malhas - Consulta de Estoque

Sistema desenvolvido para consulta de estoque utilizando:

- HTML5
- CSS3
- JavaScript
- Google Apps Script
- Google Sheets
- GitHub
- Vercel

---

## Estrutura

```
consulta-estoque/

│── index.html
│── style.css
│── script.js
│── logo.png
│── vercel.json
│── README.md

└── api/
    └── Code.gs
```

---

## Configuração

### 1) Criar a API

Acesse:

https://script.google.com

Cole o arquivo `Code.gs`.

Clique em:

Implantar → Nova implantação

Tipo:

Aplicativo da Web

Configurações:

Executar como:
Você

Quem pode acessar:
Qualquer pessoa

Copie a URL gerada.

Exemplo:

```
https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxx/exec
```

---

### 2) Configurar o script.js

Troque:

```javascript
const API_URL = "SUA_URL_DA_API";
```

por

```javascript
const API_URL =
"https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxx/exec";
```

---

## Estrutura da planilha

Planilha:

```
ESTOQUE ATUAL
```

A partir da linha **7**

| Coluna | Informação |
|--------|------------|
| A | ID DO PRODUTO |
| B | NOME DO PRODUTO |
| C | QUANTIDADE ATUAL |

---

## Instalação

Clone o projeto

```
git clone https://github.com/SEU_USUARIO/consulta-estoque.git
```

Entre na pasta

```
cd consulta-estoque
```

Abra o projeto no VS Code.

---

## Publicando na Vercel

1. Faça login na Vercel.

2. Clique em

```
Add New Project
```

3. Escolha o repositório do GitHub.

4. Clique em

```
Deploy
```

Pronto.

---

## Recursos

✔ Consulta por ID

✔ Integração com Google Sheets

✔ Layout responsivo

✔ Interface moderna

✔ Loading

✔ Pesquisa ao pressionar ENTER

✔ Compatível com celular

✔ Compatível com computador

✔ GitHub

✔ Vercel

---

## Desenvolvido para

Santa Rosa Malhas
