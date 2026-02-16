import Backdrop from "../../components/Backdrop";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import styles from "../legal.module.scss";

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <Backdrop />
      <Header />
      <main className={styles.main}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Terms</p>
          <h1>Terms of service</h1>
          <p className={styles.subhead}>
            By using ResumeTailor, you agree to these terms. Last updated: Feb
            13, 2026.
          </p>
        </header>

        <section className={styles.section}>
          <h2>Use of the service</h2>
          <p>
            You may use the service to generate tailored resumes and related
            files. You are responsible for the accuracy of content you upload or
            submit.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Account responsibilities</h2>
          <ul className={styles.list}>
            <li>Keep your login details secure.</li>
            <li>Do not share access outside your organization.</li>
            <li>Notify us if you suspect unauthorized use.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Prohibited activities</h2>
          <ul className={styles.list}>
            <li>Uploading content you do not have rights to use.</li>
            <li>Attempting to reverse engineer or disrupt the service.</li>
            <li>Using the service to generate harmful or misleading content.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Availability and changes</h2>
          <p>
            We may update or discontinue features at any time. We will make
            reasonable efforts to provide notice for major changes.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Disclaimers</h2>
          <p>
            The service is provided "as is" without warranties of any kind. We
            do not guarantee interview outcomes or hiring decisions.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
