import React from "react";
import "../shared/InfoPage.css";
import "./PivotPointsPage.css";

const PivotPointsPage = () => {
  return (
    <div className="info-page">
      <div className="info-content">
        <header className="info-header">
          <h1>What are Pivot Points?</h1>
          <p>
            The <i>ultimate</i> metric of a player based on goals, assists, TODO
          </p>
        </header>

        <main className="info-main">
          <section className="info-section">
            <h2>Comparison</h2>
            <p>
              The main goal in the development of this point system was to be
              able to compare players, regardless of whether they are a handler
              or a cutter, as well as to be able to compare teams to one
              another.
            </p>
          </section>

          <section className="info-section">
            <h2>Limitations</h2>
            <div className="limitation-explanation">
              <p>
                The biggest limitation of our stadisctict is actually how we get
                it. <i>ultimate</i>ly we suffer from a lack of data. Currently
                we hand enter all of the data for each player and do not scrape
                any sources, although do acknowledge that we enter our data
                based off what is in USAU's website. Due to this limitation
                however there just isn't the information we need for other
                levels of competition. We have found single events where stats
                are kept and tracked and considered entering single events
                although deemed that if we can't do this for all single events
                we shouldn't do them for any as it raises concerns over the
                validity of data. <i>Ultimately</i> we hope that in the near
                future we can get data for regionals levels events.
              </p>
              <div className="important-highlight">
                <strong>TLDR:</strong> Data will not be accurate for players who
                do not make it to nationals level competitions.
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PivotPointsPage;
