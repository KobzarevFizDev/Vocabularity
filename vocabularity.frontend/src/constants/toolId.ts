export const ToolId = {
    Add: "Add",
    Delete: "Delete",
} as const;

export type ToolId = (typeof ToolId)[keyof typeof ToolId];
