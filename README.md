# EduCode

EduCode é uma linguagem de programação educacional desenvolvida em Node.js. Ela foi projetada para ajudar iniciantes a aprender conceitos fundamentais de programação de forma intuitiva.

## Funcionalidades

- **Declaração de Variáveis**: Suporta `inteiro`, `decimal`, `logico` e `texto`.
- **Estruturas de Controle**:
  - Condicionais: `se`, `senaoSe`, `senao`.
  - Loops: `enquanto`.
- **Funções de Entrada/Saída**:
  - `exibir()`: Imprime mensagens no console.

## Exemplo de Código

inteiro idade = 10;

se (idade >= 18)
{
    exibir("Você é maior de idade.");
}
senaoSe (idade >= 13)
{
    exibir("Você é um adolescente.");
}
senao
{
    exibir("Você é uma criança.");
}

## Instalação

Clone o repositório:

git clone https://github.com/mesasdds/EduCode.git
cd EduCode

## Uso

Para executar um arquivo .edu, utilize o seguinte comando:

node src/cli.js examples/exemploerrado.edu

npm run run -- caminho/para/o/arquivo.edu

Exemplos:
Os exemplos de código estão localizados na pasta examples/. Você pode executar qualquer um dos exemplos fornecendo o caminho do arquivo após npm run run --.

npm run run -- examples/nome_do_arquivo.edu

## Exemplos:

# Para executar o arquivo variaveis.edu:

npm run run -- examples/variaveis.edu

# Para executar o arquivo fatorial.edu:

npm run run -- examples/fatorial.edu

## Criando e Executando Seu Próprio Código

# Crie um arquivo .edu na pasta examples/ ou em qualquer outro local:

// Meu programa teste
inteiro a = 5;
inteiro b = 10;
inteiro soma = a + b;
exibir("A soma de " + a + " e " + b + " é " + soma);

# Execute o arquivo:

npm run run -- examples/meu_programa.edu

