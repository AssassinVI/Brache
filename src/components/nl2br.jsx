import React from 'react'

function nl2br(text) {
    return text?.split('\n').map((line, index) => (
      index === 0 ? line : <React.Fragment key={index}><br />{line}</React.Fragment>
    ));
  }

function TextWithNewlines({ text }) {
  const processedText = nl2br(text);

  return (
    <div>
      {processedText}
    </div>
  );
}

export default TextWithNewlines;