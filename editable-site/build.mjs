import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const data = JSON.parse(fs.readFileSync(path.join(root, "content/site.json"), "utf8"));
let html = fs.readFileSync(path.join(root, "src/index.template.html"), "utf8");

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const renderLinks = (links = []) => links.length
  ? `<div class="paper-links">${links.map(link => `<a href="${esc(link.url)}">${esc(link.label)}</a>`).join("")}</div>`
  : "";

const renderPaper = paper => `
        <article class="paper">
          <h4>${paper.url ? `<a href="${esc(paper.url)}">${esc(paper.title)}</a>` : esc(paper.title)}</h4>
          <div class="paper-status">${esc(paper.status)}</div>
          <p class="authors">${esc(paper.authors)}</p>
          ${renderLinks(paper.links)}
          <details><summary>Abstract</summary><p>${esc(paper.abstract)}</p></details>
        </article>`;

const renderProject = project => `<article class="project"><h4>${esc(project.title)}</h4><p>${esc(project.authors)}</p>${project.status ? `<span>${esc(project.status)}</span>` : ""}${project.partners ? `<p class="partners">${esc(project.partners)}</p>` : ""}</article>`;

const renderTeaching = entry => `<div><span>${esc(entry.institution)}</span>${entry.courses.map(course => `<p>${esc(course)}</p>`).join("")}${entry.honor ? `<p class="teaching-honor">${esc(entry.honor)}</p>` : ""}</div>`;

html = html.replace(
  /<p class="lead">[\s\S]*?<\/p>\s*<p>[\s\S]*?<\/p>\s*<p>[\s\S]*?<\/p>/,
  `<p class="lead">${esc(data.bio.lead)}</p>
        <p>${esc(data.bio.research)}</p>
        <p>${esc(data.bio.education)}</p>`
);

html = html.replace(
  /(<div class="research-group">\s*<h3>Publications and accepted papers<\/h3>)[\s\S]*?(?=\s*<\/div>\s*<div class="research-group">\s*<h3>Working papers<\/h3>)/,
  `$1
${data.publications.map(renderPaper).join("\n")}
      `
);

html = html.replace(
  /(<div class="research-group">\s*<h3>Working papers<\/h3>)[\s\S]*?(?=\s*<\/div>\s*<div class="research-group compact-group">)/,
  `$1
${data.working_papers.map(renderPaper).join("\n")}
      `
);

html = html.replace(
  /(<div class="research-group compact-group">\s*<h3>Work in progress<\/h3>)[\s\S]*?(?=\s*<\/div>\s*<\/section>\s*<section class="teaching")/,
  `$1
        ${data.work_in_progress.map(renderProject).join("\n        ")}
      `
);

html = html.replace(
  /<div class="course-list">[\s\S]*?<\/div>\s*<\/section>\s*<\/main>/,
  `<div class="course-list">
        ${data.teaching.map(renderTeaching).join("\n        ")}
      </div>
    </section>
  </main>`
);

fs.rmSync(path.join(root, "dist"), { recursive: true, force: true });
fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.cpSync(path.join(root, "static/assets"), path.join(root, "dist/assets"), { recursive: true });
fs.writeFileSync(path.join(root, "dist/index.html"), html);

