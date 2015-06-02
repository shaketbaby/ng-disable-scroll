require('shelljs/global');

run("uglifyjs disable-scroll.js -c -m --bare-returns -o disable-scroll.min.js");
run("git commit -a -m 'minify source code'");
run("npm version " + (process.argv[2] || "minor"));

function run(cmd) {
  echo(cmd);
  if (exec(cmd).code !== 0) {
    exit(1);
  }
}
