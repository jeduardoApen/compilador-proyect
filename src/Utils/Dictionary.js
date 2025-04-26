/**
 * @class Token
 * Representa un token con su tipo y una o más expresiones regulares.
 */
class Token {
    constructor(token = "", exp) {
      this.token = token.toUpperCase();
      this.exp = Array.isArray(exp) ? exp : [exp];
    }
  }
  
  /**
   * @class Dictionary
   * Maneja el registro y análisis de tokens.
   */
  class Dictionary {
    constructor() {
      this.dic = [];
    }
  
    /**
     * Agrega un token o añade una nueva expresión si el token ya existe.
     * @param {string} name - Tipo del token.
     * @param {object} exp - Expresión regular.
     */
    addToken(name = '', exp) {
      const tokenName = name.toUpperCase();
      const existing = this.dic.find(t => t.token === tokenName);
  
      if (existing) {
        existing.exp.push(exp);
      } else {
        this.dic.push(new Token(name, exp));
      }
      return this.dic;
    }
  
    getList() {
      return this.dic;
    }
  
    getLen() {
      return this.dic.length;
    }
  
    verifyText(text = '', index) {
      const token = this.dic[index];
      return token.exp.some(regex => regex.test(text));
    }
  
    checkExp(text = "", index) {
      const token = this.dic[index];
      for (let exp of token.exp) {
        if (exp.test(text)) {
          const match = text.match(exp);
          if (match) {
            const [matchText, ...tokenDetail] = match;
            return {
              tokenType: token.token,
              matchText,
              tokenDetail,
              idToken: index
            };
          }
        }
      }
    }
  
    /**
     * Retorna el primer token que coincida con el texto.
     * @param {string} text - Texto a verificar.
     * @returns {object|null} - Objeto de token coincidente o null.
     */
    matchTokenInText(text = "") {
      for (let i = 0; i < this.dic.length; i++) {
        if (this.verifyText(text, i)) {
          return this.checkExp(text, i);
        }
      }
      return null;
    }
  
    /**
     * Analiza una cadena completa y retorna una lista de tokens encontrados.
     * @param {string} text - Código fuente a analizar.
     * @returns {Array} - Lista de tokens.
     */
    tokenize(text = "") {
      const tokens = [];
      const words = text.split(/\s+/);
  
      for (let word of words) {
        const result = this.matchTokenInText(word);
        if (result) {
          tokens.push(result);
        } else {
          tokens.push({
            tokenType: 'UNKNOWN',
            matchText: word,
            tokenDetail: [],
            idToken: -1
          });
        }
      }
      return tokens;
    }
  }
  
  const dictionary = new Dictionary();
  
  // 🔽 Registro de tokens
  dictionary.addToken('variable', /\$[a-zA-Z0-9_-]+/);
  dictionary.addToken('KeywordBegin', /\b(if|else|while|for|then)\b\:/);
  dictionary.addToken('KeywordEnd', /\b(endif|endwhile|endfor)\b/);
  dictionary.addToken('OtherKeywords', /\b(return|const)\b/);
  dictionary.addToken('number', /\d+(\.\d+)?/);
  dictionary.addToken('Assign', /^=$/);
  dictionary.addToken('Equal', /^==$/);
  dictionary.addToken('EqualStr', /^===$/);
  dictionary.addToken('Plus', /^\+$/);
  dictionary.addToken('Minus', /^\-$/);
  dictionary.addToken('Multiply', /^\*$/);
  dictionary.addToken('Divide', /^\/$/);
  dictionary.addToken('Modulo', /^\%$/);
  dictionary.addToken('InitCurlBracket', /^\{$/);
  dictionary.addToken('EndCurlBracket', /^\}$/);
  dictionary.addToken('InitSqrBracket', /^\[$/);
  dictionary.addToken('EndSqrBracket', /^\]$/);



  
  // 🔁 Exportar para usar en otro módulo
  class EnhancedDictionary extends Dictionary {
    /**
     * Analiza texto con mayor precisión, manejando casos complejos
     * @param {string} source - Código fuente completo
     * @returns {Array} - Tokens con información de posición
     */
    enhancedTokenize(source = "") {
      const tokens = [];
      let pos = 0;
      let line = 1;
      let column = 1;
      
      while (pos < source.length) {
        let matched = false;
        
        // Ignorar espacios en blanco
        console.log('source', source.slice(pos), pos)
        const whitespace = source.slice(pos).match(/^\s+/);
        console.log('whitespaces ',whitespace)

        if (whitespace) {
          const newlines = whitespace[0].split('\n').length - 1;
          console.log('newlines ',newlines)
          if (newlines > 0) {
            line += newlines;
            column = 1;
          } else {
            column += whitespace[0].length;
          }
          pos += whitespace[0].length;
          continue;

          
        }
        console.log('pos, line, colum', pos,line,column)
        
        // Probar cada token en orden
        for (let i = 0; i < this.dic.length; i++) {
          const token = this.dic[i];
          console.log(this.dic[i])
          const regex = new RegExp(`^(${token.exp.map(e => e.source).join('|')})`);
          console.log('regex', regex)
          const match = source.slice(pos).match(regex);
          console.log('match', match)
          
          if (match) {
            const [fullMatch] = match;
            const result = {
              tokenType: token.token,
              matchText: fullMatch,
              tokenDetail: match.slice(1),
              idToken: i,
              line,
              column
            };
            
            tokens.push(result);
            pos += fullMatch.length;
            column += fullMatch.length;
            matched = true;
            break;
          }
        }
        
        // Si no coincide con ningún token conocido
        if (!matched) {
          // Avanzar un carácter como token desconocido
          tokens.push({
            tokenType: 'UNKNOWN',
            matchText: source[pos],
            tokenDetail: [],
            idToken: -1,
            line,
            column
          });
          pos++;
          column++;
        }
      }
      
      return tokens;
    }
    
    /**
     * Registra tokens con prioridad
     * @param {string} name - Nombre del token
     * @param {RegExp} exp - Expresión regular
     * @param {number} priority - Prioridad (mayor = se evalúa primero)
     */
    addTokenWithPriority(name, exp, priority = 0) {
      const token = new Token(name, exp);
      token.priority = priority;
      this.dic.push(token);
      this.dic.sort((a, b) => b.priority - a.priority);
      return this.dic;
    }
  }

  export default EnhancedDictionary