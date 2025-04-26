class LLParser {
    constructor(lexer) {
        this.lexer = lexer;
        this.tokens = [];
        this.currentTokenIndex = 0;
        this.currentToken = null;
        this.errors = [];
    }

    /**
     * Inicializa el parser con el código fuente
     * @param {string} source - Código fuente a analizar
     */
    init(source) {
        this.tokens = this.lexer.enhancedTokenize(source);
        console.log(this.tokens)
        this.currentTokenIndex = 0;
        this.currentToken = this.tokens[0];
        this.errors = [];
    }

    /**
     * Avanza al siguiente token
     */
    advance() {
        this.currentTokenIndex++;
        this.currentToken =
            this.currentTokenIndex < this.tokens.length
                ? this.tokens[this.currentTokenIndex]
                : { tokenType: 'EOF' };
    }

    /**
     * Verifica si el token actual coincide con el tipo esperado
     * @param {string} expectedType - Tipo de token esperado
     * @returns {boolean} - True si coincide
     */
    match(expectedType) {
        return this.currentToken.tokenType === expectedType;
    }

    /**
     * Consume el token actual si coincide con el tipo esperado
     * @param {string} expectedType - Tipo de token esperado
     * @returns {boolean} - True si coincidió y avanzó
     */
    consume(expectedType) {
        if (this.match(expectedType)) {
            this.advance();
            return true;
        }
        return false;
    }

    /**
     * Expecta un tipo específico de token, genera error si no coincide
     * @param {string} expectedType - Tipo de token esperado
     */
    expect(expectedType) {
        if (!this.consume(expectedType)) {
            const error = `Error en línea ${this.currentToken.line}, columna ${this.currentToken.column}: Se esperaba ${expectedType} pero se encontró ${this.currentToken.tokenType}`;
            this.errors.push(error);
            throw new Error(error);
        }
    }


    parse(source) {
        this.init(source);
        try {
            const ast = this.parseProgram();
            return {
                success: this.errors.length === 0,
                ast,
                errors: this.errors
            };
        } catch (e) {
            return {
                success: false,
                ast: null,
                errors: this.errors
            };
        }
    }

    parseProgram() {
        const statements = [];
        while (!this.match('EOF')) {
            statements.push(this.parseStatement());
        }
        return { type: 'Program', statements };
    }

    synchronize() {
        this.advance();
        while (!this.match('EOF')) {
            if (this.previousToken.tokenType === 'EndCurlBracket') {
                return;
            }
            if (this.currentToken.tokenType === 'KeywordBegin' ||
                this.currentToken.tokenType === 'variable' ||
                this.currentToken.tokenType === 'InitCurlBracket') {
                return;
            }
            this.advance();
        }
    }




    parseStatement() {
        try {
            if (this.match('KeywordBegin')) {
                return this.parseIfStatement();
            } else if (this.match('variable')) {
                return this.parseAssignment();
            } else if (this.match('InitCurlBracket')) {
                return this.parseBlock();
            } else {
                const error = `Error en línea ${this.currentToken.line}, columna ${this.currentToken.column}: Declaración no válida`;
                this.errors.push(error);
                this.advance(); // Recuperación de error: saltar token inválido
                return { type: 'InvalidStatement' };
            }

        } catch (error) {
            this.synchronize();
            return { type: 'SkippedStatement' };

        }



    }

    parseIfStatement() {
        this.expect('KeywordBegin');
        const test = this.parseExpression();
        this.expect(':');
        const consequent = this.parseBlock();

        let alternate = null;
        if (this.consume('KeywordEnd')) {
            // Opcional: endif
        }

        return {
            type: 'IfStatement',
            test,
            consequent,
            alternate
        };
    }

    parseBlock() {
        this.expect('InitCurlBracket');
        const statements = [];
        while (!this.match('EndCurlBracket') && !this.match('EOF')) {
            statements.push(this.parseStatement());
        }
        this.expect('EndCurlBracket');
        return { type: 'Block', statements };
    }

    parseAssignment() {
        const variable = this.currentToken.matchText;
        this.expect('variable');
        this.expect('Assign');
        const value = this.parseExpression();
        return { type: 'Assignment', variable, value };
    }

    parseExpression() {
        let left = this.parseTerm();
        while (this.match('Plus') || this.match('Minus')) {
            const operator = this.currentToken.tokenType;
            this.advance();
            const right = this.parseTerm();
            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right
            };
        }
        return left;
    }

    parseTerm() {
        let left = this.parseFactor();
        while (this.match('Multiply') || this.match('Divide')) {
            const operator = this.currentToken.tokenType;
            this.advance();
            const right = this.parseFactor();
            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right
            };
        }
        return left;
    }

    parseFactor() {
        if (this.match('number')) {
            const value = parseFloat(this.currentToken.matchText);
            this.advance();
            return { type: 'NumberLiteral', value };
        } else if (this.match('variable')) {
            const name = this.currentToken.matchText;
            this.advance();
            return { type: 'Variable', name };
        } else if (this.consume('InitSqrBracket')) {
            const expr = this.parseExpression();
            this.expect('EndSqrBracket');
            return expr;
        } else {
            const error = `Error en línea ${this.currentToken.line}, columna ${this.currentToken.column}: Factor no válido`;
            this.errors.push(error);
            throw new Error(error);
        }
    }


}

export default LLParser


