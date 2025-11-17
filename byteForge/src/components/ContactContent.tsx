import "@/styles/contactContent.scss";

const ContactContent = () => {
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
          <div className="input-container">
            <input type="text" placeholder="Name" />
          </div>
          <div className="input-container">
            <input type="email" placeholder="Email" />
          </div>
          <div className="input-container">
            <input type="text" placeholder="Subject" />
          </div>
          <div className="input-container message-container">
            <textarea placeholder="Message" />
          </div>

          <div className="send-button-container">
            <button className="send-button">SEND</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ContactContent;
