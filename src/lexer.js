// src/lexer.js
class Lexer {
    constructor() {
        this.keywords = {
            'se': 'IF',
            'senaoSe': 'ELSE_IF',
            'senao': 'ELSE',
            'enquanto': 'WHILE',
            'exibir': 'PRINT',
            'inteiro': 'TYPE',
            'decimal': 'TYPE',
            'logico': 'TYPE',
            'texto': 'TYPE',
        };
    }

    tokenize(code) {
        const lines = code.split('\n');
        const tokens = [];

        const statementKeywords = ['IF', 'ELSE_IF', 'ELSE', 'WHILE', 'PRINT'];

        for (let line of lines) {
            line = line.trim();
            if (line === '' || line.startsWith('//')) continue;

            const regex = /({|})/g;
            let splitParts = line.split(regex).map(part => part.trim()).filter(part => part !== '');

            for (let part of splitParts) {
                if (part === '{') {
                    tokens.push({ type: 'BLOCK_START', value: '{' });
                    continue;
                } else if (part === '}') {
                    tokens.push({ type: 'BLOCK_END', value: '}' });
                    continue;
                }

                const firstWordMatch = part.match(/^\w+/);
                const firstWord = firstWordMatch ? firstWordMatch[0] : '';
                const keywordType = this.keywords[firstWord];

                if (keywordType && statementKeywords.includes(keywordType)) {
                    tokens.push({ type: keywordType, value: part });
                    continue;
                }

                if (this.keywords[firstWord] === 'TYPE') {
                    tokens.push({ type: 'TYPE', value: firstWord });

                    const assignment = part.slice(firstWord.length).trim();
                    tokens.push({ type: 'ASSIGNMENT', value: assignment });
                    continue;
                }

                if (part.match(/^\w+\s*=/)) {
                    tokens.push({ type: 'REASSIGNMENT', value: part });
                    continue;
                }

                throw new Error(`Comando não reconhecido: ${part}`);
            }
        }

        return tokens;
    }
}

export default Lexer;
