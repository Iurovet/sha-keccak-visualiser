// Use Abstract Syntax Tree (AST) nodes
export type ASTNode = LiteralNode | FunctionNode;

// Variables or constants
export interface LiteralNode {
  type: 'Literal';
  value: string;
}

// For functions to become recursive
export interface FunctionNode {
  type: 'Function';
  name: string;
  arguments: ASTNode[];
}

// Define the variable evaluation context
export interface EvaluationContext {
  [variableName: string]: number;
}

// Functions supported
export type BitwiseFunctionName = 'AND' | 'OR' | 'XOR' | 'NOT';

// Get words, commas, brackets
function toTokens(str: string): string[] {
  const regex = /[A-Za-z0-9_]+|[(),]/g;
  return str.match(regex) || [];
}

// Parser
function parse(tokens: string[]): ASTNode {
  let index = 0;

  function parseExpression(): ASTNode {
    const token = tokens[index];

    if (!token) {
      throw new SyntaxError("Unexpected end of input");
    }

    // Check if the token is a function (followed by an open parenthesis)
    if (tokens[index + 1] === '(') {
      const funcName = token;
      index += 2; // Consume function name and '('

      const args: ASTNode[] = [];

      // Parse arguments inside parentheses
      while (tokens[index] !== ')') {
        if (!tokens[index]) {
          throw new SyntaxError(`Missing closing parenthesis for ${funcName}`);
        }
        
        args.push(parseExpression());

        if (tokens[index] === ',') {
          index++; // Consume comma
        } else if (tokens[index] !== ')') {
          throw new SyntaxError(`Expected ',' or ')' but found ${tokens[index]}`);
        }
      }

      index++; // Consume ')'
      return { type: 'Function', name: funcName, arguments: args };
    } 
    
    // Otherwise, treat it as a leaf node (Variable or Constant)
    index++;
    return { type: 'Literal', value: token };
  }

  const ast = parseExpression();
  
  if (index < tokens.length) {
    throw new SyntaxError(`Unexpected trailing tokens starting at: ${tokens[index]}`);
  }

  return ast;
}

function evaluate(node: ASTNode, context: EvaluationContext): number {
  if (node.type === 'Literal') {
    const val = context[node.value];
    if (val !== undefined) {
      return val;
    }
    
    // If it's not in context, try parsing it as a base-10 number or hex/binary literal
    const parsed = Number(node.value);
    if (isNaN(parsed)) {
      throw new ReferenceError(`Variable "${node.value}" is not defined in context.`);
    }
    return parsed;
  }

  if (node.type === 'Function') {
    // Recursively evaluate all arguments first
    const args = node.arguments.map(arg => evaluate(arg, context));
    const upperName = node.name.toUpperCase() as BitwiseFunctionName;

    if (args.length === 0) {
      throw new Error(`Function ${node.name} requires at least one argument.`);
    }
    
    switch (upperName) {
      case 'AND': 
        return args.reduce((acc, val) => acc & val);
      case 'OR':  
        return args.reduce((acc, val) => acc | val);
      case 'XOR': 
        return args.reduce((acc, val) => acc ^ val);
      case 'NOT': 
        return ~args[0]; // NOT only operates on the first argument
      default:
        throw new Error(`Unknown function: ${node.name}`);
    }
  }

  throw new Error("Unknown AST Node type");
}

export { toTokens, parse, evaluate }