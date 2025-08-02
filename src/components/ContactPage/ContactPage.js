import React, { useState } from "react";
import "../shared/InfoPage.css";
import "./ContactPage.css";

const ContactPage = () => {
  return (
    <div className="info-page">
      <div className="info-content">
        <header className="info-header">
          <h1>Contact Us</h1>
          <p>
            Have questions, feedback, or suggestions? We'd love to hear from
            you!
          </p>
        </header>

        <main className="info-main">
          <div className="contact-info">
            <section className="info-section">
              <h2>Get in Touch</h2>
              <p>
                Whether you're a player looking for specific statistics or a
                developer interested in our data, here's our contact
                information. Please do note that we cannot guarantee, nor do we
                promise to get back to you but we will try our best to do so.
              </p>
            </section>

            <section className="info-section">
              <h2>Ways to Reach Us</h2>
              <div className="contact-methods">
                <div className="contact-method">
                  <h3>General Email</h3>
                  <p>info@stadiscticts.com</p>
                </div>
                <div className="contact-method">
                  <h3>Data Requests</h3>
                  <p>data@stadiscticts.com</p>
                </div>
                <div className="contact-method">
                  <h3>Technical Support</h3>
                  <p>support@stadiscticts.com</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContactPage;
