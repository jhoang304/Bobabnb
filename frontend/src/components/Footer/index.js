import React from 'react';
import './Footer.css';

const profileLinks = [
  { name: 'GitHub', url: 'https://github.com/jhoang304', icon: 'fa-brands fa-github' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/joshua-hoang-47979426b/', icon: 'fa-brands fa-linkedin' }
];

function Footer() {
  return (
    <footer className="Footer">
      <div className="footer-credit">Built by Joshua Hoang</div>
      <ul className="footer-links">
        {profileLinks.map(link => (
          <li key={link.name}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <i className={link.icon} aria-hidden="true" />
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}

export default Footer;
