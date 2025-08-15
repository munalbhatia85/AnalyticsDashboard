import React from 'react';

export const HeaderComponent = ({ content, style }) => (
  <div style={style}>{content}</div>
);
export const FooterComponent = ({ content, style }) => (
  <div style={style}>{content}</div>
);
export const SidebarComponent = ({ content, style }) => (
  <div style={{ ...style, height: '100%' }}>{content}</div>
);
export const ButtonComponent = ({ content, style, onClick }) => (
  <button style={style} onClick={() => eval(onClick)}>{content}</button>
);
export const AnchorComponent = ({ content, style, href }) => (
  <a href={href} style={style}>{content}</a>
);

export const componentsMap = {
  header: HeaderComponent,
  footer: FooterComponent,
  sidebar: SidebarComponent,
  button: ButtonComponent,
  link: AnchorComponent
};
