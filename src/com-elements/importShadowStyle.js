let shadowStyleSheet = new CSSStyleSheet();
let shadowStyleText = await (await fetch("/src/style/shadow.css")).text();
shadowStyleSheet.replaceSync(shadowStyleText);
document.adoptedStyleSheets.push(shadowStyleSheet);

export {};
