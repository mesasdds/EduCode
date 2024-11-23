// src/cli.js
import fs from 'fs';
import EduCodeInterpreter from './interpreter.js';

const filePath = process.argv[2];
if (!filePath) {
    console.error('Por favor, forneça o caminho para o arquivo .edu');
    process.exit(1);
}

const code = fs.readFileSync(filePath, 'utf-8');
const interpreter = new EduCodeInterpreter();
interpreter.execute(code);
