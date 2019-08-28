declare module 'extract-files' {
  declare export function extractFiles(value: { [string]: any }, prefix: ?string):
    { clone: { [string]: any }, files: Map<File, string> }
}