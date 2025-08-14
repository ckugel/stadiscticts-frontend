import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import "../shared/InfoPage.css";

const AboutPage = () => {
  return (
    <div className="info-page">
      <div className="info-content">
        <header className="info-header">
          <h1>About Stadiscticts</h1>
        </header>
        <main className="info-main">
          <section className="info-section">
            <h2>What We Are Trying To Do</h2>
            <p>
              Stadiscticts is a passion project for the Ultimate frisbee
              community. We aim to provide a platform where players and fans of
              the sport can see about <b>themselves</b>. In addition to that we
              want people in the community to be able to compare rosters to see
              how well teams can do against each other. We also want to provide
              league rankings of both teams and players, however that is a
              feature that is still in development.
            </p>
          </section>

          <section className="info-section">
            <h2>How We Are Trying To Do That</h2>
            <p>
              We are utilizing a metric called pivot points that combines
              statisticts from public USAU tournament information. You can learn
              more about them{" "}
              <Link to="/Pivot-points-explained" className="info-link">
                <b>
                  <u>here</u>
                </b>
              </Link>
              .
            </p>
          </section>

          <section className="info-section">
            <h2>Limitations</h2>
            <p>
              We are very limited by the data that we can collect as well as the
              time of the developers. All the time to make this project has been
              donated by the team for the community.
            </p>
          </section>

          <section className="info-section">
            <h2>The Team</h2>
            <p>
              We are passionate ultimate frisbee players comprised of a data
              enthusiast who designed the pivot point system, and a software
              developer (student) who built this website. (which is their first
              website)
            </p>

            <h3>
              <b>Tech stack of this website</b>
            </h3>
            <p>
              I figure only a few nerds will read this, but if you are curious
              about the tech stack of the website it is a Javascript React
              frontend with a Java Spring Boot backend, with an in memory
              database. If I were to start again I would use typescript with LIT
              for web components and angular for the framework, but I am not
              going to rewrite the whole thing anytime soon.
            </p>
            <h4>
              <b>Note from the developer</b>
            </h4>
            <p>
              No AI was used in the development of this website (Neovim btw)
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AboutPage;
