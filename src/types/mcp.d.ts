/**
 * Type declarations for Model Context Protocol (MCP) modules
 */

declare module '@modelcontextprotocol/sdk/server/mcp.js' {
  export class McpServer {
    constructor(options: any);
    registerTransport(transport: any): void;
    registerTool(name: string, handler: (params: any) => Promise<any>): void;
    start(): Promise<void>;
  }
}

declare module '@modelcontextprotocol/sdk/server/stdio.js' {
  export class StdioServerTransport {
    constructor();
  }
}
