import React from "react";
import SunEditor from "suneditor-react";

interface SunEditorProps {
  defaultValue?: string;
  onChange: (value: string) => void;
}
function TextEditor({ defaultValue = "", onChange }: SunEditorProps) {
  return (
      <SunEditor
        height="600"
        defaultValue={defaultValue}
        onChange={onChange}
        setOptions={{
          buttonList: [
            // default
            ["undo", "redo"],
            [
              ":p-More Paragraph-default.more_paragraph",
              "font",
              "fontSize",
              "formatBlock",
              "paragraphStyle",
              "blockquote",
            ],
            [
              "bold",
              "underline",
              "italic",
              "strike",
              "subscript",
              "superscript",
            ],
            ["fontColor", "hiliteColor", "textStyle"],
            ["removeFormat"],
            ["outdent", "indent"],
            ["align", "horizontalRule", "list", "lineHeight"],
            [
              "-right",
              ":i-More Misc-default.more_vertical",
              "fullScreen",
              "showBlocks",
              "codeView",
              "preview",
            ],
            [
              "-right",
              ":r-More Rich-default.more_plus",
              "table",
              "imageGallery",
            ],
            ["-right", "image", "video", "audio", "link"],
            // (min-width: 992)
            [
              "%992",
              [
                ["undo", "redo"],
                [
                  ":p-More Paragraph-default.more_paragraph",
                  "font",
                  "fontSize",
                  "formatBlock",
                  "paragraphStyle",
                  "blockquote",
                ],
                ["bold", "underline", "italic", "strike"],
                [
                  ":t-More Text-default.more_text",
                  "subscript",
                  "superscript",
                  "fontColor",
                  "hiliteColor",
                  "textStyle",
                ],
                ["removeFormat"],
                ["outdent", "indent"],
                ["align", "horizontalRule", "list", "lineHeight"],
                [
                  "-right",
                  ":i-More Misc-default.more_vertical",
                  "fullScreen",
                  "showBlocks",
                  "codeView",
                  "preview",
                ],
                [
                  "-right",
                  ":r-More Rich-default.more_plus",
                  "table",
                  "link",
                  "image",
                  "video",
                  "audio",
                  "imageGallery",
                ],
              ],
            ],
            // (min-width: 767)
            [
              "%767",
              [
                ["undo", "redo"],
                [
                  ":p-More Paragraph-default.more_paragraph",
                  "font",
                  "fontSize",
                  "formatBlock",
                  "paragraphStyle",
                  "blockquote",
                ],
                [
                  ":t-More Text-default.more_text",
                  "bold",
                  "underline",
                  "italic",
                  "strike",
                  "subscript",
                  "superscript",
                  "fontColor",
                  "hiliteColor",
                  "textStyle",
                ],
                ["removeFormat"],
                ["outdent", "indent"],
                [
                  ":e-More Line-default.more_horizontal",
                  "align",
                  "horizontalRule",
                  "list",
                  "lineHeight",
                ],
                [
                  ":r-More Rich-default.more_plus",
                  "table",
                  "link",
                  "image",
                  "video",
                  "audio",
                  "imageGallery",
                ],
                [
                  "-right",
                  ":i-More Misc-default.more_vertical",
                  "fullScreen",
                  "showBlocks",
                  "codeView",
                  "preview",
                ],
              ],
            ],
            // (min-width: 480)
            [
              "%480",
              [
                ["undo", "redo"],
                [
                  ":p-More Paragraph-default.more_paragraph",
                  "font",
                  "fontSize",
                  "formatBlock",
                  "paragraphStyle",
                  "blockquote",
                ],
                [
                  ":t-More Text-default.more_text",
                  "bold",
                  "underline",
                  "italic",
                  "strike",
                  "subscript",
                  "superscript",
                  "fontColor",
                  "hiliteColor",
                  "textStyle",
                  "removeFormat",
                ],
                [
                  ":e-More Line-default.more_horizontal",
                  "outdent",
                  "indent",
                  "align",
                  "horizontalRule",
                  "list",
                  "lineHeight",
                ],
                [
                  ":r-More Rich-default.more_plus",
                  "table",
                  "link",
                  "image",
                  "video",
                  "audio",
                  "imageGallery",
                ],
                [
                  "-right",
                  ":i-More Misc-default.more_vertical",
                  "fullScreen",
                  "showBlocks",
                  "codeView",
                  "preview",
                ],
              ],
            ],
          ],
          defaultStyle: `font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; text-size: 14px;`,
        }}
        lang="pt_br"
      />
  );
}

export default TextEditor;