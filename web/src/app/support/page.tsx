import Backdrop from "../../components/Backdrop";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import styles from "../legal.module.scss";

export default function SupportPage() {
  return (
    <div className={styles.page}>
      <Backdrop />
      <Header />
      <main className={styles.main}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Support</p>
          <h1>Contact support</h1>
          <p className={styles.subhead}>
            Tell us what you are trying to achieve and we will help you get
            there faster.
          </p>
        </header>

        <section className={styles.section}>
          <h2>How to reach us</h2>
          <div className={styles.grid}>
            <div className={styles.contactCard}>
              <strong>Email</strong>
              <p>
                Send details and attachments to
                {" "}
                <a href="mailto:support@resumetailor.com">support@resumetailor.com</a>.
              </p>
            </div>
            <div className={styles.contactCard}>
              <strong>Response times</strong>
              <p>Most requests are answered within 1 business day.</p>
            </div>
            <div className={styles.contactCard}>
              <strong>Include this</strong>
              <p>
                The role you are targeting, the issue you saw, and screenshots
                if possible.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Common requests</h2>
          <ul className={styles.list}>
            <li>Update tailored resume outputs and file downloads.</li>
            <li>Billing and plan changes.</li>
            <li>Data deletion or export requests.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
