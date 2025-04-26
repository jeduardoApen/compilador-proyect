// import EnhancedDictionary from "./Utils/Dictionary";



// const lexer = new EnhancedDictionary();

// // Registrar tokens con prioridad (los más específicos primero)
// lexer.addTokenWithPriority('String', /"(?:\\.|[^"\\])*"/, 10);
// lexer.addTokenWithPriority('EqualStr', /===/, 9);
// lexer.addTokenWithPriority('Equal', /==/, 8);
// // ... otros tokens

// const code = `if x === "test" { return 42; }`;
// const tokens = lexer.enhancedTokenize(code);
// console.log(tokens);