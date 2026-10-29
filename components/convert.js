const fs = require('fs');

let html = fs.readFileSync('d:/Rajesh_zunasoft/formX-20-08/Archive 2/components/Advantage.html.txt', 'utf8');
let js = fs.readFileSync('d:/Rajesh_zunasoft/formX-20-08/Archive 2/components/Advantage.js.txt', 'utf8');

// convert HTML to JSX
html = html.replace(/class=/g, 'className=');
html = html.replace(/style="([^"]*)"/g, (match, p1) => {
    const styleObj = {};
    p1.split(';').forEach(pair => {
        if (!pair.trim()) return;
        let [key, value] = pair.split(':');
        if(!value) return;
        key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styleObj[key] = value.trim();
    });
    return 'style={' + JSON.stringify(styleObj) + '}';
});

// Self closing tags in SVG
html = html.replace(/<line (.*?)>/g, '<line $1 />');
html = html.replace(/<rect (.*?)>/g, '<rect $1 />');
html = html.replace(/<circle (.*?)>/g, '<circle $1 />');
html = html.replace(/<path (.*?)>/g, '<path $1 />');

// Attributes
html = html.replace(/stroke-width=/g, 'strokeWidth=');
html = html.replace(/stroke-dasharray=/g, 'strokeDasharray=');
html = html.replace(/stroke-dashoffset=/g, 'strokeDashoffset=');
html = html.replace(/tabindex=/g, 'tabIndex=');
html = html.replace(/<br>/g, '<br />');

// JS modifications for scoped queries
let reactJs = js
    .replace(/document\.querySelector/g, 'q')
    .replace(/document\.querySelectorAll/g, 'qAll')
    .replace(/document\.getElementById\('([^']+)'\)/g, 'q("#$1")')
    .replace(/addEventListener\('resize', fitIso\);/g, 'window.addEventListener("resize", fitIso);')
    .replace(/addEventListener\('resize', fit\);/g, 'window.addEventListener("resize", fit);')
    .replace(/addEventListener\('orientationchange', fit\);/g, 'window.addEventListener("orientationchange", fit);');


let jsx = `"use client";
import { useEffect, useRef } from 'react';
import './Advantage.css';

export default function Advantage() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // We scope queries to the component root
    const q = (sel) => root.querySelector(sel);
    const qAll = (sel) => [...root.querySelectorAll(sel)];

    ${reactJs}

  }, []);

  return (
    <div ref={rootRef} className="fx-advantage-wrapper">
      ${html}
    </div>
  );
}
`;

fs.writeFileSync('d:/Rajesh_zunasoft/formX-20-08/Archive 2/components/Advantage.js', jsx);
console.log("Done");
