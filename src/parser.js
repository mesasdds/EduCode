// src/parser.js
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    parse() {
        const statements = [];

        while (!this.isAtEnd()) {
            statements.push(this.declaration());
        }

        return statements;
    }

    declaration() {
        if (this.match('IF')) {
            return this.ifStatement();
        } else if (this.match('WHILE')) {
            return this.whileStatement();
        } else if (this.match('TYPE')) {
            return this.variableDeclaration();
        } else {
            return this.statement();
        }
    }

    variableDeclaration() {
        const typeToken = this.previous();

        if (!this.match('ASSIGNMENT')) {
            throw new Error(`Esperado uma atribuição após tipo "${typeToken.value}".`);
        }

        const assignmentToken = this.previous();

        const assignmentMatch = assignmentToken.value.match(/(\w+)\s*=\s*(.+);?/);
        if (!assignmentMatch) {
            throw new Error(`Erro de sintaxe na atribuição: "${assignmentToken.value}"`);
        }

        let varValue = assignmentMatch[2].trim();

        if (varValue.endsWith(';')) {
            varValue = varValue.slice(0, -1).trim();
        }

        const varName = assignmentMatch[1];

        return {
            type: 'VARIABLE_DECLARATION',
            varType: typeToken.value,
            varName,
            varValue
        };
    }

    ifStatement() {
        const branches = [];

        const ifToken = this.previous();
        const conditionMatch = ifToken.value.match(/se\s*\((.+)\)/);
        if (!conditionMatch) {
            throw new Error("Erro de sintaxe na condição do 'se'");
        }
        const condition = conditionMatch[1];
        this.consume('BLOCK_START', "Esperado '{' após condição do 'se'");
        const thenBranch = this.block();

        branches.push({ type: 'IF_BRANCH', condition, body: thenBranch });

        while (this.match('ELSE_IF')) {
            const elseIfToken = this.previous();
            const elseIfMatch = elseIfToken.value.match(/senaoSe\s*\((.+)\)/);
            if (!elseIfMatch) {
                throw new Error("Erro de sintaxe na condição do 'senaoSe'");
            }
            const elseIfCondition = elseIfMatch[1];
            this.consume('BLOCK_START', "Esperado '{' após condição do 'senaoSe'");
            const elseIfBody = this.block();
            branches.push({ type: 'ELSE_IF_BRANCH', condition: elseIfCondition, body: elseIfBody });
        }

        if (this.match('ELSE')) {
            this.consume('BLOCK_START', "Esperado '{' após 'senao'");
            const elseBody = this.block();
            branches.push({ type: 'ELSE_BRANCH', body: elseBody });
        }

        return { type: 'IF_STATEMENT', branches };
    }

    whileStatement() {
        const whileToken = this.previous();
        const conditionMatch = whileToken.value.match(/enquanto\s*\((.+)\)/);
        if (!conditionMatch) {
            throw new Error("Erro de sintaxe na condição do 'enquanto'");
        }
        const condition = conditionMatch[1];
        this.consume('BLOCK_START', "Esperado '{' após condição do 'enquanto'");
        const body = this.block();

        return { type: 'WHILE_STATEMENT', condition, body };
    }

    block() {
        const statements = [];

        while (!this.check('BLOCK_END') && !this.isAtEnd()) {
            statements.push(this.declaration());
        }

        this.consume('BLOCK_END', "Esperado '}' após bloco");
        return statements;
    }

    statement() {
        const token = this.advance();

        switch (token.type) {
            case 'PRINT':
                return { type: 'PRINT', value: token.value };
            case 'ASSIGNMENT':
                return { type: 'ASSIGNMENT', value: token.value };
            case 'REASSIGNMENT':
                return { type: 'REASSIGNMENT', value: token.value };
            default:
                throw new Error(`Token inesperado: ${token.type}`);
        }
    }

    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    consume(type, message) {
        if (this.check(type)) return this.advance();
        throw new Error(message);
    }

    check(type) {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    advance() {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    isAtEnd() {
        return this.current >= this.tokens.length;
    }

    peek() {
        return this.tokens[this.current];
    }

    previous() {
        return this.tokens[this.current - 1];
    }
}

export default Parser;
