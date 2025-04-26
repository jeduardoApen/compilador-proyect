import EnhancedDictionary from "./Utils/Dictionary";
import LLParser from "./Utils/ParserLL";



// Configuración del lexer
const lexer = new EnhancedDictionary();
lexer.addTokenWithPriority('String', /"(?:\\.|[^"\\])*"/, 10);
lexer.addTokenWithPriority('EqualStr', /===/, 9);
lexer.addTokenWithPriority('Equal', /==/, 8);
lexer.addTokenWithPriority('variable', /\$[a-zA-Z0-9_-]+/, 7);
lexer.addTokenWithPriority('KeywordBegin', /\b(if|else|while|for|then)\b:/, 6);
lexer.addTokenWithPriority('KeywordEnd', /\b(endif|endwhile|endfor)\b/, 5);
lexer.addTokenWithPriority('OtherKeywords', /\b(return|const)\b/, 4);
lexer.addTokenWithPriority('number', /\d+(\.\d+)?/, 3);
lexer.addTokenWithPriority('Assign', /=/, 2);
lexer.addTokenWithPriority('Plus', /\+/, 1);
lexer.addTokenWithPriority('Minus', /-/, 1);
lexer.addTokenWithPriority('Multiply', /\*/, 1);
lexer.addTokenWithPriority('Divide', /\//, 1);
lexer.addTokenWithPriority('Modulo', /%/, 1);
lexer.addTokenWithPriority('InitCurlBracket', /\{/, 1);
lexer.addTokenWithPriority('EndCurlBracket', /\}/, 1);
lexer.addTokenWithPriority('InitSqrBracket', /\[/, 1);
lexer.addTokenWithPriority('EndSqrBracket', /\]/, 1);


// const code = `if x === "test" { return 42; }`;
// const tokens = lexer.enhancedTokenize(code);
// console.log(tokens);

// Crear y usar el parser
const parser = new LLParser(lexer);
const sourceCode = `
if: $x == 10 {
  $result = $x * 5
  return $result
}
`;

const result = parser.parse(sourceCode);
console.log(JSON.stringify(result, null, 2));