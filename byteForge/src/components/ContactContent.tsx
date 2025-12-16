import "@/styles/contactContent.scss";
import { useState } from "react";

const ContactContent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [check, setCheck] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const sendMessageContent = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!name || !email || !subject || !messageContent) {
      setCheck({ type: "error", text: "Please fill in all fields" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setCheck({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    try {
      const res = await fetch("http://192.168.1.105:3000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, messageContent }),
      });

      const data = await res.json();

      if (res.ok) {
        setCheck({
          type: "success",
          text: "Your message has been sent successfully",
        });
        setName("");
        setEmail("");
        setSubject("");
        setMessageContent("");
        setLoading(true);
      } else {
        setCheck({
          type: "error",
          text: data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="contact-content-container">
        <div className="contact-content-container-top">
          <h1>CONTACT US</h1>
          <h2>
            Have a question or need assistance? Reach out to us through the form
            below.
          </h2>
        </div>
        <div className="contact-content-container-bottom">
          {check && (
            <div className={`error-display ${check.type}`}>{check.text}</div>
          )}

          <div className="input-container">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </div>
          <div className="input-container">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="input-container">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
            />
          </div>
          <div className="input-container message-container">
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Message"
            />
          </div>

          <div className="send-button-container">
            <button
              className="send-button"
              onClick={(e) => sendMessageContent(e)}
            >
              {loading ? "..." : "SEND"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ContactContent;
