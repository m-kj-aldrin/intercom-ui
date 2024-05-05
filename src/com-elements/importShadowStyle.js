let shadowStyleText = await (await fetch("/src/style/shadow.css")).text();
let shadowStyleSheet = new CSSStyleSheet();
shadowStyleSheet.replaceSync(shadowStyleText);
document.adoptedStyleSheets.push(shadowStyleSheet);

export {};
