const replace = require("replace-in-file");
const indexFileOptions = {
  files: "./out/index.html",
  from: [/\/_next/g, /school\/.{1,10}"/g],
  to: [
    "./_next",
    (match) => {
      console.log(match);
      return match.substring(0, match.length - 1) + '/index.html"';
    },
  ],
};

const schooldsOptions = {
  files: "./out/school/**/*.html",
  from: /\/_next/g,
  to: "../../_next",
};

async function main() {
  await replace(indexFileOptions);
  await replace(schooldsOptions);
  console.log("finished");
}

main();
