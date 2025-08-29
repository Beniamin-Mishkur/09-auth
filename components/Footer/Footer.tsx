import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Beniamin Mishkur</p>
          <p>
            Contact us:
            <a href="mailto:eks220885@gmail.com"> bmishkur@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
