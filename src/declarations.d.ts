declare module '*.jpg';
declare module '*.png';
declare module '*.svg';

declare module 'react-quill' {
    import React from 'react';

    interface QuillOptions {
        theme?: string;
        modules?: any;
        formats?: string[];
        placeholder?: string;
        value?: string;
        onChange?: (content: string, delta: any, source: string, editor: any) => void;
        readOnly?: boolean;
        style?: React.CSSProperties;
        className?: string;
        ref?: React.Ref<any>;
    }

    class ReactQuill extends React.Component<QuillOptions> {}
    export default ReactQuill;
}
