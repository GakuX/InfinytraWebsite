import type { Metadata } from "next";
import Link from "next/link";
import NavbarClient from './components/NavbarClient';
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";

export const metadata: Metadata = {
    title: 'Infinytra - Progressive Metal Band',
    description: 'Official website of Infinytra, a progressive-metal band',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <header>
          {/* Sticky navbar */}
          <nav
            className="navbar navbar-expand-lg navbar-dark band-nav sticky-top "
            style={{ zIndex: 1030 }}
          >
            <NavbarClient />
            <div className="container-fluid">
              <Link href="/" className="navbar-brand fw-bold text-uppercase">
                <img
                  src="/images/infinytraremastered.png"
                  width="150"
                  height="93"
                  alt="Infinytra Logo"
                />
              </Link>

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mainNav"
                aria-controls="mainNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="navbar-collapse shadow-text buttonfonts" id="mainNav">
                <ul className="navbar-nav ms-auto gap-lg-3">
                  <li className="nav-item">
                    <Link href="/" className="nav-link" style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/albums" className="nav-link" style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
                      Albums
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/members" className="nav-link" style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
                      Band Members
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/merch" className="nav-link" style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
                      Merch
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a
                      href="https://discord.gg/3qstsyPE"
                      className="nav-link"
                      style={{
                        color: "white",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Discord
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="https://www.instagram.com/"
                      className="nav-link"
                      style={{
                        color: "white",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                  </li>
                  <li className="nav-item">
                    <Link href="/news-tours" className="nav-link" style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
                      News & Tours
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>

        <div className="container-fluid px-0">
          <main role="main" className="pb-3">
            {children}
          </main>
        </div>

        <footer className="footer ">
          <div className="footer-inner container-fluid">
            <div className="footer-left">
              <div className="band-title2">&copy; 2025 - Infinytra</div>
              <div className="footer-small">All rights reserved.</div>
            </div>

            <div className="footer-right footer-social">
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://discord.gg/3qstsyPE" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                <i className="fab fa-discord"></i>
              </a>
              <a href="/contact" aria-label="Contact">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
        </footer>

        {/* Bootstrap JS bundle for navbar toggle */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
    );
}