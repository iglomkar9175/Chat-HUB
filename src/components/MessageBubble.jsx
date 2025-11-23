import React from "react";

export default function MessageBubble({ text, me, ts, type }) {
  return (
    <div className={`msg-row ${me ? "me" : "them"}`}>
      <div className="msg-wrapper">
        
        <div className={`msg-bubble ${me ? "me" : "them"}`}>
          {type === "image" ? (
            <img
              src={text}
              style={{
                maxWidth: "260px",
                borderRadius: 14,
                display: "block",
              }}
            />
          ) : (
            text
          )}
        </div>

        <div className="msg-ts">{ts}</div>
      </div>
    </div>
  );
}


