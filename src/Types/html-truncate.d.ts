declare module 'html-truncate' {
  function truncate(html: string, maxLength: number, options?: { keepImageTag?: boolean }): string;
  export default truncate;
}
