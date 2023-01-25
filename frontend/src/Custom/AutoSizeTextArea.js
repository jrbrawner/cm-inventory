import React from "react";

const MIN_TEXTAREA_HEIGHT = 32;

export default function App(props) {
  const textareaRef = React.useRef(null);
  const [value, setValue] = React.useState("");
  const onChange = (event) => setValue(event.target.value);

  React.useLayoutEffect(() => {
    // Reset height - important to shrink on delete
    textareaRef.current.style.height = "inherit";
    // Set height
    textareaRef.current.style.height = `${Math.max(
      textareaRef.current.scrollHeight + 4,
      MIN_TEXTAREA_HEIGHT
    )}px`;
  }, [value]);

  if (props.dynamic === true){
    return (
      <textarea
        className={props.className}
        onChange={onChange}
        ref={textareaRef}
        style={{
          minHeight: MIN_TEXTAREA_HEIGHT,
          resize: "none"
        }}
        value={value}
      />
    );
  }
  return (
    <textarea
      className={props.className}
      onChange={onChange}
      ref={textareaRef}
      style={{
        minHeight: MIN_TEXTAREA_HEIGHT,
        resize: "none"
      }}
      disabled
      value={props.value}
    />
  );

}
