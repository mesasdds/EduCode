// src/interpreter.js
import Lexer from './lexer.js';
import Parser from './parser.js';

class EduCodeInterpreter {
    constructor() {
        this.variables = {};
        this.functions = {};
    }

    execute(code) {
        const lexer = new Lexer();
        const tokens = lexer.tokenize(code);

        const parser = new Parser(tokens);
        const statements = parser.parse();

        for (const stmt of statements) {
            this.executeStatement(stmt);
        }
    }

    executeStatement(stmt) {
        switch (stmt.type) {
            case 'ASSIGNMENT':
                this.handleAssignment(stmt.value);
                break;
            case 'REASSIGNMENT':
                this.handleReassignment(stmt.value);
                break;
            case 'PRINT':
                this.handlePrint(stmt.value);
                break;
            case 'IF_STATEMENT':
                this.handleIfStatement(stmt);
                break;
            case 'WHILE_STATEMENT':
                this.handleWhileStatement(stmt);
                break;
            case 'VARIABLE_DECLARATION':
                this.handleVariableDeclaration(stmt);
                break;
            default:
                throw new Error(`Tipo de declaração desconhecido: ${stmt.type}`);
        }
    }

    handleVariableDeclaration(stmt) {
        const { varType, varName, varValue } = stmt;

        let evaluatedValue;
        switch (varType) {
            case 'inteiro':
                evaluatedValue = this.evaluateExpression(varValue, 'inteiro');
                break;
            case 'decimal':
                evaluatedValue = this.evaluateExpression(varValue, 'decimal');
                break;
            case 'logico':
                evaluatedValue = this.evaluateLogical(varValue);
                break;
            case 'texto':
                evaluatedValue = this.evaluateStringExpression(varValue);
                break;
            default:
                throw new Error(`Tipo de variável desconhecido: "${varType}"`);
        }

        this.variables[varName] = evaluatedValue;
    }

    handleAssignment(line) {
        const [name, value] = line.split('=').map(s => s.trim());

        if (!name) {
            throw new Error(`Nome da variável não definido na linha: "${line}"`);
        }

        if (!this.variables.hasOwnProperty(name)) {
            throw new Error(`Nome da variável não definido: "${name}"`);
        }

        let cleanedValue = value;
        if (cleanedValue.endsWith(';')) {
            cleanedValue = cleanedValue.slice(0, -1).trim();
        }

        let type;
        if (Number.isInteger(this.variables[name])) {
            type = 'inteiro';
        } else if (typeof this.variables[name] === 'number') {
            type = 'decimal';
        } else if (typeof this.variables[name] === 'boolean') {
            type = 'logico';
        } else if (typeof this.variables[name] === 'string') {
            type = 'texto';
        } else {
            throw new Error(`Tipo de variável desconhecido para "${name}"`);
        }

        let evaluatedValue;
        switch (type) {
            case 'inteiro':
                evaluatedValue = this.evaluateExpression(cleanedValue, 'inteiro');
                break;
            case 'decimal':
                evaluatedValue = this.evaluateExpression(cleanedValue, 'decimal');
                break;
            case 'logico':
                evaluatedValue = this.evaluateLogical(cleanedValue);
                break;
            case 'texto':
                evaluatedValue = this.evaluateStringExpression(cleanedValue);
                break;
            default:
                throw new Error(`Tipo de variável desconhecido: "${type}"`);
        }

        this.variables[name] = evaluatedValue;
    }

    handleReassignment(line) {
        const [name, value] = line.split('=').map(s => s.trim());

        if (!name) {
            throw new Error(`Nome da variável não definido na linha: "${line}"`);
        }

        if (!this.variables.hasOwnProperty(name)) {
            throw new Error(`Variável não declarada: "${name}"`);
        }

        let cleanedValue = value;
        if (cleanedValue.endsWith(';')) {
            cleanedValue = cleanedValue.slice(0, -1).trim();
        }

        let type;
        const varValue = this.variables[name];
        if (Number.isInteger(varValue)) {
            type = 'inteiro';
        } else if (typeof varValue === 'number') {
            type = 'decimal';
        } else if (typeof varValue === 'boolean') {
            type = 'logico';
        } else if (typeof varValue === 'string') {
            type = 'texto';
        } else {
            throw new Error(`Tipo de variável desconhecido para "${name}"`);
        }

        let evaluatedValue;
        switch (type) {
            case 'inteiro':
                evaluatedValue = this.evaluateExpression(cleanedValue, 'inteiro');
                break;
            case 'decimal':
                evaluatedValue = this.evaluateExpression(cleanedValue, 'decimal');
                break;
            case 'logico':
                evaluatedValue = this.evaluateLogical(cleanedValue);
                break;
            case 'texto':
                evaluatedValue = this.evaluateStringExpression(cleanedValue);
                break;
            default:
                throw new Error(`Tipo de variável desconhecido: "${type}"`);
        }

        this.variables[name] = evaluatedValue;
    }

    handleIfStatement(stmt) {
        const branches = stmt.branches;
        let conditionMet = false;

        for (const branch of branches) {
            if (branch.type === 'IF_BRANCH' || branch.type === 'ELSE_IF_BRANCH') {
                const condition = this.evaluateCondition(branch.condition);

                if (condition) {
                    conditionMet = true;
                    for (const statement of branch.body) {
                        this.executeStatement(statement);
                    }
                    break;
                }
            } else if (branch.type === 'ELSE_BRANCH') {
                if (!conditionMet) {
                    for (const statement of branch.body) {
                        this.executeStatement(statement);
                    }
                    break;
                }
            }
        }
    }

    handleWhileStatement(stmt) {
        const condition = stmt.condition;
        const body = stmt.body;

        while (this.evaluateCondition(condition)) {
            for (const statement of body) {
                this.executeStatement(statement);
            }
        }
    }

    evaluateCondition(condition) {
        let expr = condition;
        for (let varName in this.variables) {
            if (this.variables.hasOwnProperty(varName)) {
                expr = expr.replace(new RegExp(`\\b${varName}\\b`, 'g'), this.variables[varName]);
            }
        }

        try {
            return eval(expr);
        } catch (e) {
            throw new Error(`Erro ao avaliar condição: "${condition}"`);
        }
    }

    handlePrint(line) {
        const content = line.match(/exibir\((.+)\)/);
        if (content) {
            const expression = content[1].trim();

            const parts = expression.split('+').map(part => part.trim());

            let output = '';

            for (const part of parts) {
                if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
                    output += part.slice(1, -1);
                } else if (this.variables.hasOwnProperty(part)) {
                    const varValue = this.variables[part];
                    if (typeof varValue === 'boolean') {
                        output += varValue ? 'true' : 'false';
                    } else {
                        output += varValue;
                    }
                } else {
                    output += part;
                }
            }

            console.log(output);
        } else {
            throw new Error('Erro de sintaxe em exibir');
        }
    }

    evaluateExpression(expr, type) {
        if (expr.endsWith(';')) {
            expr = expr.slice(0, -1).trim();
        }

        for (let varName in this.variables) {
            if (this.variables.hasOwnProperty(varName)) {
                expr = expr.replace(new RegExp(`\\b${varName}\\b`, 'g'), this.variables[varName]);
            }
        }

        try {
            let evalResult = eval(expr);
            if (type === 'inteiro') {
                return parseInt(evalResult, 10);
            } else if (type === 'decimal') {
                return parseFloat(evalResult);
            }
        } catch (e) {
            throw new Error(`Erro ao avaliar expressão: "${expr}"`);
        }
    }

    evaluateLogical(value) {
        value = value.trim();

        if (value.endsWith(';')) {
            value = value.slice(0, -1).trim();
        }

        const valLower = value.toLowerCase();
        if (valLower === 'true') {
            return true;
        } else if (valLower === 'false') {
            return false;
        } else {
            throw new Error(`Valor lógico inválido: "${value}"`);
        }
    }

    evaluateStringExpression(expr) {
        if (expr.endsWith(';')) {
            expr = expr.slice(0, -1).trim();
        }

        const parts = expr.split('+').map(part => part.trim());
        let result = '';

        for (const part of parts) {
            if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
                result += part.slice(1, -1);
            } else if (this.variables.hasOwnProperty(part)) {
                const varValue = this.variables[part];
                result += String(varValue);
            } else {
                throw new Error(`Variável não definida ou expressão inválida: "${part}"`);
            }
        }

        return result;
    }
}

export default EduCodeInterpreter;
