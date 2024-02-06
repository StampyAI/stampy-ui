import React from "react";
import "./stampy.css";

export const WidgetStampy = () => {
  return (
    <div className={"widget-group"}>
      <div className={"widget-header"}>
        <p className={"widget-title"}>Questions?</p>
        <p className={"widget-subtitle"}>
          Ask Stampy any question about AI Safety
        </p>
      </div>

      <div className={"widget-chat-group"}>
        <div className={"chat-message"}>
          <img
            className={"stampyIcon"}
            alt=""
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a4dbb68cb3eefe4538c935148f0c71195a9e82a8605a7945521cd1905676e15?apiKey=f1073757e44b4ccd8d59791af6c41a77&"
          />
          <div className={"chat-incoming-message"}>
            <div className={"widget-conversation-start-header"}>
              Try asking me...
            </div>
            {/*<img className={"rectangleIcon"} alt="" src="Rectangle.svg" />*/}
            <div className={"widget-start-conversation"}>
              <div className={"input-label"}>
                Why couldn’t we just turn the AI off?
              </div>
            </div>
            <div className={"widget-start-conversation"}>
              <div className={"input-label"}>
                How would the AI even get out in the world?
              </div>
            </div>
            <div className={"widget-start-conversation"}>
              <div className={"input-label"}>
                Do people seriously worry about existential risk from AI?
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={"widget-ask"}>
        <div className={"widget-textbox"}>
          <input
            type={"text"}
            className={"widget-input"}
            placeholder={"Ask Stampy a question..."}
          />
        </div>
        <div className={"send-button-group"}>
          <div className={"send-button"} />
          <img
            className={"send-button-icon"}
            alt=""
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a970d700a49436e66b549fb8459a9475449f53a9ecf753531a1dc30747212a35?apiKey=f1073757e44b4ccd8d59791af6c41a77&"
          />
        </div>
      </div>
    </div>
  );
};
